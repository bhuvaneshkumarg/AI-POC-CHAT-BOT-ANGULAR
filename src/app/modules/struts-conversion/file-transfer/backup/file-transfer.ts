// import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
// import {FlatTreeControl} from "@angular/cdk/tree";
// import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
// import {ConversionService} from "../../conversion.service";
// import {FileFlatNode, FileNode} from "../file-standardization/file-standardization.component";
// import { FuseConfirmationService } from '@fuse/services/confirmation';

// @Component({
//   selector: 'app-file-transfer',
//   templateUrl: './file-transfer.component.html',
//   styleUrls: ['./file-transfer.component.scss']
// })
// export class FileTransferComponent implements OnInit {
//   @Input()
//   folderStructure: FileNode[] |FileFlatNode [] |any[] = [];
//   treeControl: FlatTreeControl<FileFlatNode>;
//   standardTreeControl: FlatTreeControl<FileFlatNode>;
//   oldTreeDataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
//   newTreeDataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
//   @Input() sourcePath: string = '';
//   @Input() clonedPath: string = '';
//   selectedNodes: FileFlatNode[] = [];
//   selectedNewFolder: FileFlatNode | null = null;

//   newFolderStructure: any[] = [
//     {
//       "name": "Struts-Application",
//       "type": "folder",
//       "fileSize": 0,
//       "fileCount": 2,
//       "content": [
//         {
//           "name": "StrutsCommon",
//           "type": "folder",
//           "fileSize": 0,
//           "fileCount": 1,
//           "content": [
//             {
//               "name": "src",
//               "type": "folder",
//               "fileSize": 0,
//               "fileCount": 0,
//               "content": [
//                 {
//                   "name": "main",
//                   "type": "folder",
//                   "fileSize": 0,
//                   "fileCount": 0,
//                   "content": [
//                     {
//                       "name": "java",
//                       "type": "folder",
//                       "fileSize": 0,
//                       "fileCount": 0,
//                       "content": [
//                         {
//                         "name": "com",
//                         "type": "folder",
//                         "fileSize": 0,
//                         "fileCount": 0,
//                         "content": [
//                           {
//                             "name": "stg",
//                             "type": "folder",
//                             "fileSize": 0,
//                             "fileCount": 0,
//                             "content": [
//                               // {
//                               //   "name": "bo",
//                               //   "type": "folder",
//                               //   "fileSize": 0,
//                               //   "fileCount": 0,
//                               //   "content": [],
//                               //   "originalPath": "D:\\Struts-Application\\StrutsCommon\\src\\main\\java\\com\\stg\\bo",
//                               //   "path": "Struts-Application\\StrutsCommon\\src\\main\\java\\com\\stg\\bo"
//                               // },
//                               // {
//                               //   "name": "dao",
//                               //   "type": "folder",
//                               //   "fileSize": 0,
//                               //   "fileCount": 0,
//                               //   "content": [],
//                               //   "originalPath": "D:\\Struts-Application\\StrutsCommon\\src\\main\\java\\com\\stg\\dao",
//                               //   "path": "Struts-Application\\StrutsCommon\\src\\main\\java\\com\\stg\\dao"
//                               // },
//                               // {
//                               //   "name": "exception",
//                               //   "type": "folder",
//                               //   "fileSize": 0,
//                               //   "fileCount": 0,
//                               //   "content": [],
//                               //   "originalPath": "D:\\Struts-Application\\StrutsCommon\\src\\main\\java\\com\\stg\\exception",
//                               //   "path": "Struts-Application\\StrutsCommon\\src\\main\\java\\com\\stg\\exception"
//                               // },
//                               // {
//                               //   "name": "facade",
//                               //   "type": "folder",
//                               //   "fileSize": 0,
//                               //   "fileCount": 0,
//                               //   "content": [],
//                               //   "originalPath": "D:\\Struts-Application\\StrutsCommon\\src\\main\\java\\com\\stg\\facade",
//                               //   "path": "Struts-Application\\StrutsCommon\\src\\main\\java\\com\\stg\\facade"
//                               // },
//                               // {
//                               //   "name": "service",
//                               //   "type": "folder",
//                               //   "fileSize": 0,
//                               //   "fileCount": 0,
//                               //   "content": [],
//                               //   "originalPath": "D:\\Struts-Application\\StrutsCommon\\src\\main\\java\\com\\stg\\service",
//                               //   "path": "Struts-Application\\StrutsCommon\\src\\main\\java\\com\\stg\\service"
//                               // },
//                               // {
//                               //   "name": "servlet",
//                               //   "type": "folder",
//                               //   "fileSize": 0,
//                               //   "fileCount": 0,
//                               //   "content": [],
//                               //   "originalPath": "D:\\Struts-Application\\StrutsCommon\\src\\main\\java\\com\\stg\\servlet",
//                               //   "path": "Struts-Application\\StrutsCommon\\src\\main\\java\\com\\stg\\servlet"
//                               // },
//                               // {
//                               //   "name": "util",
//                               //   "type": "folder",
//                               //   "fileSize": 0,
//                               //   "fileCount": 0,
//                               //   "content": [],
//                               //   "originalPath": "D:\\Struts-Application\\StrutsCommon\\src\\main\\java\\com\\stg\\util",
//                               //   "path": "Struts-Application\\StrutsCommon\\src\\main\\java\\com\\stg\\util"
//                               // }
//                             ],
//                             "originalPath": "D:\\Struts-Application\\StrutsCommon\\src\\main\\java\\com\\stg",
//                             "path": "Struts-Application\\StrutsCommon\\src\\main\\java\\com\\stg"
//                           }
//                         ],
//                         "originalPath": "D:\\Struts-Application\\StrutsCommon\\src\\main\\java\\com",
//                         "path": "Struts-Application\\StrutsCommon\\src\\main\\java\\com"
//                       }],
//                       "originalPath": "D:\\Struts-Application\\StrutsCommon\\src\\main\\java",
//                       "path": "Struts-Application\\StrutsCommon\\src\\main\\java"
//                     },
//                     {
//                       "name": "resources",
//                       "type": "folder",
//                       "fileSize": 0,
//                       "fileCount": 0,
//                       "content": [],
//                       "originalPath": "D:\\Struts-Application\\StrutsCommon\\src\\main\\resources",
//                       "path": "Struts-Application\\StrutsCommon\\src\\main\\resources"
//                     }
//                   ],
//                   "originalPath": "D:\\Struts-Application\\StrutsCommon\\src\\main",
//                   "path": "Struts-Application\\StrutsCommon\\src\\main"
//                 }
//               ],
//               "originalPath": "D:\\Struts-Application\\StrutsCommon\\src",
//               "path": "Struts-Application\\StrutsCommon\\src"
//             }
//           ],
//           "originalPath": "D:\\Struts-Application\\StrutsCommon",
//             "path": "Struts-Application\\StrutsCommon"
//         },
//         {
//           "name": "StrutsWeb",
//           "type": "folder",
//           "fileSize": 0,
//           "fileCount": 0,
//           "content":[
//             {
//               "name": "src",
//               "type": "folder",
//               "fileSize": 0,
//               "fileCount": 0,
//               "content": [
//                 {
//                   "name": "main",
//                   "type": "folder",
//                   "fileSize": 0,
//                   "fileCount": 0,
//                   "content": [
//                     {
//                       "name": "java",
//                       "type": "folder",
//                       "fileSize": 0,
//                       "fileCount": 0,
//                       "content": [
//                         {
//                           "name": "com",
//                           "type": "folder",
//                           "fileSize": 0,
//                           "fileCount": 0,
//                           "content": [
//                             {
//                               "name": "stg",
//                               "type": "folder",
//                               "fileSize": 0,
//                               "fileCount": 0,
//                               "content": [
//                                 // {
//                                 //   "name": "actions",
//                                 //   "type": "folder",
//                                 //   "fileSize": 0,
//                                 //   "fileCount": 0,
//                                 //   "content": [],
//                                 //   "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\java\\stg\\actions",
//                                 //   "path": "Struts-Application\\StrutsWeb\\src\\main\\java\\stg\\actions"
//                                 // },
//                                 // {
//                                 //   "name": "beans",
//                                 //   "type": "folder",
//                                 //   "fileSize": 0,
//                                 //   "fileCount": 0,
//                                 //   "content": [],
//                                 //   "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\java\\stg\\beans",
//                                 //   "path": "Struts-Application\\StrutsWeb\\src\\main\\java\\stg\\beans"
//                                 // },
//                                 // {
//                                 //   "name": "forms",
//                                 //   "type": "folder",
//                                 //   "fileSize": 0,
//                                 //   "fileCount": 0,
//                                 //   "content": [],
//                                 //   "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\java\\stg\\forms",
//                                 //   "path": "Struts-Application\\StrutsWeb\\src\\main\\java\\stg\\forms"
//                                 // },
//                                 // {
//                                 //   "name": "taglibs",
//                                 //   "type": "folder",
//                                 //   "fileSize": 0,
//                                 //   "fileCount": 0,
//                                 //   "content": [],
//                                 //   "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\java\\stg\\taglibs",
//                                 //   "path": "Struts-Application\\StrutsWeb\\src\\main\\java\\stg\\taglibs"
//                                 // },
//                                 // {
//                                 //   "name": "validator",
//                                 //   "type": "folder",
//                                 //   "fileSize": 0,
//                                 //   "fileCount": 0,
//                                 //   "content": [],
//                                 //   "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\java\\stg\\validator",
//                                 //   "path": "Struts-Application\\StrutsWeb\\src\\main\\java\\stg\\validator"
//                                 // }
//                               ],
//                               "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\java\\com\\stg",
//                               "path": "Struts-Application\\StrutsWeb\\src\\main\\java\\com\\stg"
                              
//                             }
//                           ],
//                           "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\java\\com",
//                           "path": "Struts-Application\\StrutsWeb\\src\\main\\java\\com"
//                         }
//                       ],
//                       "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\java",
//                       "path": "Struts-Application\\StrutsWeb\\src\\main\\java"
//                     },
//                     {
//                       "name": "resources",
//                       "type": "folder",
//                       "fileSize": 0,
//                       "fileCount": 0,
//                       "content": [],
//                       "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\resources",
//                       "path": "Struts-Application\\StrutsWeb\\src\\main\\resources"
//                     },
//                     {
//                       "name": "webapp",
//                       "type": "folder",
//                       "fileSize": 0,
//                       "fileCount": 0,
//                       "content": [
//                         // {
//                         //   "name": "css",
//                         //   "type": "folder",
//                         //   "fileSize": 0,
//                         //   "fileCount": 0,
//                         //   "content": [],
//                         //   "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\webapp\\css",
//                         //   "path": "Struts-Application\\StrutsWeb\\src\\main\\webapp\\css"
//                         // },
//                         // {
//                         //   "name": "images",
//                         //   "type": "folder",
//                         //   "fileSize": 0,
//                         //   "fileCount": 0,
//                         //   "content": [],
//                         //   "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\webapp\\images",
//                         //   "path": "Struts-Application\\StrutsWeb\\src\\main\\webapp\\images"
//                         // },
//                         // {
//                         //   "name": "jquery-ui",
//                         //   "type": "folder",
//                         //   "fileSize": 0,
//                         //   "fileCount": 0,
//                         //   "content": [],
//                         //   "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\webapp\\jquery-ui",
//                         //   "path": "Struts-Application\\StrutsWeb\\src\\main\\webapp\\jquery-ui"
//                         // },
//                         // {
//                         //   "name": "js",
//                         //   "type": "folder",
//                         //   "fileSize": 0,
//                         //   "fileCount": 0,
//                         //   "content": [],
//                         //   "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\webapp\\js",
//                         //   "path": "Struts-Application\\StrutsWeb\\src\\main\\webapp\\js"
//                         // },
//                         // {
//                         //   "name": "jsps",
//                         //   "type": "folder",
//                         //   "fileSize": 0,
//                         //   "fileCount": 0,
//                         //   "content": [],
//                         //   "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\webapp\\jsps",
//                         //   "path": "Struts-Application\\StrutsWeb\\src\\main\\webapp\\jsps"
//                         // },
//                         // {
//                         //   "name": "META-INF",
//                         //   "type": "folder",
//                         //   "fileSize": 0,
//                         //   "fileCount": 0,
//                         //   "content": [],
//                         //   "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\webapp\\META-INF",
//                         //   "path": "Struts-Application\\StrutsWeb\\src\\main\\webapp\\META-INF"
//                         // },
//                         // {
//                         //   "name": "WEB-INF",
//                         //   "type": "folder",
//                         //   "fileSize": 0,
//                         //   "fileCount": 0,
//                         //   "content": [],
//                         //   "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\webapp\\WEB-INF",
//                         //   "path": "Struts-Application\\StrutsWeb\\src\\main\\webapp\\WEB-INF"
//                         // },
//                         // {
//                         //   "name": "wsdl",
//                         //   "type": "folder",
//                         //   "fileSize": 0,
//                         //   "fileCount": 0,
//                         //   "content": [],
//                         //   "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\webapp\\wsdl",
//                         //   "path": "Struts-Application\\StrutsWeb\\src\\main\\webapp\\wsdl"
//                         // }
//                       ],
//                       "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main\\webapp",
//                       "path": "Struts-Application\\StrutsWeb\\src\\main\\webapp"
//                     }
//                   ],
//                   "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\main",
//                   "path": "Struts-Application\\StrutsWeb\\src\\main"
//                 },
//                 {
//                   "name": "resources",
//                   "type": "folder",
//                   "fileSize": 0,
//                   "fileCount": 0,
//                   "content": [],
//                   "originalPath": "D:\\Struts-Application\\StrutsWeb\\src\\resources",
//                   "path": "Struts-Application\\StrutsWeb\\src\\resources"
//                 }
//               ],
//               "originalPath": "D:\\Struts-Application\\StrutsWeb\\src",
//               "path": "Struts-Application\\StrutsWeb\\src"
//             }
//           ],
//           "originalPath": "D:\\Struts-Application\\StrutsWeb",
//           "path": "Struts-Application\\StrutsWeb"
//         }
//       ],
//       "originalPath": "D:\\Check\\Struts-Application",
//       "path": "Struts-Application"
//     }
//   ]

//   private backupNewStructure: FileNode[] =[];

//   constructor(private changeDet: ChangeDetectorRef, private fuseConfirmationService: FuseConfirmationService) {
//     const transformer = (node: FileNode, level: number) => ({
//       name: node.name,
//       type: node.type,
//       level: level,
//       expandable: !!node.content?.length, // Only folders have content, not files
//       path: node.path,
//         content:node.content,
//       fileContent: node.fileContent,  // Ensure that fileContent is included
//     });

//     this.treeControl = new FlatTreeControl<FileFlatNode>(
//         node => node.level,
//         node => node.expandable
//     );

//     this.standardTreeControl = new FlatTreeControl<FileFlatNode>(
//       node => node.level,
//       node => node.expandable
//   );


    

//     this.oldTreeDataSource = new MatTreeFlatDataSource(
//         this.treeControl,
//         new MatTreeFlattener(
//             transformer,
//             (node) => node.level,
//             (node) => node.expandable,
//             (node) => node.content
//         )
//     );

//     this.newTreeDataSource = new MatTreeFlatDataSource(
//         this.standardTreeControl,
//         new MatTreeFlattener(
//             transformer,
//             (node) => node.level,
//             (node) => node.expandable,
//             (node) => node.content
//         )
//     );
//   }

//   ngOnInit(): void {
//     console.log(this.folderStructure)
//     this.oldTreeDataSource.data = this.folderStructure;
//     console.log(this.oldTreeDataSource.data)
//     this.newTreeDataSource.data = this.newFolderStructure;
//     this.backupNewStructure = JSON.parse(JSON.stringify(this.newFolderStructure));
//   }

//   hasChild = (_: number, node: FileFlatNode) => node.expandable;

//   toggleSelection(node: FileFlatNode): void {
//     // Check if the node is already selected
//     const isSelected = this.selectedNodes.some(selectedNode => selectedNode.path === node.path);

//     if (isSelected) {
//       // If deselecting, remove the node and all its children from the selection
//       this.selectedNodes = this.selectedNodes.filter(n => !this.isNodeOrDescendant(node, n));
//     } else {
//       // If selecting, add the node and all its children to the selection
//       if (this.isNodeParentSelected(node)) {
//         // If the parent folder is selected, add the node to its content instead of top level
//         const parentNode = this.selectedNodes.find(selectedNode => this.isDescendantOf(node, selectedNode));
//         if (parentNode) {
//           this.addNodeToParentContent(parentNode, node);
//         }
//       } else {
//         // Add node and its children normally
//         this.addNodeAndChildrenToSelection(node);
//       }
//     }
//   }

// // Check if a node's parent is already selected
//   isNodeParentSelected(node: FileFlatNode): boolean {
//     return this.selectedNodes.some(selectedNode => this.isDescendantOf(node, selectedNode));
//   }

// // Add a node and its children to the selection
//   addNodeAndChildrenToSelection(node: FileFlatNode): void {
//     this.selectedNodes.push(node);
//   }

// // Add a node inside the selected parent folder
//   // Add a node inside the selected parent folder
//   addNodeToParentContent(parentNode: FileFlatNode, node: FileFlatNode): void {
//     // Ensure content is an array
//     parentNode.content = parentNode.content || [];

//     // Remove the node from parent content if it's already present (to avoid duplicates)
//     const existingNodeIndex = parentNode.content.findIndex(child => child.path === node.path);
//     if (existingNodeIndex !== -1) {
//       parentNode.content.splice(existingNodeIndex, 1); // Remove the existing node
//     }else{
//       parentNode.content.push(node);
//     }

//     // Add the node to the parent folder's content

//   }


// // Helper to check if a node is the same or a descendant of another node
//   isNodeOrDescendant(parent: FileFlatNode, child: FileFlatNode): boolean {
//     return child.path.startsWith(parent.path);
//   }

// // Helper function to recursively check if a node is a descendant of another node
//   isDescendantOf(node: FileFlatNode, selectedNode: FileFlatNode): boolean {
//     if (selectedNode.content) {
//       if (selectedNode.content.some(child => child.path === node.path)) {
//         return true;
//       }
//       return selectedNode.content.some(child => this.isDescendantOf(node, child));
//     }
//     return false;
//   }


//   selectNewTreeFolder(node: FileFlatNode): void {
//     console.log('selectNewTreeFolder() started: ', node);
//     console.log('selectedNewFolder: ', this.selectedNewFolder);
    
//     if (this.selectedNewFolder === node) {
//       this.selectedNewFolder = null;
//     } else {
//       this.selectedNewFolder = node;
//       console.log('else part... Selected New Folder:', this.selectedNewFolder);
      
//     }
//   }

//   // replaced the below code for the above code,
// //   selectedNewNodes: any[] = []; // Track selected nodes on the right-hand tree

// // selectNewTreeFolder(node: any) {
// //   const isSelected = this.selectedNewNodes.some(selected => selected.path === node.path);

// //   if (isSelected) {
// //     // Remove the node if already selected
// //     this.selectedNewNodes = this.selectedNewNodes.filter(selected => selected.path !== node.path);
// //   } else {
// //     // Add the node if not already selected
// //     this.selectedNewNodes.push(node);
// //   }
// //   console.log('Selected New Nodes:', this.selectedNewNodes);
// // }

//   get isNewTreeFolderSelected(): boolean {
//     return !!this.selectedNewFolder;
//   }

//   get canMove(): boolean {
//     return this.selectedNodes.length > 0 && this.isNewTreeFolderSelected;
//   }

//   moveFiles(): void {
//     console.log('Before Move:', this.newTreeDataSource.data, this.oldTreeDataSource.data);
//     console.log('selected node: ',this.selectedNodes);

//     // if (!this.selectedNewFolder) return;
//     if (!this.selectedNewFolder || this.selectedNewFolder.type !== 'folder') {
//       const dialogRef = this.fuseConfirmationService.open( {
       
//             title: 'Confirm',
//             message: 'Please select a valid folder in the "Standardized Code Structure" section.',
//             dismissible: true,
//             icon: {
//                 show: true,
//                 name: 'heroicons_outline:exclamation',
//                 color: 'warn'
//             },
//             actions: {
//                 confirm: {
//                     show: false
//                 },
//                 cancel: {
//                     show: true,
//                     label: 'Okay'
//                 }
//             }
        
//       });

//       return;
//     }

//     const targetFolderPath = this.selectedNewFolder.path;
//     const movedFiles = this.selectedNodes;

//     // Helper function to find the target folder recursively
//     const findTargetFolder = (folderStructure: any[], targetPath: string): any => {
//       for (const folder of folderStructure) {
//         if (folder.path === targetPath) {
//           return folder;
//         }
//         // Recursively search in subfolders
//         if (folder.content?.length) {
//           const found = findTargetFolder(folder.content, targetPath);
//           if (found) return found;
//         }
//       }
//       return null;
//     };

//     // Helper function to recursively update paths for all nested nodes
//     const updatePaths = (node: FileFlatNode, parentPath: string, sourcePath: string): void => {
//       // Update the new path based on the parent path

//       const trimmedSourcePath = sourcePath.replace(/\\[^\\]+\\$/, '\\');// Update the new path based on the parent
//        node.originalPath = `${trimmedSourcePath}${node.path}`;     
//         node.path = `${parentPath}\\${node.name}`;
//       // Preserve the original path using the sourcePath and the node's current path

//       // Recursively update paths for nested content
//       if (node.content?.length) {
//         node.content.forEach(childNode => updatePaths(childNode, node.path, sourcePath));
//       }
//     };

//     // Find the target folder in the new folder structure
//     const targetFolder = findTargetFolder(this.newFolderStructure, targetFolderPath);
//     if (!targetFolder) {
//       console.error("Target folder not found.");
//       return;
//     }

//     // Add the files from the old structure, updating their paths and preserving originalPath
//     movedFiles.forEach(node => {
//       const newNode = { ...node }; // Clone the node to avoid modifying the selected nodes directly
//       updatePaths(newNode, targetFolder.path, this.clonedPath); // Update the path for the new structure
//       targetFolder.content.push(newNode); // Add the updated node to the target folder
//     });

//     // Reassign the data to refresh the UI
//     this.newTreeDataSource.data = [...this.newFolderStructure];
//     console.log('After Move:', this.newTreeDataSource);

//     // Reset state
//     this.selectedNodes = [];
//     this.selectedNewFolder = null;
//     this.changeDet.markForCheck(); // Ensure Angular detects changes
//   }









//   isNodeSelected(node: FileFlatNode): boolean {
//     // Check if the node is directly selected
//     if (this.selectedNodes.some(selectedNode => selectedNode.path === node.path)) {
//       return true;
//     }

//     // Recursively check if the node is a descendant of any selected folder
//     return this.selectedNodes.some(selectedNode => this.isDescendantOf(node, selectedNode));
//   }

// // Helper function to recursively check if a node is a descendant of another node
// // moveFilesBack(){
// //   console.log(this.backupNewStructure)
// //   console.log('selected node moveFilesBack(): ',this.selectedNodes)
  
// //     this.newTreeDataSource.data = [...this.backupNewStructure];
// //   console.log(this.newTreeDataSource);
// //   this.changeDet.markForCheck(); // Ensure Angular detects changes
// // }


// moveFilesBack() {
//   // Log the selected folder and current data for debugging
//   console.log('Selected Folder to Remove:', this.selectedNewFolder);
//   console.log('Current newTreeDataSource.data:', this.newTreeDataSource.data);

//   if (!this.selectedNewFolder) {
//     console.log('No folder selected to remove.');
//     return;
//   }

//   this.newTreeDataSource.data = this.newTreeDataSource.data.map(node => {
//     if (node.path === this.selectedNewFolder.path.split('\\')[0]) {
//       // Remove the selected item from the content array
//       node.content = node.content.filter(contentNode => {
//         const isMatch = contentNode.path === this.selectedNewFolder.path;
//         console.log(`Checking content node path: ${contentNode.path} against selected path: ${this.selectedNewFolder.path}. Match: ${isMatch}`);
//         console.log('contentNode: ',contentNode);
        
//         return !isMatch; // Keep items that don't match
//       });
//     }
//     console.log('Node value:', node);
    
//     return node;
//   });

//   // this.newTreeDataSource.data = this.newTreeDataSource.data.map(node => {
//   //   if (node.path === this.selectedNewFolder.path.split('\\')[0]) {
//   //     // Remove non-folder items from the content array
//   //     node.content = node.content.filter(contentNode => {
//   //       // Check if contentNode has its own 'content' property (indicating it's a folder)
//   //       return contentNode.hasOwnProperty('content'); 
//   //     });
//   //   }
//   //   console.log('node content: ',node.content);
//   //   console.log('Node value:', node);
  
//   //   return node;
//   // });
  

//   // Log the updated tree data for verification
//   console.log('Updated newTreeDataSource:', this.newTreeDataSource.data);

//   // Clear the selected folder
//   this.selectedNewFolder = null;
//   this.changeDet.markForCheck();
// }

// }