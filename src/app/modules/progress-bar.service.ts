import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  private progressBarVisibilitySubject = new BehaviorSubject<boolean>(false);
  constructor() { }

  get spinnerVisibility$(): Observable<boolean> {
    return this.progressBarVisibilitySubject.asObservable();
  }
  show(): void {
    this.progressBarVisibilitySubject.next(true);
  }

  // Method to hide the spinner
  hide(): void {
    this.progressBarVisibilitySubject.next(false);
  }
}