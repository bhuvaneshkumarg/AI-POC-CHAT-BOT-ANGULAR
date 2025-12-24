import { Component, OnInit, Inject } from "@angular/core";
import { create } from "lodash";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_SNACK_BAR_DATA, MatSnackBar } from "@angular/material/snack-bar";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { teradataEnvironmentNames } from "environments/environment"
import { ResponseDto } from "../reponse-from-backend";
import {ConversionDashboardService} from "../conversion-dashboard/conversion-dashboard.service";

@Component({
  selector: 'app-conversion-dashboard-v1',
  templateUrl: './conversion-dashboard-v1.component.html',
  styleUrls: ['./conversion-dashboard-v1.component.scss']
})
export class ConversionDashboardV1Component implements OnInit {
  createNames= teradataEnvironmentNames;
  pattern: any = "[a-z][-a-z0-9]{0,61}[a-z0-9]";
  responseFromBackend: ResponseDto = new ResponseDto();
  progressListSpring=['1. Create Spring Boot Project','2. Creating common Configurations','3. Add Dependency To BuildGradle File ','4.Converting StrutsCommonFile To SpringBoot','5. Translate StrutsActions To SpringBoot Rests','6. Translate StrutsForms To SpringBoot RequestBean']
  progressListAngular=['1. Create Angular Project','2. Creating common layout','3. Creating header, footer components','4. Adding common styles in the project','5. Converting Html1','6. Converting html2']
  springBootProgess: ResponseDto = new ResponseDto();
  angularProgess: ResponseDto = new ResponseDto();

  messages: Map<any, any> = new Map<any, any>();
  showProcessSummary: boolean = false;
  afterResponse: number = 1;
  error: boolean = false;
  showRunButton: boolean = false;
  showRunButtonSpringBoot: boolean = false;
  showRunButtonAngular: boolean = false;

  constructor(
      private runJobService: ConversionDashboardService,
      private formbuilder: FormBuilder,
      private _snackBar: MatSnackBar,
      public dialog: MatDialog,
  ) {}

  ngOnInit(): void {

    // this.webSocketService.getMessage().subscribe(message => {
    //   if (message.includes("false")) {
    //     this.messages.set(message.split(",")[0], "error");
    //     alert(message.split(",")[2])
    //   }
    //   this.messages.set(message, "completed");
    //
    //   //console.log(this.messages);
    //   if (message.includes('projects')) {
    //     this.storeJobName(message)
    //     this.createForm.controls['deleteItemsListGcp'].setValue(message);
    //     this.runJobService.setResponse(this.createForm.value);
    //     //console.log(this.createForm.value);
    //   }
    // });
  }

  fileBrowseHandlerPdf(localfiles) {
    this.prepareFilesListPdf(localfiles);
  }
  prepareFilesListPdf(localfiles: Array<any>) {
    for (const file of localfiles) {
      const allowedTypes = ['txt']; //xlsx
      const fileExtension = file.name.split('.').pop();
      if (!allowedTypes.includes(fileExtension)) {
        // this.alert = {
        //   type: "error",
        //   message: "Please upload only txt file",
        // };
        // this.showAlertPdf = true;
        // alert('Please upload only pdf file');
      }
      else {
        // if (this.countFileSize(file?.size)) {
        //     this.files.push(file);
        //     this.uploadService.getAllPdfFiles().next(this.files);
        // }

      }
    }
    //  this.uploadFilesSimulator(0);
  }



  onFolderSelected(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      console.log('Selected folder contents:');
      for (let i = 0; i < files.length; i++) {
        console.log('File: ', files[i].name);
      }
    }
  }

  intialiseForm() {}
  createForm: FormGroup = this.formbuilder.group({
    projectId: ["muthu-poc-2023", [Validators.required]],
    bucketName: ["teradata_bq_migration_bucket", [Validators.required]],
    instanceZone: ["us-central1-a", [Validators.required]],
    instanceName: [
      "bg-migration-agent-vm",
      [Validators.required, Validators.pattern("[a-z][-a-z0-9]{0,61}[a-z0-9]")],
    ],
    datasetName: ["teradatadb_10gb", [Validators.required]],
    databaseName: ["teradatadb_10gb", [Validators.required]],
    serviceAccountName: [
      "sa-migration@muthu-poc-2023.iam.gserviceaccount.com",
      [Validators.required],
    ],
    host: ["34.68.35.164", [Validators.required]],
    port: ["1025", [Validators.required]],
    projectNumber: ["952234360352", [Validators.required]],
    tableNamePattern: [
      "irs_returns1p2g1|irs_returns1p2g2",
      [Validators.required],
    ],
    validationDatasetName: ["pso_data_validator", [Validators.required]],
    dataTransferJobConfigName: [
      "teradata-to-bq-data-transfer",
      [Validators.required],
    ],
    deleteItemsListGcp: ["data-transfer", [Validators.required]],
  });



  runSpringBoot(){
    this.showRunButtonSpringBoot=true;
    this.showProcessSummary = true;

  }

  runAngular(){
    this.showRunButtonAngular=true
    this.showProcessSummary = true;

  }

  create() {
    sessionStorage.setItem("bucketName", this.createForm.value.bucketName)
    sessionStorage.setItem("instanceName", this.createForm.value.instanceName)
    sessionStorage.setItem("instanceZone", this.createForm.value.instanceZone)
    sessionStorage.setItem("projectId", this.createForm.value.projectId)

    this.showProcessSummary = true;
    this.afterResponse = this.afterResponse + 1;
    //this.webSocketService.sendMessage(this.createForm.value);
    this.runJobService.runCreateJob(this.createForm.value).subscribe((data) => {
      this.responseFromBackend = data;
      // alert(this.responseFromBackend.message)
      this.showRunButton=false;
      this.openDialog(this.responseFromBackend);
      // this.openSnackBar(this.responseFromBackend.message)
      if (this.responseFromBackend.status) {
        this.createForm.controls["deleteItemsListGcp"].setValue(
            this.responseFromBackend.configName
        );
        sessionStorage.setItem("deleteItemsListGcp",this.createForm.value.deleteItemsListGcp)

      }
    });

    if (this.afterResponse > 2) {
      this.responseFromBackend.message = null;
      this.responseFromBackend.status = false;
    }
  }
  // openSnackBar(message:any) {
  //     this._snackBar.open(message, 'OK', {
  //       horizontalPosition: "center",
  //       verticalPosition: "top",
  //       panelClass: ['blue-snackbar']
  //     });
  //   }

  openDialog(message: ResponseDto) {
    // const dialogRef = this.dialog.open(AlertCreateComponent, {
    //   width: "500px",
    //   height: "auto",
    //   data: {
    //     reponseList: message,
    //     type: "success",
    //   },
    // });
    // dialogRef.afterClosed().subscribe(result => {


    // });
  }


}


