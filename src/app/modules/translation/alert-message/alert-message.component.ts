import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AlertMessageComponent>,
      
    @Inject(MAT_DIALOG_DATA) public dataUser: any) { }
  ngOnInit(): void {
  }
  Response = this.dataUser.reponseList
}
