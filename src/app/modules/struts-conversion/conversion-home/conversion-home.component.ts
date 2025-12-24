import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conversion-home',
  templateUrl: './conversion-home.component.html',
  styleUrls: ['./conversion-home.component.scss']
})
export class ConversionHomeComponent implements OnInit {
  @Output() showConversionDashboard: EventEmitter<boolean> = new EventEmitter();
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  start() {
    this.router.navigateByUrl('/chatbotdashboard');
  }
}
