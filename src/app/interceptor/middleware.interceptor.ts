import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Injectable()
export class MiddlewareInterceptor implements HttpInterceptor {
  configForm: UntypedFormGroup;
  constructor(private _formBuilder: UntypedFormBuilder,
    private _fuseConfirmationService: FuseConfirmationService) {
    this.configErrorAlert();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.displayError(error);
        return throwError(error);
      })
    )
  }
  configErrorAlert() {
    this.configForm = this._formBuilder.group({
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
  displayError(error: HttpErrorResponse) {
    const match = error?.error?.message?.match(/fatal: (.+)/);
       
    let extractedMessage = '';
    if (match) {
      extractedMessage = match[1];
    } else {
      // extractedMessage = error?.error?.message || 'An unexpected error occurred.';
      extractedMessage =
  typeof error?.error === 'string'
    ? error.error
    : error?.error?.message || JSON.stringify(error?.error) || 'An unexpected error occurred.';

    }
    this.configForm.patchValue({
      title: 'Error',          
      message: extractedMessage
    });
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
  }
  
}
