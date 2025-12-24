import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from './modules/spinner.service';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent{
isSpinnerVisible$: Observable<boolean>;

constructor(private spinnerService: SpinnerService) {
    this.isSpinnerVisible$ = this.spinnerService.spinnerVisibility$;
}
}