import { Component, OnInit, Inject, ViewChild, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { create } from "lodash";
import { FormBuilder, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MAT_SNACK_BAR_DATA, MatSnackBar } from "@angular/material/snack-bar";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { teradataEnvironmentNames } from "environments/environment"
import { GitRequest, ResponseDto } from "../reponse-from-backend";
import { ConversionService } from "../../conversion.service";
import { FileTransferComponent } from "../file-transfer/file-transfer.component";
import { SOURCE_PATH, SB_DESTINATION_PATH } from "app/utils/app.constants";
import { MatStepper } from "@angular/material/stepper";
import { Observable } from "rxjs";
import { ProgressBarService } from "app/modules/progress-bar.service";
import { FileManagerService } from "./file-manager.service";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


export interface DialogData {
  reponseList: ResponseDto;

}
@Component({
  selector: 'app-conversion-dashboard',
  templateUrl: './conversion-dashboard.component.html',
  styleUrls: ['./conversion-dashboard.component.scss']
})
export class ConversionDashboardComponent implements OnInit, AfterViewInit {
  completed: boolean = false;
  state: string;
  isConversionInProgress: boolean = false;
  @ViewChild('fileTransfer') fileTransfer: FileTransferComponent | undefined;
  @ViewChild('stepper') stepper: MatStepper;

  isProgressBarVisible$: Observable<boolean>;
  listData: any[] = [];
  standardizedFolderData: any[] = [];
  countShow: boolean = false;
  conversionAiMethod: string = 'vertexAi'
  isFinalStep = false;
  isFinish = false;
  stateFinish: string;
  defaultNoResponseFound : string = "Sorry, I couldn't find any data matching your query." 
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.fileTransfer) {
        console.log(this.fileTransfer.newTreeDataSource?.data);
      }
    });
  }

  currentStep = 0;
  sourcePath: string
  clonedPath: string
  gitUrl: string = SOURCE_PATH;
  gitDestinationUrl: string = SB_DESTINATION_PATH;
  branchName: string = 'dev';
  folderPath: string = '';  // Input path from user
  destinationPath: string
  createNames = teradataEnvironmentNames;
  pattern: any = "[a-z][-a-z0-9]{0,61}[a-z0-9]";
  responseFromBackend: ResponseDto = new ResponseDto();
  progressListSpring = ['1. Create Spring Boot Project', '2. Creating common Configurations', '3. Add Dependency To BuildGradle File ', '4.Converting StrutsCommonFile To SpringBoot', '5. Translate StrutsActions To SpringBoot Rests', '6. Translate StrutsForms To SpringBoot RequestBean']

  isVaildProjectStructure: boolean = false;
  progressListAngular = ['1. Create Angular Project', '2. Creating common layout', '3. Creating header, footer components', '4. Adding common styles in the project', '5. Converting Html1', '6. Converting html2']
  springBootProgess: ResponseDto = new ResponseDto();
  angularProgess: ResponseDto = new ResponseDto();
  username: string;
  password: string;
  messages: Map<any, any> = new Map<any, any>();
  showProcessSummary: boolean = false;
  afterResponse: number = 1;

  error: boolean = false;
  showRunButton: boolean = false;
  showRunButtonSpringBoot: boolean = false;
  showRunButtonAngular: boolean = false;
  showConversionPage = false
  startProcess = false;

  initiateStepControl = new FormControl('')
  reviewStepControl = new FormControl('', Validators.required)
  analyseStepControl = new FormControl('', Validators.required)
  convertStepControl = new FormControl('', Validators.required)

  configForm: UntypedFormGroup;
  showDestinationDirButton: boolean = false;

  showGitPath: boolean = false;
  sbDestinationUrl: string = '';
  ngDestinationPath: string = '';
  sbDestinationPath: string = '';
  ngDestinationUrl: string = '';
  alertConfigForm: UntypedFormGroup;
  isSpringBootChecked = true;
  isAngularChecked = false;
  canEnableAngular = false;

  constructor(
    private streamService: ConversionService,
    private fileManagerService: FileManagerService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private fuseConfirmationService: FuseConfirmationService,
    private progressBarService: ProgressBarService,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    this.setState(this.initiateStepControl, true)
    this.setState(this.reviewStepControl, true)
    this.isProgressBarVisible$ = this.progressBarService.spinnerVisibility$;
    // this.configErrorAlert()

  }

  handleValidationResult(event: { validationFailed: boolean, folderStructure: any[], fileTransfer: boolean }) {
    if (event.fileTransfer) {
      this.backToClonePage(this.stepper)
    }
  }

  isValidUrl(url: string): boolean {
    // If URL is empty, don't perform validation
    if (!url) {
      return true; // Return true so that the field is not marked invalid when empty
    }
    // const regex = /^(https?:\/\/)?([a-zA-Z0-9.-]+)(\/[a-zA-Z0-9&%_./-]*)?$/;
    const regex = /^(https?:\/\/)?([a-zA-Z0-9.-]+)(\/[a-zA-Z0-9&%_./-]*)?(\?[a-zA-Z0-9&%=._-]*)?(#[a-zA-Z0-9&%=._-]*)?$/;
    return regex.test(url) && (url.includes('https://github.com') || url.includes('https://tfs.stgit.com'));
  }

  onFolderSubmit(stepper: any) {
    this.setState(this.initiateStepControl, false);
    // Create the GitRequest object
    const gitRequest: GitRequest = {
      url: this.gitUrl,
      username: this.username,
      password: this.password,
      branch: this.branchName,
      conversionAiMethod: [this.conversionAiMethod]
    };
    console.log(gitRequest);
    // Call the cloneRepository service
    this.streamService.cloneRepository(gitRequest).subscribe((response) => {
      // Handle success
      if (response.status === 'success') {
        this.sourcePath = response.sourcePath;
        this.clonedPath = response.clonedPath;
         let fileData = response.fileData?.body;
        //this.listData = response.listData?.body;
        this.onValidateFileAndFolder(fileData)
        console.log('Repository cloned successfully:', response);
      } else {
        // Handle API-provided error
        this.displayError(`Error: ${response.message}`);
      }
    }, (error) => {
      // Handle HTTP/network errors
      const errorMessage = error.error?.message || 'An unexpected error occurred while cloning the repository.';
      this.displayError(errorMessage);
      console.error('Error cloning repository:', error);
    });
  }

  onValidateFileAndFolder(fileData) {
    let standardizedFolderData = this.fileManagerService.buildFolderStructureBackend(fileData);
    const projectType:any = this.fileManagerService.checkForMavenOrGradleType(standardizedFolderData);
    if((projectType == '')){
      this.alertConfigForm.patchValue({
        title: 'Not Allowed',
        message: 'This Project Does not contains the Pom.xml or build.gradle , So our system is unable to covert the project does not contains those files'
      });
      const dialogRef = this.fuseConfirmationService.open(this.alertConfigForm.value);
      return
    }
    const validationErrors = this.fileManagerService.validateStrutsFolderStructure(standardizedFolderData);
    console.log(validationErrors)
    if (validationErrors.length === 0) {
      this.standardizedFolderData = standardizedFolderData;
      this.isVaildProjectStructure = true;  // Validation passed
      this.reviewStepControl.setValue("Done")
      this.stepper.next();
      this.streamService.setData(this.standardizedFolderData)
    } else {
      this.isVaildProjectStructure = false;
      const dialogRef = this.fuseConfirmationService.open({
        title: 'Confirm',
        message: 'The folder structure needs to be standardized .Do you want to continue?',
        actions: {
          confirm: {
            label: 'Yes'
          }
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        if (result === 'confirmed') {
          this.standardizedFolderData = standardizedFolderData;
          this.reviewStepControl.setValue("Done")
          this.stepper.next();
        } else {

        }
      });

    }
  }



  // Helper method to display error messages
  displayError(message: string) {
    // this._snackBar.open(message, 'Close', {
    //   duration: 5000,
    //   panelClass: ['error-snackbar'],
    //   });

    // const branchName = this.branchName.toLocaleLowerCase();
    // if (message.toLocaleLowerCase().includes(`remote branch ${branchName} not found`)) {
    //   this.configForm.patchValue({
    //     title:'Failed to clone the repository',
    //     message: `Remote branch ${this.branchName} not found in upstream origin`
    //   });
    //   const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
    // } else{
    //   this.configForm.patchValue({
    //     title:'Error',
    //     message: message
    //   });
    //   const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
    // }

  }

  // For Push to Destination folder on git
 

  onFolderUpload(event: any): void {
    const files: File[] = Array.from(event.target.files);
    const folderPaths: string[] = files.map(file => file.webkitRelativePath.split('/').slice(0, -1).join('/'));  // Extract folder paths

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const folderPath = folderPaths[i];

      // Skip files in folders starting with a dot (.)
      if (folderPath.split('/')[0].startsWith('.') || file.name.startsWith('.') || this.isInExcludedFolder(folderPath)) {
        console.log(`Skipping file: ${file.name} in folder: ${folderPath}`);  // Log skipped files and folders
        continue;  // Skip this file
      }

      formData.append('files', file, file.name);
      formData.append('folderPath', folderPath);
    }

    // If there are valid files to upload, send them
    if (formData.has('files')) {
      this.streamService.updateFiles(formData).subscribe({
        next: (response: any) => {
          this.sourcePath = response.fullFolderPath
          console.log('File uploaded successfully:', response);
          console.log(this.sourcePath, "98765")
        },
        error: (error) => {
          console.error('File upload failed:', error);
        }
      });
    } else {
      console.log('No valid files to upload.');
    }
  }

  // Helper function to check if a file is in an excluded folder (gradle/, bin/, build/)
  private isInExcludedFolder(folderPath: string): boolean {
    const excludedFolders = ['gradle', 'bin', 'build'];
    return excludedFolders.some(excludedFolder => folderPath.includes(excludedFolder));
  }





  setState(control: FormControl, state: boolean) {
    if (state) {
      control.setErrors({ "required": true })
    } else {
      control.reset()
    }
  }

  ngOnInit(): void {

  }

  fileBrowseHandlerPdf(localfiles) {
    this.prepareFilesListPdf(localfiles);
  }




  prepareFilesListPdf(localfiles: Array<any>) {
    for (const file of localfiles) {
      const allowedTypes = ['txt']; //xlsx
      const fileExtension = file.name.split('.').pop();
      if (!allowedTypes.includes(fileExtension)) {
      }
      else {
      }
    }
  }

  backToClonePage(stepper) {
    this.setState(this.initiateStepControl, true)
    this.setState(this.reviewStepControl, true)
    this.setState(this.analyseStepControl, true)
    this.setState(this.convertStepControl, true)
    this.reviewStepControl.reset();
    this.analyseStepControl.reset();
    this.convertStepControl.reset();
    this.standardizedFolderData = [];
    this.sourcePath = ''
    this.clonedPath = ''
    stepper.previous()
  }

  backToReviewPage(stepper) {
    this.setState(this.reviewStepControl, true)
    this.analyseStepControl.reset();
    this.convertStepControl.reset();
    stepper.previous()
  }

  backToAnalysisPage(stepper) {
    this.setState(this.analyseStepControl, true)
    this.convertStepControl.reset();
    stepper.previous()
  }

  onSetupDirectory(stepper: any) {
    this.setState(this.analyseStepControl, false); // Call setState method with appropriate arguments
    this.analyseStepControl.setValue("Done")
    stepper.next()
  }
  onAnalyseReport(fileTransfer: any, stepper: any): void {
    this.setState(this.reviewStepControl, false); // Call setState method with appropriate arguments
    this.reviewStepControl.setValue("Done")
    if (!this.isVaildProjectStructure) {
      const data = fileTransfer.newTreeDataSource.data;
      console.log(data); // Log to ensure the data is structured properly
      const requestPayload = this.prepareDataForBackend(data);
      // Assuming the data has sourcePath and fileNodes
      const formData = {
        sourcePath: this.sourcePath,
        fileNodes: requestPayload,
      };
      console.log(formData)

      // Assuming you have an HTTP service to send the request
      this.streamService.updateFiles(formData)
        .subscribe(response => {
          if (response.status == 'Success') {
            this.openSnackBar("File Standardized Done")
            this.countShow = true
            this.sourcePath = response.sourcePath + 'Struts-Application\\'
            console.log(this.sourcePath)
            stepper.next();
          } else {
            console.error('Error sending data:', response.message);

          }
        }, error => {
          console.error('Error sending data:', error);
        });
    } else {
      this.countShow = true
      stepper.next();
    }
    // Now, send the data to the backend via HTTP

  }

  prepareDataForBackend(data: any): any[] {
    return data.map((node: any) => {
      return {
        name: node.name,
        type: node.type,
        fileSize: node.fileSize || 0,
        fileCount: node.fileCount || 0,
        content: node.content ? this.prepareDataForBackend(node.content) : [],
        originalPath: node.originalPath,
        path: node.path,
        fileContent: node.fileContent || null
      };
    });
  }
  redirectToConversionPage() {
    this.showConversionPage = true;
  }
  // start(){
  //   this.startProcess = true;
  // }
  showConversion(status: boolean): void {
    this.startProcess = status;
  }
  preventSpace(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();  // Prevent space character from being entered
    }
  }
  childEvent(event: boolean) {
    this.showDestinationDirButton = event;  // Updates the parent component with the boolean value
  }
  dataFromConversion(event: { showGitPath: boolean; sbDestinationUrl: string; ngDestinationUrl: string; ngDestinationPath: string; sbDestinationPath: string }) {
    this.isFinalStep = true;
    this.state = 'done';
    this.cdr.detectChanges();
    this.showGitPath = event.showGitPath;
    this.sbDestinationUrl = event.sbDestinationUrl;
    this.ngDestinationUrl = event.ngDestinationUrl;
    this.ngDestinationPath = event.ngDestinationPath;
    this.sbDestinationPath = event.sbDestinationPath;
    setTimeout(() => {
      this.stepper.next();
    }, 500);
    this.stateFinish = 'done';
    this.canEnableAngular = true;
  }

  conversionInProgress(event) {
    this.isConversionInProgress = event

  }

  openSnackBar(message: any) {
    this._snackBar.open(message, 'OK', {
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass: ['blue-snackbar']
    });
  }
  configErrorAlert() {
    this.alertConfigForm = this._formBuilder.group({
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

  onStepChange(event: StepperSelectionEvent): void {
    for (let i = 0; i <= event.selectedIndex; i++) {
      this.stepper.steps.get(i)!.editable = true;
    }
  }

  startOver() {
    // this.streamService.resetApp();
      window.location.href = '/'; 
  }


  result: string = '';
  userMessage: string = '';  
  msg: { id?: number, from: string, content: string | SafeHtml, rawText?: string, imageBase64?: string, chartData?: { data: any[], labels: string[], type: string, options?: any } }[] = [];  // Store chat messages
  isLoading = false; 
  isDarkMode = false;
  isMenuOpen = false;  
 

  // getSafeHtml(content: string): SafeHtml {
  //   return this.sanitizer.bypassSecurityTrustHtml(content);
  // }  

  submitResult(): void {
    const trimmedMessage = this.userMessage.trim();
    if (this.isLoading || !trimmedMessage) return;

    /* ---------------- USER MESSAGE ---------------- */
    const userMsgObj = {
      id: Date.now(),
      from: 'user',
      content: this.userMessage,
      rawText: this.userMessage
    };
    this.msg.push(userMsgObj);

    /* -------- BUILD PARTS ARRAY (CHAT HISTORY) -------- */
    const partsObj: any[] = [];
    for (const message of this.msg) {
      partsObj.push({
        text: message.content
      });
    }

    this.scrollToBottom();
    this.isLoading = true;

    /* ---------------- API PAYLOAD ---------------- */
    const userPrompt = {
      jsonrpc: '2.0',
      id: '1234',
      method: 'message/send',
      params: {
        message: {
          messageId: '1234',
          role: 'user',
          parts: partsObj
        }
      }
    };

    this.userMessage = '';

    /* ---------------- API CALL ---------------- */
    this.http.post(
        'https://orchestrator-agent-ai-999590495492.us-central1.run.app',
        userPrompt,
        {
          observe: 'response',
          responseType: 'blob'
        }
    ).subscribe(
        async (response) => {
          try {
            const contentType = response.headers.get('Content-Type') || '';

            /* =====================================================
               ✅ CASE 1: EXCEL / BINARY RESPONSE
            ===================================================== */
            if (
                contentType.includes('application/vnd.openxmlformats') ||
                contentType.includes('application/octet-stream')
            ) {
              this.downloadExcel(response.body!, response.headers);

              this.msg.push({
                id: Date.now(),
                from: 'bot',
                content: 'Your Excel file is ready and downloaded successfully.'
              });

              this.scrollToBottom();
              return;
            }

            /* =====================================================
               ✅ CASE 2: TEXT / JSON RESPONSE
            ===================================================== */
            const textResponse = await response.body!.text();
            const parsedResponse = JSON.parse(textResponse);

            const results = parsedResponse?.result;
            const artifacts = results?.artifacts ?? [];
            const parts = artifacts[0]?.parts ?? [];
            const botMessages = parts[0] ?? { text: this.defaultNoResponseFound };

            let botMessage =
                typeof botMessages === 'string'
                    ? botMessages
                    : botMessages?.text || this.defaultNoResponseFound;

            /* -------- FORMAT BOT MESSAGE -------- */
            botMessage = botMessage
                .replace(/```(?:markdown)?/gi, '')
                .replace(/^#+\s*/gm, '')
                .replace(/^---+\s*/gm, '')
                .replace(/\n/g, '<br/>')
                .replace(/(<br\/>\s*){2,}/gi, '<br/>')
                .replace(/\*\*/g, '')
                .replace(/\*/g, '');

            const formattedMessage = botMessage;

            const newBotMsg: any = {
              id: Date.now() + 1,
              from: 'bot',
              rawText: botMessage,
              content: ''
            };

            /* -------- OPTIONAL CHART DATA -------- */
            const chartData = parsedResponse?.chartData;
            if (
                chartData &&
                Array.isArray(chartData.data) &&
                Array.isArray(chartData.labels)
            ) {
              newBotMsg.chartData = {
                data: chartData.data,
                labels: chartData.labels,
                type: chartData.type || 'bar',
                options: chartData.options || { responsive: true }
              };
            }

            this.msg.push(newBotMsg);

            await this.simulateTypingEffect(formattedMessage, newBotMsg);

            newBotMsg.content = formattedMessage;
            newBotMsg.rawText = botMessage;

            /* -------- IMAGE SUPPORT -------- */
            if (parsedResponse?.image_base64) {
              newBotMsg.imageBase64 = parsedResponse.image_base64;
            }

            this.scrollToBottom();
          } catch (err) {
            console.error('Processing Error:', err);
            this.msg.push({
              id: Date.now(),
              from: 'bot',
              content: 'Sorry, I couldn’t process the response due to an internal error.'
            });
          } finally {
            this.isLoading = false;
          }
        },
        (error) => {
          this.isLoading = false;
          console.error('API Error:', error);
          this.msg.push({
            id: Date.now(),
            from: 'bot',
            content: 'Sorry, I couldn’t find any data matching your query.'
          });
        }
    );
  }


  private downloadExcel(blob: Blob, headers: any): void {
    let fileName = 'output.xlsx';

    const contentDisposition = headers.get('Content-Disposition');
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match?.[1]) {
        fileName = match[1];
      }
    }

    const excelBlob = new Blob([blob], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(excelBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }


  async simulateTypingEffect1(fullText: string, messageRef: { from: string, content: string | SafeHtml }): Promise<void> {
    const typingDelay = 1;
    let tempText = '';
    for (let i = 0; i < fullText.length; i++) {
      let text = fullText[i]
      tempText += text;
      messageRef.content = this.getSafeHtml(tempText);
      // console.log(messageRef);
      // console.log(messageRef.content);
      this.scrollToBottom();
      await new Promise(resolve => setTimeout(resolve, typingDelay));
    }
  }
  
async simulateTypingEffect(fullText: string, messageRef: { from: string, content: string | SafeHtml }): Promise<void> {
  const chunkSize = 5; // number of characters per update
  const typingDelay = 10; // ms delay between chunks
  let tempText = '';
  
  for (let i = 0; i < fullText.length; i += chunkSize) {
    tempText += fullText.substring(i, i + chunkSize);
    messageRef.content = this.getSafeHtml(tempText);
    this.scrollToBottom();
    await new Promise(resolve => setTimeout(resolve, typingDelay));
  }
}

  
  scrollToBottom() {
    setTimeout(() => {
      const chatWindow = document.querySelector('.chat-window');
      if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    }, 50);
  }
  
  getMessageClass(msg: any): any {
    const isError = msg.from === 'bot' && typeof msg.content === 'string' && msg.content.includes("Sorry, I couldn’t find any data matching your query.");
    return {
      'user-message': msg.from === 'user',
      'bot-message': msg.from === 'bot' && !isError,
      'error-message': isError
    };
  }
  
  zoomedImageIndex: number | null = null;
  zoomLevel: number = 1;
  
  getSafeHtml(text: string): SafeHtml {
    return text; 
  }
  
  openImagePopup(index: number): void {
    this.zoomedImageIndex = index;
    this.zoomLevel = 1; 
  }
  
  closeImagePopup(): void {
    this.zoomedImageIndex = null;
    this.zoomLevel = 1;
  }

  zoomIn(): void {
    this.zoomLevel = Math.min(this.zoomLevel + 0.1, 3);
  }
  
  zoomOut(): void {
    this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
  }
  
  resetZoom(): void {
    this.zoomLevel = 1;
  }
  
  onImageWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    const imageElement = document.querySelector('.popup-image') as HTMLImageElement;
    const container = document.querySelector('.popup-content') as HTMLElement;
  
    if (!imageElement || !container) return;
  
    const minZoom = Math.min(
      container.clientWidth / imageElement.naturalWidth,
      container.clientHeight / imageElement.naturalHeight,
      1 
    );
  
    const newZoom = this.zoomLevel + delta;
    this.zoomLevel = Math.min(Math.max(newZoom, minZoom), 3);
  }
  
  
  async downloadChatAsPDF(): Promise<void> {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    const lineHeight = 7;
    const footerHeight = 10;
    const headerHeight = 20;
    let y = headerHeight + 5;
    let pageNumber = 1;
  
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
    const logoSrc = 'assets/images/logo/logoBlack.png';    
  
    const drawHeader = () => {
      doc.setFontSize(10);
      if (logoSrc) {
        doc.addImage(logoSrc, 'PNG', margin, 5, 15, 15);
      }
      doc.setFont('helvetica', 'bold');
      doc.text('Conversation Report', pageWidth / 2, 12, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.text(currentDate, pageWidth - margin, 12, { align: 'right' });
  
      doc.setDrawColor(0);
      doc.line(margin, headerHeight, pageWidth - margin, headerHeight);
    };
  
    const drawFooter = (pageNum: number, totalPages: number) => {
      const lineY = pageHeight - footerHeight;
      const textY = pageHeight - 5;
      doc.setDrawColor(0);
      doc.line(margin, lineY, pageWidth - margin, lineY);
      doc.setFontSize(8);
      doc.text(`Page ${pageNum} of ${totalPages}`, margin, textY);
    };
  
    const addNewPage = () => {
      doc.addPage();
      pageNumber++;
      drawHeader();
      y = headerHeight + 5;
    };
  
    const processText = (text: string): string[] => {
      return doc.splitTextToSize(
        text
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/(<br\s*\/?>\s*){2,}/gi, '\n')
          .replace(/<\/?[^>]+(>|$)/g, '')
          .replace(/^\s*[\r\n]/gm, ''),
        pageWidth - 2 * margin
      );
    };
  
    const addText = (lines: string[]) => {
      for (const line of lines) {
        if (y + lineHeight > pageHeight - footerHeight) {
          addNewPage();
        }
        doc.text(line, margin, y);
        y += lineHeight;
      }
    };
  
    const addImageToDoc = (src: string, width: number, height: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          if (y + height > pageHeight - footerHeight) {
            addNewPage();
          }
          doc.addImage(img.src, 'PNG', margin, y, width, height);
          y += height + 2;
          resolve();
        };
      });
    };
  
    drawHeader();
  
    for (const message of this.msg) {
      if (!message.content && !message.rawText && !message.chartData && !message.imageBase64) continue;
  
      doc.setFont('helvetica', 'bold');
      doc.text(message.from === 'user' ? 'User:' : 'Bot:', margin, y);
      y += lineHeight;
      doc.setFont('helvetica', 'normal');
  
      const content = (message.rawText || message.content || '') as string;
      if (content) {
        const lines = processText(content);
        addText(lines);
      }
  
      if (message.chartData) {
        const canvas = document.querySelector(`#chart-${message.id}`) as HTMLCanvasElement;
        if (canvas) {
          const chartImage = canvas.toDataURL('image/png');
          const imgWidth = 160;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          await addImageToDoc(chartImage, imgWidth, imgHeight);
        }
      }
  
      if (message.imageBase64) {
        const imgWidth = 160;
        const imgHeight = 100;
        const base64Img = `data:image/png;base64,${message.imageBase64}`;
        await addImageToDoc(base64Img, imgWidth, imgHeight);
      }
  
      y += 2;
    }
 
    const total = doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      drawFooter(i, total);
    }
  
    doc.save('chat-conversation.pdf');
  }
  
  hasBotResponse(): boolean {
    return this.msg.some(message => message.from === 'bot');
  }
}   
  
  
