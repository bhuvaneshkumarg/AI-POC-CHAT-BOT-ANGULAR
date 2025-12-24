import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { ConversionService } from "../../conversion.service";
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { STRUTS_FOLDER_STRUCTURE } from 'app/utils/app.constants';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FileFlatNode, FileNode } from '../conversion-dashboard/file-manager.service';

@Component({
  selector: 'app-file-transfer',
  templateUrl: './file-transfer.component.html',
  styleUrls: ['./file-transfer.component.scss']
})
export class FileTransferComponent implements OnInit, OnChanges {
  @Input() clonedSourceFileData: FileNode[] | FileFlatNode[] | any[] = [];
  treeControl: FlatTreeControl<FileFlatNode>;
  standardTreeControl: FlatTreeControl<FileFlatNode>;
  oldTreeDataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  newTreeDataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  @Input() sourcePath: string = '';
  @Input() clonedPath: string = '';
  selectedNodes: FileFlatNode[] = [];
  selectedNewFolder: FileFlatNode | null = null;
  @ViewChild('oldStructureTree') oldTreeStructure;
  @ViewChild('newStructureTree') newTreeStructure;
  newFolderStructure = JSON.parse(JSON.stringify(STRUTS_FOLDER_STRUCTURE));
  newFolderStructureTemp = JSON.parse(JSON.stringify(STRUTS_FOLDER_STRUCTURE));
  alertConfigForm: UntypedFormGroup;
  constructor(private changeDet: ChangeDetectorRef, private fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder
  ) {
    const transformer = (node: FileNode, level: number) => ({
      name: node.name,
      type: node.type,
      level: level,
      expandable: !!node.content?.length, // Only folders have content, not files
      path: node.path,
      content: node.content,
      fileContent: node.fileContent,  // Ensure that fileContent is included
    });

    this.treeControl = new FlatTreeControl<FileFlatNode>(
      node => node.level,
      node => node.expandable
    );

    this.standardTreeControl = new FlatTreeControl<FileFlatNode>(
      node => node.level,
      node => node.expandable
    );
    this.oldTreeDataSource = new MatTreeFlatDataSource(
      this.treeControl,
      new MatTreeFlattener(
        transformer,
        (node) => node.level,
        (node) => node.expandable,
        (node) => node.content
      )
    );

    this.newTreeDataSource = new MatTreeFlatDataSource(
      this.standardTreeControl,
      new MatTreeFlattener(
        transformer,
        (node) => node.level,
        (node) => node.expandable,
        (node) => node.content
      )
    );
  }

  ngOnInit(): void {
    this.oldTreeDataSource.data = this.clonedSourceFileData;
    this.newTreeDataSource.data = this.newFolderStructure;
    this.configErrorAlert();
  }

  ngOnChanges(){
    this.oldTreeDataSource.data = this.clonedSourceFileData;
    this.newTreeDataSource.data = this.newFolderStructure;
  }

  ngAfterViewInit(): void {
    this.newTreeStructure.treeControl.expandAll();
  }
  hasChild = (_: number, node: FileFlatNode) => node.expandable;

  toggleSelection(node: FileFlatNode): void {
    // Check if the node is already selected
    const isSelected = this.selectedNodes.some(selectedNode => selectedNode.path === node.path);

    if (isSelected) {
      // If deselecting, remove the node and all its children from the selection
      this.selectedNodes = this.selectedNodes.filter(n => !this.isNodeOrDescendant(node, n));
    } else {
      // If selecting, add the node and all its children to the selection
      if (this.isNodeParentSelected(node)) {
        // If the parent folder is selected, add the node to its content instead of top level
        const parentNode = this.selectedNodes.find(selectedNode => this.isDescendantOf(node, selectedNode));
        if (parentNode) {
          this.addNodeToParentContent(parentNode, node);
        }
      } else {
        // Add node and its children normally
        this.addNodeAndChildrenToSelection(node);
      }
    }
  }

  // Check if a node's parent is already selected
  isNodeParentSelected(node: FileFlatNode): boolean {
    return this.selectedNodes.some(selectedNode => this.isDescendantOf(node, selectedNode));
  }

  // Add a node and its children to the selection
  addNodeAndChildrenToSelection(node: FileFlatNode): void {
    this.selectedNodes.push(node);
  }

  // Add a node inside the selected parent folder
  // Add a node inside the selected parent folder
  addNodeToParentContent(parentNode: FileFlatNode, node: FileFlatNode): void {
    // Ensure content is an array
    parentNode.content = parentNode.content || [];

    // Remove the node from parent content if it's already present (to avoid duplicates)
    const existingNodeIndex = parentNode.content.findIndex(child => child.path === node.path);
    if (existingNodeIndex !== -1) {
      parentNode.content.splice(existingNodeIndex, 1); // Remove the existing node
    } else {
      parentNode.content.push(node);
    }

    // Add the node to the parent folder's content

  }


  // Helper to check if a node is the same or a descendant of another node
  isNodeOrDescendant(parent: FileFlatNode, child: FileFlatNode): boolean {
    return child.path.startsWith(parent.path);
  }

  // Helper function to recursively check if a node is a descendant of another node
  isDescendantOf(node: FileFlatNode, selectedNode: FileFlatNode): boolean {
    if (selectedNode.content) {
      if (selectedNode.content.some(child => child.path === node.path)) {
        return true;
      }
      return selectedNode.content.some(child => this.isDescendantOf(node, child));
    }
    return false;
  }


  selectNewTreeFolder(node: FileFlatNode): void {
    console.log('selectNewTreeFolder() started: ', node);
    console.log('selectedNewFolder: ', this.selectedNewFolder);

    if (this.selectedNewFolder === node) {
      this.selectedNewFolder = null;
    } else {
      this.selectedNewFolder = node;
      console.log('else part... Selected New Folder:', this.selectedNewFolder.path);
    }
  }

  // replaced the below code for the above code,
  //   selectedNewNodes: any[] = []; // Track selected nodes on the right-hand tree

  // selectNewTreeFolder(node: any) {
  //   const isSelected = this.selectedNewNodes.some(selected => selected.path === node.path);

  //   if (isSelected) {
  //     // Remove the node if already selected
  //     this.selectedNewNodes = this.selectedNewNodes.filter(selected => selected.path !== node.path);
  //   } else {
  //     // Add the node if not already selected
  //     this.selectedNewNodes.push(node);
  //   }
  //   console.log('Selected New Nodes:', this.selectedNewNodes);
  // }

  get isNewTreeFolderSelected(): boolean {
    return !!this.selectedNewFolder;
  }

  get canMove(): boolean {
    return this.selectedNodes.length > 0 && this.isNewTreeFolderSelected;
  }

  moveFiles(): void {
    console.log('Before Move:', this.newTreeDataSource.data, this.oldTreeDataSource.data);
    console.log('selected node: ', this.selectedNodes);

    // if (!this.selectedNewFolder) return;
    if (!this.selectedNewFolder || this.selectedNewFolder.type !== 'folder') {
      const dialogRef = this.fuseConfirmationService.open({

        title: 'Confirm',
        message: 'Please select a valid folder in the "Standardized Code Structure" section.',
        dismissible: true,
        icon: {
          show: true,
          name: 'heroicons_outline:exclamation',
          color: 'warn'
        },
        actions: {
          confirm: {
            show: false
          },
          cancel: {
            show: true,
            label: 'Okay'
          }
        }

      });

      return;
    }

    const targetFolderPath = this.selectedNewFolder.path;
    const movedFiles = this.selectedNodes;

    // Helper function to find the target folder recursively
    const findTargetFolder = (folderStructure: any[], targetPath: string): any => {
      for (const folder of folderStructure) {
        if (folder.path === targetPath) {
          return folder;
        }
        // Recursively search in subfolders
        if (folder.content?.length) {
          const found = findTargetFolder(folder.content, targetPath);
          if (found) return found;
        }
      }
      return null;
    };

    // Helper function to recursively update paths for all nested nodes
    const updatePaths = (node: FileFlatNode, parentPath: string, sourcePath: string): void => {
      // Update the new path based on the parent path

      const trimmedSourcePath = sourcePath.replace(/\\[^\\]+\\$/, '\\');// Update the new path based on the parent
      node.originalPath = `${trimmedSourcePath}${node.path}`;
      node.path = `${parentPath}\\${node.name}`;
      // Preserve the original path using the sourcePath and the node's current path

      // Recursively update paths for nested content
      if (node.content?.length) {
        node.content.forEach(childNode => updatePaths(childNode, node.path, sourcePath));
      }
    };

    // Find the target folder in the new folder structure
    const targetFolder = findTargetFolder(this.newFolderStructure, targetFolderPath);
    if (!targetFolder) {
      console.error("Target folder not found.");
      return;
    }

    // Add the files from the old structure, updating their paths and preserving originalPath
    movedFiles.forEach(node => {
      const newNode = { ...node }; // Clone the node to avoid modifying the selected nodes directly
      updatePaths(newNode, targetFolder.path, this.clonedPath); // Update the path for the new structure
      targetFolder.content.push(newNode); // Add the updated node to the target folder
    });

    // Reassign the data to refresh the UI
    this.newTreeDataSource.data = [...this.newFolderStructure];
    this.newTreeStructure.treeControl.expandAll();
    console.log('After Move:', this.newTreeDataSource);

    // Reset state
    this.selectedNodes = [];
    this.selectedNewFolder = null;
    this.changeDet.markForCheck(); // Ensure Angular detects changes
  }

  isNodeSelected(node: FileFlatNode): boolean {
    // Check if the node is directly selected
    if (this.selectedNodes.some(selectedNode => selectedNode.path === node.path)) {
      return true;
    }

    // Recursively check if the node is a descendant of any selected folder
    return this.selectedNodes.some(selectedNode => this.isDescendantOf(node, selectedNode));
  }

  // Helper function to recursively check if a node is a descendant of another node
  // moveFilesBack(){
  //   console.log(this.backupNewStructure)
  //   console.log('selected node moveFilesBack(): ',this.selectedNodes)

  //     this.newTreeDataSource.data = [...this.backupNewStructure];
  //   console.log(this.newTreeDataSource);
  //   this.changeDet.markForCheck(); // Ensure Angular detects changes
  // }


  moveFilesBack() {
    debugger;
    if (!this.selectedNewFolder) {
      console.log('No folder selected to remove.');
      return;
    }
    const targetPathToRemove = this.selectedNewFolder.path;
    if (this.pathExistsInStructure(this.newFolderStructureTemp, targetPathToRemove)) {
      this.alertConfigForm.patchValue({
        title: 'Not Allowed',
        message: 'This folder or file is part of the predefined structure and cannot be deleted.'
      });
      const dialogRef = this.fuseConfirmationService.open(this.alertConfigForm.value);
      return;
    }

    this.newFolderStructure = this.removeItemFromStructure(this.newFolderStructure, targetPathToRemove);
    this.newTreeDataSource.data = [...this.newFolderStructure];
    this.newTreeStructure.treeControl.expandAll();

    this.selectedNewFolder = null;
    this.changeDet.markForCheck();
  }
  removeItemFromStructure(structure: any[], targetPath: string): any[] {
    return structure
      .map(folder => {
        // If the current folder's path matches, return null (to remove it)
        if (folder.path === targetPath) {
          return null;
        }
        // If the folder has content, check inside it
        if (folder.content && folder.content.length > 0) {
          folder.content = this.removeItemFromStructure(folder.content, targetPath);
        }
        return folder;
      })
      .filter(Boolean); // Remove null entries
  }
  pathExistsInStructure(structure: any[], targetPath: string): boolean {
    for (const folder of structure) {
      if (folder.path === targetPath) {
        return true;
      }
      if (folder.content && folder.content.length > 0) {
        if (this.pathExistsInStructure(folder.content, targetPath)) {
          return true;
        }
      }
    }
    return false;
  }
  configErrorAlert() {
    this.alertConfigForm = this._formBuilder.group({
      title: '',
      message: '',
      icon: this._formBuilder.group({
        show: true,
        name: 'heroicons_outline:exclamation',
        color: 'warn'
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: true,
          label: 'Close',
          color: 'warn'
        }),
        cancel: this._formBuilder.group({
          show: false,
          label: 'Cancel'
        })
      }),
      dismissible: true
    });
  }
}