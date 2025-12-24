import { Component, OnInit } from '@angular/core';
import { ProgressBarService } from '../../progress-bar.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  value: number = 0;
  constructor(private progressBarService: ProgressBarService) {
  }

  ngOnInit(): void {
    let interval: any = setInterval(() => {
      this.value = this.value + Math.floor(Math.random() * 15) ;
      if (this.value > 90) {
        this.value = 91;
        clearInterval(interval);
        setTimeout(() => {
          // this.progressBarService.hide();
        }, 6000);
      }
    }, 2000);
  }
}
