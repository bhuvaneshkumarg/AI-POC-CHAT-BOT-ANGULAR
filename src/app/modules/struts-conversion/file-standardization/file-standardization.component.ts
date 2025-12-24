import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {ConversionService} from "../../conversion.service";
import {FuseConfirmationService} from "../../../../@fuse/services/confirmation";
import { FileManagerService, FileNode } from '../conversion-dashboard/file-manager.service';
import { FileFlatNode } from '../modernized-project-structure/modernized-project-structure.component';
import { MatDialog } from '@angular/material/dialog';
import { FileContentDialogComponent } from '../file-content-dialog/file-content-dialog.component';

@Component({
  selector: 'app-file-standardization',
  templateUrl: './file-standardization.component.html',
  styleUrls: ['./file-standardization.component.scss'],
})
export class FileStandardizationComponent implements OnInit, OnChanges {

  @Input() standardizedFolderData: any[]=[];
  treeControl: FlatTreeControl<FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  selectedFileContent: string = '';
  folderView :string='tree'

  hasChild = (_: number, node: FileFlatNode) => node.expandable;

  constructor(private streamService:ConversionService, 
              private fileManagerService:FileManagerService,
              private changeDet:ChangeDetectorRef,
              private fuseConfirmationService: FuseConfirmationService, 
              private dialog: MatDialog) {
    const transformer = (node: FileNode, level: number) => {
      return {
        name: node.name,
        type: node.type,
        level: level,
        expandable: !!node.content?.length,
        fileSize: node.fileSize,
        fileCount: node.fileCount,
        path:node.path
      };
    };

    this.treeControl = new FlatTreeControl<FileFlatNode>(
        (node) => node.level,
        (node) => node.expandable
    );

    this.dataSource = new MatTreeFlatDataSource(
        this.treeControl,
        new MatTreeFlattener(
            transformer,
            (node) => node.level,
            (node) => node.expandable,
            (node) => node.content
        )
    );
   }


  ngOnInit(): void {
    this.dataSource.data= this.standardizedFolderData
  }

  ngAfterViewInit() {
    const firstFileNode = this.treeControl.dataNodes.find(node => node.type === 'folder');
    if (firstFileNode) {
        this.treeControl.expand(firstFileNode);
    }
  }
  ngOnChanges(){
    this.dataSource.data= this.standardizedFolderData
  }
 
  getFileType(node: FileNode): string {
    if (node.type === 'file') {
      // Extract file extension
      const extension = node.name.substring(node.name.lastIndexOf('.')).toLowerCase();

      // Check if the extension is in the mapping and return the corresponding type
      if (FILE_TYPES[extension]) {
        return FILE_TYPES[extension];
      } else {
        return 'Other'; // Return a default message for unrecognized types
      }
    }
    return 'Folder'; // Return nothing for folders
  }

  onFileClick(node: any) {
    if (node.type === 'file') {
      let base = this.getBasePath(node.path);
      
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


const FILE_TYPES = {
  '.java': 'Java Source File',
  '.js': 'JavaScript File',
  '.ts': 'TypeScript File',
  '.html': 'HTML File',
  '.css': 'CSS File',
  '.xml': 'XML File',
  '.jsp': 'JSP File',
  '.json': 'JSON File',
  '.md': 'Markdown File',
  '.yml': 'YAML File',
  '.txt': 'Text File',
  '.png': 'Image File (PNG)',
  '.jpg': 'Image File (JPEG)',
  '.jpeg': 'Image File (JPEG)',
  '.gif': 'Image File (GIF)',
  '.svg': 'Image File (SVG)',
  '.pdf': 'PDF Document',
  '.doc': 'Word Document',
  '.xls': 'Excel Spreadsheet',
  '.ppt': 'PowerPoint Presentation',
  '.zip': 'ZIP Archive',
  '.tar': 'TAR Archive',
  '.rar': 'RAR Archive',
  '.exe': 'Executable File',
  '.dll': 'Dynamic Link Library',
  '.bat': 'Batch File',
  '.sh': 'Shell Script',
  '.ps1': 'PowerShell Script',
  '.py': 'Python Script',
  '.rb': 'Ruby Script',
  '.go': 'Go Source File',
  '.cpp': 'C++ Source File',
  '.h': 'C/C++ Header File',
  '.cs': 'C# Source File',
  '.swift': 'Swift Source File',
  '.php': 'PHP Script',
  '.sql': 'SQL Script',
  '.r': 'R Script',
  '.scala': 'Scala Source File',
  '.dart': 'Dart Source File',
  '.vue': 'Vue.js Component',
  '.svelte': 'Svelte Component',
  '.toml': 'TOML File',
  '.less': 'Less CSS File',
  '.sass': 'Sass CSS File',
  '.scss': 'SCSS CSS File',
  '.asm': 'Assembly Language File',
  '.apk': 'Android APK File',
  '.jar': 'Java Archive File',
  '.war': 'Web Archive File',
  '.ear': 'Enterprise Archive File',
  '.gitignore': 'Git Ignore File',
  '.dockerfile': 'Dockerfile',
  '.env': 'Environment Configuration File',
  '.vscode': 'VS Code Configuration',
  '.idea': 'IntelliJ IDEA Configuration'
  // Add more types as needed
};