import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {FlatTreeControl} from "@angular/cdk/tree";
import {ConversionService} from "../conversion.service";

@Component({
  selector: 'app-file-structure',
  templateUrl: './file-structure.component.html',
  styleUrls: ['./file-structure.component.scss'],

})
export class FileStructureComponent implements OnInit,OnDestroy {

  folderPath: string = '';  // Input path from user
  folderStructure: FileNode[] = [];
  treeControl: FlatTreeControl<FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  displayedColumns: string[] = ['name', 'status'];
  methods = [
    { name: 'addDependencyToBuildGradleFile', status: 'Pending' },
    { name: 'copyStrutsCommonFileToSpringBoot', status: 'Pending' },
    { name: 'translateStrutsActionsToSpringBootRests', status: 'Pending' },
    { name: 'translateStrutsFormsToSpringBootRequestBean', status: 'Pending' },
  ];

  private eventSource: EventSource | null = null;
  private streamActive: boolean=false;
  startStream(): void {
    if (!this.streamActive) {
      this.streamActive = true;

      this.eventSource = this.streamService.connect();

      // Event listener for method start
      this.eventSource.addEventListener('method-start', (event: any) => {
        const data = event.data;
        this.updateStatus(data.split(': ')[1], 'Started');
      });

      // Event listener for method end
      this.eventSource.addEventListener('method-end', (event: any) => {
        const data = event.data;
        this.updateStatus(data.split(': ')[1], 'Completed');
        // Check if all methods are completed
        if (this.methods.every((method) => method.status === 'Completed')) {
          this.stopStream();
        }
      });

      // Event listener for errors
      this.eventSource.addEventListener('error', (event: any) => {
        console.error('Error event: ', event);
        this.stopStream();
      });
    }
  }

  updateStatus(methodName: string, status: string): void {
    const method = this.methods.find((m) => m.name === methodName);
    if (method) {
      method.status = status;
    }
  }

  stopStream(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.streamActive = false;
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  ngOnDestroy(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  constructor(private streamService: ConversionService) {
    // Transform folder structure to flat node format
    const transformer = (node: FileNode, level: number) => {
      return {
        name: node.name,
        type: node.type,
        level: level,
        content: node.content,
      };
    };

    this.treeControl = new FlatTreeControl<FileFlatNode>(
        (node) => node.level,
        (node) => node.type === 'folder' && node.content?.length > 0
    );

    this.dataSource = new MatTreeFlatDataSource(
        this.treeControl,
        new MatTreeFlattener(transformer, (node) => node.level, (node) => node.type === 'folder' && node.content?.length > 0, (node) => node.content)
    );
  }

  ngOnInit(): void {}


  onFolderPathSubmit() {
    this.streamService.listFiles(this.folderPath)
        .subscribe({
          next: (files) => {
            console.log("Files from backend:", files);
            this.folderStructure = this.buildFolderStructureBackend(files);
            this.dataSource.data = this.folderStructure;
          },
          error: (error) => {
            console.error("Error fetching files:", error);
            alert("Failed to retrieve files. Please check the console for more details.");
          },
        });
  }




  onFolderUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      // Build folder structure and set data for tree
      this.folderStructure = this.buildFolderStructure(files);
      this.dataSource.data = this.folderStructure;
      console.log(this.dataSource);
      // this.treeControl.expandAll();
    }
  }
  buildFolderStructureBackend(files: any): FileNode[] {
    const map: { [key: string]: FileNode } = {};
    const roots: FileNode[] = [];

    // Check if the data is wrapped inside a root object
    const rootFiles = files.children || [files];  // Handle case where root itself is the only node

    rootFiles.forEach((file) => {
      // Recursively process the files and folders
      this.processFile(file, '', map, roots);
    });

    return roots;
  }

  processFile(file: any, parentPath: string, map: { [key: string]: FileNode }, roots: FileNode[]): void {
    const parts = file.relativePath.split('\\');
    let parent: FileNode | undefined = undefined;

    // Go through each part of the relative path to create nodes
    parts.forEach((part, index) => {
      const path = parts.slice(0, index + 1).join('\\');

      if (!map[path]) {
        const isFile = index === parts.length - 1 && file.file;
        const node: FileNode = { name: part, type: isFile ? 'file' : 'folder', content: [] };
        map[path] = node;

        if (index === 0 && parentPath === '') {
          roots.push(node); // If it's the root folder
        } else {
          parent?.content?.push(node); // Add to the parent folder's children
        }
      }

      parent = map[path]; // Set current folder as the parent for the next iteration
    });

    // If this file has children (it's a folder), process those as well
    if (file.children && file.children.length > 0) {
      file.children.forEach((childFile: any) => {
        this.processFile(childFile, file.relativePath, map, roots);
      });
    }
  }


  buildFolderStructure(files: File[]): FileNode[] {
    const folderMap: { [key: string]: any } = {};

    files.forEach((file) => {
      const pathParts = file.webkitRelativePath.split('/');
      let currentLevel = folderMap;

      pathParts.forEach((part, index) => {
        if (index === pathParts.length - 1) {
          // This is a file
          currentLevel[part] = file;
        } else {
          // This is a folder
          if (!currentLevel[part]) {
            currentLevel[part] = {};
          }
          currentLevel = currentLevel[part];
        }
      });
    });

    return this.convertToTree(folderMap);
  }

  convertToTree(folderMap: { [key: string]: any }): FileNode[] {
    return Object.keys(folderMap).map((key) => {
      const value = folderMap[key];
      return {
        name: key,
        type: value instanceof File ? 'file' : 'folder',
        content: value instanceof File ? [] : this.convertToTree(value),
      };
    });
  }

  hasChild = (_: number, node: FileFlatNode) => node.type === 'folder' && node.content?.length > 0;
}

interface FileNode {
  name: string;
  type: string;
  content?: FileNode[];
}

interface FileFlatNode {
  name: string;
  type: string;
  level: number;
  content?: FileNode[];
}