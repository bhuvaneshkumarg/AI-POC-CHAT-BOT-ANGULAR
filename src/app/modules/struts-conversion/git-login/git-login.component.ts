import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-git-login',
  templateUrl: './git-login.component.html',
  styleUrls: ['./git-login.component.scss']
})
export class GitLoginComponent implements OnInit {
// username:string
//   password:string
//
//   constructor(public dialogRef: MatDialogRef<GitLoginComponent>) {}
//
//   onSubmit(): void {
//     if (this.username && this.password) {
//       // this.credentialsSubmitted.emit({ username: this.username, password: this.password });
//       this.dialogRef.close({ username: this.username, password: this.password });
//     } else {
//       alert('Username and Password are required!');
//     }
//   }


  username: string = '';
  password: string = '';
  url: string = '';
  usernameTouched: boolean = false;
  passwordTouched: boolean = false;

  constructor(
      public dialogRef: MatDialogRef<GitLoginComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { url: string }
  ) {}

  ngOnInit(): void {
    this.url = this.data.url.split('.com')[0] + '.com';
  }

  onSubmit(): void {
    if (this.username && this.password) {
      // Pass the credentials and URL back to the parent component
      this.dialogRef.close({
        username: this.username,
        password: this.password,
        url: this.url
      });
    }
  }

  onCancel(): void {
    // Close the dialog without submitting
    this.dialogRef.close();
  }

}
