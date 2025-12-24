import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
  private snackBarRef: MatSnackBarRef<ToasterComponent>) { }

  ngOnInit(): void {
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error'; 
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  }

  closeToast() {
    this.snackBarRef.dismiss();
  }

}
