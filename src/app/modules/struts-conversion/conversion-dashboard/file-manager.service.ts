import { Injectable } from '@angular/core';


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

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  constructor() { }


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


  validateStrutsFolderStructure(folderStructure: FileNode[]): string[] {
    const missingItems: string[] = [];
    const requiredFoldersAndFiles = [
      'WEB-INF',
      'src',
      'jsp',
      'webapp'
      // '\\src\\main\\webapp\\WEB-INF',
      // 'webapp\\META-INF',
      // 'webapp\\index.jsp'
    ];

    // Helper function to recursively check if a specific file or folder exists
    const { folderExistsRecursively, checkForFileOrFolder } = this.checkForFileOrFolders();

    // Check required folders and files (old logic)
    for (const folder of requiredFoldersAndFiles) {
      if (!folderExistsRecursively({ content: folderStructure } as FileNode, folder)) {
        missingItems.push(`Missing: ${folder}`);
      }
    }

    // New logic: Check for WEB-INF folder and XML files
    const webInfNode = checkForFileOrFolder({ content: folderStructure } as FileNode, 'WEB-INF');

    if (!webInfNode) {
      missingItems.push('Missing: WEB-INF folder');
    } else {
      // Check for XML files directly inside WEB-INF
      const hasXmlInWebInf = webInfNode.content?.some(
        (child) => child.type === 'file' && child.name.toLowerCase().endsWith('.xml')
      );

      if (!hasXmlInWebInf) {
        missingItems.push('Missing: XML file(s) inside WEB-INF');
      }
    }

    // New logic: Check for JSP files under the webapp folder
    const webappNode = checkForFileOrFolder({ content: folderStructure } as FileNode, 'webapp');

    if (!webappNode) {
      missingItems.push('Missing: webapp folder');
    } else {
      // Check for JSP files recursively under webapp
      const hasJspInWebapp = folderExistsRecursively(webappNode, '.jsp');
      if (!hasJspInWebapp) {
        missingItems.push('Missing: JSP file(s) inside or under webapp');
      }
    }
    return missingItems;

  }


  checkForMavenOrGradleType(folderStructure: FileNode[]): String{
    const { folderExistsRecursively, checkForFileOrFolder } = this.checkForFileOrFolders();
    const missingItems=[]
    let projectType=''
    const gradleNode = folderExistsRecursively({ content: folderStructure } as FileNode, 'build.gradle');
    if (gradleNode) {
      projectType='Gradle'
    } else {
      missingItems.push('Missing: Build.gradle');
      const pomNode = folderExistsRecursively({ content: folderStructure } as FileNode, 'pom.xml');
      if (pomNode) {
        projectType='Maven'
      } else {
        missingItems.push('Missing: pom.xml');
  
      }
    }
    return projectType;
  }

  private checkForFileOrFolders() {
    const folderExistsRecursively = (node: FileNode, path: string): boolean => {
      if (node.path?.includes(path)) {
        return true;
      }
      if (node.content) {
        return node.content.some((childNode) => folderExistsRecursively(childNode, path)
        );
      }
      return false;
    };

    const checkForFileOrFolder = (node: FileNode, folderName: string, fileExtension?: string): FileNode | null => {
      if (node.name === folderName && node.type === 'folder') {
        if (!fileExtension) return node; // Folder found
      }
      if (node.content) {
        for (const childNode of node.content) {
          const foundNode = checkForFileOrFolder(childNode, folderName, fileExtension);
          if (foundNode) return foundNode;
        }
      }
      return null;
    };
    return { folderExistsRecursively, checkForFileOrFolder };
  }



}
