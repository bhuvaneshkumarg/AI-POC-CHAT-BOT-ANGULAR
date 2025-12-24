import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerVisibilitySubject = new BehaviorSubject<boolean>(false);
  constructor() { }

  get spinnerVisibility$(): Observable<boolean> {
    return this.spinnerVisibilitySubject.asObservable();
  }
  show(): void {
    this.spinnerVisibilitySubject.next(true);
  }

  hide(): void {
    this.spinnerVisibilitySubject.next(false);
  }
}
