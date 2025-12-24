import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ConversionService } from 'app/modules/conversion.service';
import { TreeNode } from 'primeng/api';
import { ConversionDashboardService } from '../conversion-dashboard/conversion-dashboard.service';
import { ConversionReportService } from 'app/modules/conversion-report.service';
import {FuseConfirmationService} from "../../../../@fuse/services/confirmation";
import { FileContentDialogComponent } from '../file-content-dialog/file-content-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-modernized-project-structure',
  templateUrl: './modernized-project-structure.component.html',
  styleUrls: ['./modernized-project-structure.component.scss']
})
export class ModernizedProjectStructureComponent implements OnInit {
  files: TreeNode[] = [];
  folderStructure: FileNode[] = [];
  sbDataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  ngDataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  ngTreeControl: FlatTreeControl<FileFlatNode>;
  sbTreeControl: FlatTreeControl<FileFlatNode>;
  hasChild = (_: number, node: FileFlatNode) => node.expandable;
  @Input() sbDestinationPath: string = '';
  @Input() ngDestinationPath: string = '';
  @Input() sbDestinationUrl: string = '';
  @Input() ngDestinationUrl: string = '';

  displayedColumns: string[] = ['project', 'manualChanges'];

  frontendDougnutStyle: any;
  backendDoughnutStyle: any;

  frontendConversionPercentage: any;
  backendConversionPercentage: any;
  dataSource = [
    {
      project: 'Spring Boot',
      manualChanges: [
        {
          title: 'POST Method',
          details: [
            'If @Data is not working, modify it with Getters and Setters for all fields.',
            'In the backend, if the parameter is passed as a RequestParam, change it to a RequestBody.',
          ],
        },
      ],
    },
    {
      project: 'Angular',
      manualChanges: [
        {
          title: 'POST Method',
          details: [
            'Set the response body to include the form values as the payload.',
            'Change the API URL according to the respective backend API.',
            'Map full values (e.g., Male, Female) to corresponding codes (e.g., M, F).',
          ],
        },
        {
          title: 'GET Method',
          details: ['Change the API URL according to the respective backend API.'],
        },
        {
          title: 'Dropdown Changes',
          details: [
            'Ensure you’re passing the correct data structure to the backend, including both fieldCode and fieldValue.',
          ],
        },
        {
          title: 'Navigation from One Component to Another',
          details: [
            'Import the Router from @angular/router to enable programmatic navigation between components.',
            'Inject the Router service in the constructor so it can be used for navigation.',
            'Use this.router.navigate() to navigate to the desired component.',
          ],
        },
      ],
    },
  ];
  selectedFileContent: string ='';

  constructor(private streamService: ConversionService, private fuseConfirmationService: FuseConfirmationService, 
    private dialog: MatDialog, private conversionReport: ConversionReportService) {
    const transformer = (node: FileNode, level: number) => {
      return {
        name: node.name,
        type: node.type,
        level: level,
        expandable: !!node.content?.length,
        fileSize: node.fileSize,
        fileCount: node.fileCount,
        path: node.path
      };
    };

    this.sbTreeControl = new FlatTreeControl<FileFlatNode>(
      (node) => node.level,
      (node) => node.expandable
    );
    this.ngTreeControl = new FlatTreeControl<FileFlatNode>(
      (node) => node.level,
      (node) => node.expandable
    );

    this.sbDataSource = new MatTreeFlatDataSource(
      this.sbTreeControl,
      new MatTreeFlattener(
        transformer,
        (node) => node.level,
        (node) => node.expandable,
        (node) => node.content
      )
    );
    this.ngDataSource = new MatTreeFlatDataSource(
      this.ngTreeControl,
      new MatTreeFlattener(
        transformer,
        (node) => node.level,
        (node) => node.expandable,
        (node) => node.content
      )
    );
  }

  ngOnInit(): void {
    this.backendDoughnutStyle = this.conversionReport.getBackendDoughnutStyle();
    this.frontendDougnutStyle = this.conversionReport.getFrontendDoughnutStyle();

    this.backendConversionPercentage = this.conversionReport.getBackendConversion();
    this.frontendConversionPercentage = this.conversionReport.getFrontendConversion();

    console.log(`sbDestinationPath from modernized: ${this.sbDestinationPath}`);
    console.log(`ngDestinationPath from modernized: ${this.ngDestinationPath}`);


    let correctSbPath = this.sbDestinationPath.replace(/\\/g, "\\").replace(/\//g, "\\");
    let correctNgPath = this.ngDestinationPath.replace(/\\/g, "\\").replace(/\//g, "\\");
    const trimmedPathSb = correctSbPath.substring(0, correctSbPath.lastIndexOf('\\', correctSbPath.length - 2) + 1);

    const trimmedPathNg = correctNgPath.substring(0, correctNgPath.lastIndexOf('\\', this.ngDestinationPath.length - 2) + 1);

    this.streamService.getProjectFolderStructure(trimmedPathSb).subscribe(data => {
      // this.files = data;
      this.folderStructure = this.buildFolderStructureBackend(data);
      this.sbDataSource.data = this.folderStructure;
    });

    this.streamService.getProjectFolderStructure(trimmedPathNg).subscribe(data => {
      // this.files = data;
      this.folderStructure = this.buildFolderStructureBackend(data);
      this.ngDataSource.data = this.folderStructure;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const firstSbFolder = this.sbTreeControl.dataNodes.find(node => node.type === 'folder');
      if (firstSbFolder) {
        this.sbTreeControl.expand(firstSbFolder);
      }
  
      const firstNgFolder = this.ngTreeControl.dataNodes.find(node => node.type === 'folder');
      if (firstNgFolder) {
        this.ngTreeControl.expand(firstNgFolder);
      }
    }, 200);
   
  }
  
  buildFolderStructureBackend(files: any): FileNode[] {
    const map: { [key: string]: FileNode } = {};
    const roots: FileNode[] = [];
    const rootFiles = files.children || [files];

    rootFiles.forEach((file) => {
      this.processFile(file, '', map, roots);
    });
    return roots;
  }
  processFile(file: any, parentPath: string, map: { [key: string]: FileNode }, roots: FileNode[]): void {
    let currentNode = file;
    let fullPath = parentPath ? `${parentPath}/${currentNode.name}` : currentNode.name;
    let mergedName = currentNode.name;

    // Merge consecutive single-child nodes into one path
    while (currentNode.children && currentNode.children.length === 1 && !currentNode.children[0].file) {
      currentNode = currentNode.children[0];  // Move down the hierarchy
      mergedName += `/${currentNode.name}`;   // Concatenate names
      fullPath = parentPath ? `${parentPath}/${mergedName}` : mergedName;
    }

    const node: FileNode = {
      name: mergedName,
      type: currentNode.file ? 'file' : 'folder',
      fileSize: currentNode.fileSize || 0,
      fileCount: currentNode.children?.length || 0,
      content: [],
      fileContent: currentNode.file && currentNode.fileContent ? atob(currentNode.fileContent) : undefined,
      path: fullPath,
    };

    map[fullPath] = node;

    if (parentPath === '') {
      roots.push(node);  // Add to root if it's a top-level node
    } else {
      const parent = map[parentPath];
      parent?.content.push(node);  // Add to parent's content
    }

    // Recursively process children if it's a folder and has contents
    if (currentNode.children) {
      currentNode.children.forEach(child => {
        this.processFile(child, fullPath, map, roots);  // Continue processing
      });
    }
  }

  downloadPdf(): void {
    const pdfData = this.conversionReport.getPdfData();
    if (pdfData) {
      // Convert Base64 data URI to a Blob
      const byteCharacters = atob(pdfData.split(',')[1]); // Decode Base64
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Create a download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'struts-conversion-report.pdf';
      document.body.appendChild(link);
      link.click();

      // Cleanup
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    } else {
      console.error('No PDF data available');
    }
  }
  onFileClick(node: any) {
    if (node.type === 'file') {
      let base = this.getBasePath(node.path);
      console.log('Node path will be: ',node.path);
      
      this.streamService.clonedDirFileContent(base, node.path).subscribe(
        (content: string) => {
          this.selectedFileContent = content;
          this.openFileContentDialog(node.name, this.selectedFileContent);
        },
        (error) => {
          console.error('Error loading file content:', error);
          this.selectedFileContent = 'Error loading file content.';
          this.openFileContentDialog(node.name, this.selectedFileContent);
        }
      );
    }
  }
  getBasePath(filePath: string): string {
    if (filePath.includes("struts-application-mds-model")) {
      return "structs";
    } else if (filePath.includes("spring")) {
      return "spring"; 
    } else if (filePath.includes("angular")) {
      return "angular";
    }
    return "structs";
  }
    
    openFileContentDialog(fileName: string, content: string): void {
      this.dialog.open(FileContentDialogComponent, {
        width: '90vw',
        maxWidth: '800px',
        data: { fileName, content }
      });
    }

  // private openFileContentDialog(fileName: string, fileContent: string) {
  //   const dialogRef = this.fuseConfirmationService.open({
  //     icon: {
  //       show: false,
  //     },
  //     title: `<strong>File Name: ${fileName}</strong>`,
  //     message: `<pre>${fileContent}</pre>`,
  //     actions: {
  //       confirm: {
  //         label: 'Close',
  //         color: 'primary'
  //       },
  //       cancel: {
  //         show: false   
  //       }
  //     },
  //     dismissible: true
  //   });

  //     dialogRef.addPanelClass('custom-file-content-dialog');
  //     dialogRef.afterClosed().subscribe((result) => {
  //     console.log('Dialog closed:', result);
  //   });
  // }


}

export interface FileNode {
  name: string;
  type: string;
  fileSize?: number;
  fileCount?: number;
  content?: FileNode[];
  fileContent?: string;
  originalPath?: string;
  path?: string; // Add path property
}

export interface FileFlatNode {
  name: string;
  type: string;
  level: number;
  expandable: boolean;
  fileSize?: number;
  fileCount?: number;
  content?: any[];
  originalPath?: string;
  path?: string; // Add path property
}