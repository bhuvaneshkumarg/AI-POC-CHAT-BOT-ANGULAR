import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ToasterComponent } from './toaster.component';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private matsnackBar: MatSnackBar) { }

  showMessage(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 3000) {
    const config: MatSnackBarConfig = {
      duration: duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: this.getPanelClass(type),
      data: { message, type }
    };
    this.matsnackBar.openFromComponent(ToasterComponent, config);
  }

  private getPanelClass(type: string): string[] {
    // switch (type) {
    //   case 'success': return ['toast-success'];
    //   case 'error': return ['toast-error'];
    //   case 'warning': return ['toast-warning'];
    //   case 'info': return ['toast-info'];
    //   default: return ['toast-info'];
    // }
    return [`toast-${type}`];
  }
}
