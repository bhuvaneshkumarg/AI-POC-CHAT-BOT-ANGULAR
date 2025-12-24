import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-content-dialog',
  templateUrl: './file-content-dialog.component.html',
  styleUrls: ['./file-content-dialog.component.scss']
})
export class FileContentDialogComponent implements OnInit {

  isDarkMode = false;
  constructor(
    public dialogRef: MatDialogRef<FileContentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { fileName: string; content: string },
    private clipboard: Clipboard, private snackBar: MatSnackBar
  ) {}

  closeDialog(): void { 
    this.dialogRef.close();
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.data.content).then(() => {
      this.snackBar.open('Copied to clipboard!', 'OK', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: 'snackbar-success' // Custom styling
      });
    }).catch(err => {
      console.error('Failed to copy:', err);
      this.snackBar.open('Failed to copy', 'Retry', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: 'snackbar-error' // Custom styling for failure
      });
    });
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
  }

  ngOnInit(): void {
  }



}
