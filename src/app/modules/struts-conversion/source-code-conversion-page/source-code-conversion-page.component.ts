import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ConversionService } from 'app/modules/conversion.service';
import { GitRequest } from '../reponse-from-backend';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SB_DESTINATION_PATH, NG_DESTINATION_PATH, SPRING_BOOT_METHODS, ANGULAR_METHODS } from 'app/utils/app.constants';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToasterService } from '../toaster/toaster.service';

@Component({
  selector: 'app-source-code-conversion-page',
  templateUrl: './source-code-conversion-page.component.html',
  styleUrls: ['./source-code-conversion-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SourceCodeConversionPageComponent implements OnInit {
  @Input() sourcePath: string;
  @Input() conversionAiMethod: string;
  @Output() conversionInProgress= new EventEmitter<Boolean>();
  destinationPath: string;
  ngDestinationPath: string;
  private eventSource: EventSource | null = null;
  private ngEventSource: EventSource | null = null;
  showGitPath = false;

  sbIsExpanded: boolean = false;
  ngIsExpanded: boolean = false;
  streamActive = false;
  ngStreamActive = false;
  sbDestinationUrl: string = SB_DESTINATION_PATH;
  sb_BranchName: string = 'dev';
  sbConversionStart = false;
  ngDestinationUrl: string = NG_DESTINATION_PATH;
  ng_BranchName: string = 'dev';
  ngConversionStart = false;
  enableAngularConversion = false;
  isAngularConversionCompleted = false;
  showAlert = false;
  // conversionData: any;
  conversionData: any;
  configForm: UntypedFormGroup;
  branchNameTemp: string = '';
  @Output() isConversionCompleted = new EventEmitter<{
    showGitPath: boolean;
    sbDestinationUrl: string;
    ngDestinationUrl: string;
    ngDestinationPath: string;
    sbDestinationPath: string;
  }>();
  sourceDatabase: string | null = null;
  targetDatabase: string | null = null;
  databaseTypes = [
    { key: 'MS SQL Server', value: 'SQL Server' },
    { key: 'Oracle', value: 'Oracle' },
    { key: 'Postgres SQL', value: 'Postgres' },
  ];
  aiOptions: string;
  methods = JSON.parse(JSON.stringify(SPRING_BOOT_METHODS));
  ngMethods = JSON.parse(JSON.stringify(ANGULAR_METHODS));

  methodsTemp = JSON.parse(JSON.stringify(SPRING_BOOT_METHODS));
  ngMethodsTemp = JSON.parse(JSON.stringify(ANGULAR_METHODS));
  sbBranchName='';
  ngBranchName=''
  isSpringBootChecked: boolean = true;
  isAngularChecked: boolean = false;
  canEnableAngular: boolean = false;
  isConvertButton: boolean = true;
  @Output() analyzeClicked = new EventEmitter<void>();
  springBootLabel: string = 'Begin Spring Boot';
  angularLabel: string = 'Begin Angular';
  convertSpringBoot: boolean = true;
  constructor(private streamService: ConversionService, private cdr: ChangeDetectorRef,
    private _snackBar: MatSnackBar, private _formBuilder: UntypedFormBuilder,
    private _fuseConfirmationService: FuseConfirmationService, private toaster: ToasterService) {

  }

  ngOnInit(): void {
    this.streamService.getConversionData().subscribe(data => {
      // this.conversionData = data;
      if(data)
      this.setBackendConversionData(data);
    });
    this.streamService.getNgConversionData().subscribe(data => {
      if(data)
      this.setFrontendConversionData(data);
    });
    this.configErrorAlert();
    this.streamService.sourceDatabase$.subscribe((key) => {
      this.sourceDatabase = this.getDatabaseValue(key);;
    });

    this.streamService.targetDatabase$.subscribe((key) => {
      this.targetDatabase = this.getDatabaseValue(key);;
    });

    this.sbIsExpanded = !this.sbIsExpanded;
  }

  getDatabaseValue(key: string | null): string | null {
    if (!key) return null;
    const dbType = this.databaseTypes.find((db) => db.key === key);
    return dbType ? dbType.value : null;
  }
  setBackendConversionData(data: any) {
    this.methods.forEach(method => {
      const matchedData = data.find(conversion => conversion.extension === method.task)
      if (matchedData) {
        method.conversionRate = matchedData.percentage;
      }
      if (method.name === 'copyStrutsCommonFileToSpringBoot') {
        const servicePercentage = data.find(conversion => conversion.extension === 'Service');
        const daoPercentage = data.find(conversion => conversion.extension === 'DAO');
        if (servicePercentage && daoPercentage) {
          method.conversionRate = String(Math.round((servicePercentage.percentage + daoPercentage.percentage) / 2));
        }
      }
    });
  }
  setFrontendConversionData(data: any) {
    this.ngMethods.forEach(ngMethod => {
      const matchedData = data.find(conversion => conversion.extension === ngMethod.task)
      if (matchedData) {
        ngMethod.conversionRate = matchedData.percentage;
      }
    });
  }
  startSbStream() {
    if (!this.streamActive) {
      const project = 'springBoot';
      this.streamActive = true;
      const data = {
        basePath: this.sourcePath,
        destinationPath: this.destinationPath
      };
      this.conversionInProgress.emit(true);
      this.isConvertButton = false;
      // Call the changePath API first
      this.streamService.setDestinationPath(data).subscribe(
        (response) => {
          this.aiOptions = this.streamService.getConversionAiMethod();
          console.log('aiOptions inside api call, source code page: ', this.aiOptions);
          this.eventSource = this.streamService.connectToSpringbootConvert(this.aiOptions, this.targetDatabase);
          this.eventSource.addEventListener('method-start', (event: any) => {
            const data = JSON.parse(event.data);
            const keyMethod = Object.keys(data)[0];
            this.updateStatus(keyMethod, 'Started', project);
          });
          this.eventSource.addEventListener('file-start', (event: any) => {
            const data = JSON.parse(event.data);
            this.updateChildProperty("file-start", data, project);
          });
          this.eventSource.addEventListener('file-end', (event: any) => {
            const data = JSON.parse(event.data);
            this.updateChildProperty("file-end", data, project);
          });
          // this.eventSource.addEventListener('error', (event: any) => {
          //   const data = JSON.parse(event.data);
          //   this.updateChildProperty("error", data, project);
          // });
          this.eventSource.addEventListener('method-end', (event: any) => {
            const data = JSON.parse(event.data);
            this.updateStatus(Object.keys(data)[0], 'Completed', project);

            if (this.methods.every((method) => method.status === 'Completed')) {
              this.stopStream();
              this.enableAngularConversion = true;
              this.conversionInProgress.emit(false);
              this.isConvertButton = true;
              // this.isSpringBootChecked = false;
              this.convertSpringBoot = false;
              this.isAngularChecked=true;
              this.springBootLabel = 'Spring Boot Completed';
              this.ngIsExpanded = !this.ngIsExpanded;
              // this._snackBar.open('Springboot Conversion Completed!', '', {
              //   duration: 3000,
              //   horizontalPosition: 'center', 
              //   verticalPosition: 'top',
              //   panelClass: ['custom-success-snackbar'],
              // });
              this.toaster.showMessage('Springboot Conversion Completed!', 'success');
            }
          });
          this.eventSource?.addEventListener('error', (event: any) => {
            const data = JSON.parse(event.data);
            const key = Object.keys(data)[0];
            const errorMessage = data[key];
            console.error(errorMessage)
            this.eventSource.close();
            this.methods = this.methodsTemp;
            this.streamActive = false;
            this.eventSource = null;
            this.sbConversionStart = false;
            this.configForm.patchValue({
              title: 'Error',          
              message: errorMessage
            });
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
            this.conversionInProgress.emit(false);
          });
          // this.eventSource.addEventListener('error', (event: any) => {
          //   console.error('Error event: ', event);
          // });
        },
        (error) => {
          console.error('Error in path change API:', error);
          this.conversionInProgress.emit(false);
          this.isConvertButton = true;
        }
      );
    }
  }
  startNgStream(sourcePath: string) {
    this.conversionInProgress.emit(true);
    this.isConvertButton = false;
    if (!this.ngStreamActive) {
      const project = 'angular';
      this.ngStreamActive = true;
      this.ngEventSource = this.streamService.connectToAngularConvert(sourcePath);
      this.ngEventSource.addEventListener('method-start', (event: any) => {
        const data = JSON.parse(event.data);
        const keyMethod = Object.keys(data)[0];
        this.updateStatus(keyMethod, 'Started', project);
      });
      this.ngEventSource.addEventListener('file-start', (event: any) => {
        const data = JSON.parse(event.data);
        this.updateChildProperty("file-start", data, project);
      });
      this.ngEventSource.addEventListener('file-end', (event: any) => {
        const data = JSON.parse(event.data);
        this.updateChildProperty("file-end", data, project);
      });
      // this.ngEventSource.addEventListener('error', (event: any) => {
      //   const data = JSON.parse(event.data);
      //   this.updateChildProperty("error", data, project);
      // });
      this.ngEventSource.addEventListener('method-end', (event: any) => {
        const data = JSON.parse(event.data);
        this.updateStatus(Object.keys(data)[0], 'Completed', project);

        if (this.ngMethods.every((method) => method.status === 'Completed')) {
          this.ngStopStream();
          this.enableAngularConversion = true;
          this.isAngularConversionCompleted = true;
          // this.isConversionCompleted.emit(true);
          this.showGitPath = true;

          this.isConversionCompleted.emit({
            sbDestinationUrl: this.sbDestinationUrl,
            ngDestinationUrl: this.ngDestinationUrl,
            ngDestinationPath: this.ngDestinationPath,
            sbDestinationPath: this.destinationPath,
            showGitPath: this.showGitPath,
          });
          this.conversionInProgress.emit(false);


          console.log('showGitPath from source code conversion page: ', this.showGitPath);
          
          this.angularLabel = 'Angular Completed';

          // this._snackBar.open('Angular Conversion Completed!', '', {
          //   duration: 3000,
          //   horizontalPosition: 'center', 
          //   verticalPosition: 'top',
          //   panelClass: ['custom-success-snackbar'],
          // });
          this.toaster.showMessage('Angular Conversion Completed!', 'success');

          // this.showGitPath = true;
        }
      });

      this.ngEventSource?.addEventListener('error', (event: any) => {
        console.error('Error event: ', event);
        this.isConvertButton=true;
        this.ngStopStream();
        const data = JSON.parse(event.data);
        const key = Object.keys(data)[0];
        const errorMessage = data[key];
        this.configForm.patchValue({
          title: 'Error',          
          message: errorMessage
        });
        const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
        this.conversionInProgress.emit(false);
        
      });
    }
  }
  updateStatus(methodName: string, status: string, project: string): void {
    const method = project === 'springBoot' ? this.methods.find((m) => m.name === methodName) : this.ngMethods.find((m) => m.name === methodName);
    if (method && status === 'Started') {
      method.progress = 50;
      method.status = status;
      method.isOpen = true;
    } else if (method && status === 'Completed') {
      method.progress = 100;
      method.status = status;
      method.isOpen = false;
    }
  }
  updateChildProperty(fileStatus: string, data: any, project: string) {
    const methodKey = Object.keys(data)[0];
    const fileName = data[methodKey].file;
    const method = project === 'springBoot' ? this.methods.find((m) => m.name === methodKey) : this.ngMethods.find((m) => m.name === methodKey);

    if (method) {
      if (fileStatus === 'file-start') {
        let childMethosObj = data[methodKey]
        method.childMethods.push({ ...childMethosObj, value: 50 });
        this.cdr.detectChanges();
      } else if (fileStatus === 'file-end') {
        const fileToUpdate = method.childMethods.find((file) => file.file === fileName);
        if (fileToUpdate) {
          fileToUpdate.status = "Completed";
          fileToUpdate.value = 100
        }
      } else if (fileStatus === 'error') {
        const fileToUpdate = method.childMethods.find((file) => file.file === fileName);
        if (fileToUpdate) {
          fileToUpdate.status = "Error";
          fileToUpdate.value = 0
        }
      }
    }
  }

  stopStream(): void {
    this.streamService.pushChangesWithPath(this.destinationPath).subscribe(
      (response) => {
        console.log(response);
        this.toaster.showMessage('Branch Name : ' + this.sbBranchName +'\n'+ response.message);
      }
    );
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.streamActive = false;
    }
    this.showAlertPopup();
  }
  ngStopStream(): void {
    this.streamService.pushChangesWithPath(this.ngDestinationPath).subscribe(
      (response) => {
        console.log(response);
        this.toaster.showMessage('Branch Name : ' + this.ngBranchName +'\n'+ response.message);
           }
    );
    if (this.ngEventSource) {
      this.ngEventSource.close();
      this.ngEventSource = null;
      this.ngStreamActive = false;
      this.ngConversionStart = false
    }
  }
  springBootToggle(): void {
    this.sbIsExpanded = !this.sbIsExpanded;
  }
  angularToggle(): void {
    this.ngIsExpanded = !this.ngIsExpanded;
  }

  startSbConversion() {
    const gitRequest: GitRequest = {
      url: this.sbDestinationUrl,
      username: null,
      password: null,
      branch: this.sb_BranchName,
      conversionAiMethod: [this.conversionAiMethod]
    };
    console.log('source code=', gitRequest);
    this.branchNameTemp = this.sb_BranchName
    this.streamService.cloneAndCreateDestRepoBranch(gitRequest).subscribe((response) => {
      if (response.status === 'success') {
        this.destinationPath = response.sourcePath;
        this.sbConversionStart = true;
        this.sbBranchName =  response.branchName
        this.methods.forEach((method) => {
          method.status = 'Pending';
        });
        this.startSbStream();
      } else {
        // this.displayError(`Error: ${response.message}`);
      }
    }, (error) => {
      const errorMessage = error.error?.message || 'An unexpected error occurred while cloning the repository.';
      // this.displayError(errorMessage);
      console.error('Error cloning repository:', error);
    });
  }

  startNgConversion() {
    const gitRequest: GitRequest = {
      url: this.ngDestinationUrl,
      username: null,
      password: null,
      branch: this.ng_BranchName,
      conversionAiMethod: [this.conversionAiMethod]
    };
    this.branchNameTemp = this.ng_BranchName;
    this.streamService.cloneAndCreateDestAngularRepoBranch(gitRequest).subscribe((response) => {
      if (response.status === 'success') {
        this.ngDestinationPath = response.sourcePath;
        this.ngBranchName =  response.branchName
        this.ngConversionStart = true;
        this.ngMethods.forEach((method) => {
          method.status = 'Pending';
        });
        this.startNgStream(this.ngDestinationPath);
      } else {
        // this.displayError(`Error: ${response.message}`);
      }
    }, (error) => {
      const errorMessage = error.error?.message || 'An unexpected error occurred while cloning the repository.';
      // this.displayError(errorMessage);
      console.error('Error cloning repository:', error);
    });
  }

  // Method for showing the alert popup
  showAlertPopup(): void {
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 15000);
  }

  closeAlert(): void {
    this.showAlert = false;
  }

  getCompletedCount(childMethods: { status: string; file: string }[]): number {
    if (!childMethods || childMethods.length === 0) {
      return 0; // Return 0 if there are no childMethods
    }

    // Count the items where status is 'Completed'
    return childMethods.filter((method) => method.status === 'Completed').length;
  }
  getCompletionPercentage(childMethods: { status: string; file: string }[]): number {
    if (!childMethods || childMethods.length === 0) {
      return 0; // Return 0 if no childMethods are present
    }

    // Count the number of items with status 'Completed'
    const completedCount = childMethods.filter((method) => method.status === 'Completed').length;

    // Calculate the percentage (completedCount / totalCount) * 100
    return Math.round((completedCount / childMethods.length) * 100);
  }

  isValidUrl(url: string): boolean {
    if (!url) {
      return true;
    }
    // const regex = /^(https?:\/\/)?([a-zA-Z0-9.-]+)(\/[a-zA-Z0-9&%_./-]*)?$/;
    const regex = /^(https?:\/\/)?([a-zA-Z0-9.-]+)(\/[a-zA-Z0-9&%_./-]*)?(\?[a-zA-Z0-9&%=._-]*)?(#[a-zA-Z0-9&%=._-]*)?$/;
    return regex.test(url) && (url.includes('https://github.com') || url.includes('https://tfs.stgit.com'));
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
  preventSpace(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();  // Prevent space character from being entered
    }
  }

  onAnalyzeClick(): void {
    this.analyzeClicked.emit();
  }
  onAngularChecked(): void {
   
    this.isAngularChecked=true;
  }
}
