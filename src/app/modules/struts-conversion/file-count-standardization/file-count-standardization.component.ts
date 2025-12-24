import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConversionService } from 'app/modules/conversion.service';
import { SpinnerService } from 'app/modules/spinner.service';
import { forkJoin, Observable } from 'rxjs';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ProgressBarService } from 'app/modules/progress-bar.service';
import autoTable from 'jspdf-autotable';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConversionReportService } from 'app/modules/conversion-report.service';
import { ToasterService } from '../toaster/toaster.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-file-count-standardization',
  templateUrl: './file-count-standardization.component.html',
  styleUrls: ['./file-count-standardization.component.scss']
})
export class FileCountStandardizationComponent implements OnInit {

  // fileTypes: { [key: string]: number } = {};
  // totalFiles: number = 0;
  @Input() sourcePath: any;
  @Output() passToParent = new EventEmitter<boolean>();;
  @Output() selectedAi = new EventEmitter<string>();
  // @Input() conversionAiMethod: string;
  conversionAiMethod: string = 'vertexAi';
  sourcePathValue: any;
  backendFileStats: { extension: string; count: number; percentage: number; files: [] }[] = [];
  frontendFileStats: { extension: string; count: number; percentage: number; files: [] }[] = [];

  automaticConversionPercentageBackend: any;
  manualConversionPercentageBackend: any;

  automaticConversionPercentageFrontend: any;
  manualConversionPercentageFrontend: any;

  backendDoughnutStyle = {};
  frontendDoughnutStyle = {};
  isProgressBarVisible$: Observable<boolean>;
  // loading: boolean = false;
  showContent = false;
  processInProgress = false;
  selectedSourceDatabase: string | null = 'Oracle';
  selectedTargetDatabase: string | null = 'Postgres SQL';
  databaseTypes: { key: string; value: string }[] = [
    { key: 'MS SQL Server', value: 'SQL Server' },
    { key: 'Oracle', value: 'Oracle' },
    { key: 'Postgres SQL', value: 'Postgres' },
  ];

  @Output() reviewClicked = new EventEmitter<void>();
  @Output() convertClicked = new EventEmitter<void>();
  // showConvertButton: boolean = false;
  isAnalyzeDisabled: boolean = false;
  downloadReport: boolean = false;
  delaySeconds: number = 2000;
  constructor(private service: ConversionService, private spinner: SpinnerService, private progressBarService: ProgressBarService
    , private fuseConfirmationService: FuseConfirmationService, private matSnackBar: MatSnackBar,
    private conversionReport: ConversionReportService,
    private toaster: ToasterService
  ) {
    this.isProgressBarVisible$ = this.progressBarService.spinnerVisibility$;
  }

  ngOnInit(): void {
    const sourcePathValue = this.service.getData();
    console.log('sourcePathValue: ', sourcePathValue);
    this.onSourceDatabaseChange(this.selectedSourceDatabase);
    this.onTargetDatabaseChange(this.selectedTargetDatabase)

    // this.updateBackendDoughnutStyle();
    // this.updateFrontendDoughnutStyle();
  }


  ngOnChanges(): void {
    console.log('this.sourcePath: ', this.sourcePath);
    console.log('this.sourcePathValue: ', this.sourcePathValue);
  }

  // fileStats API Call
  // loadFileStats(): void {
  //   this.spinner.show();
  //   const data = { basePath: this.sourcePath };

  //   this.service.changePath(data).subscribe(
  //     () => {
  //       this.service.getFileStats().subscribe(
  //         (response) => {
  //           console.log('Original fileStats:', response);


  //           this.service.getHTMLFileStats().subscribe(
  //             (htmlJsStats) => {
  //               console.log('HTML and JS stats:', htmlJsStats);


  //               const mergedStats = response.map((file) => {
  //                 const matchingExtension = htmlJsStats.find(
  //                   (stat) => stat.extension.toLowerCase() === file.extension.toLowerCase()
  //                 );
  //                 return matchingExtension ? matchingExtension : file;
  //               }); 

  //               this.fileStats = mergedStats.map((file) => ({
  //                 ...file,
  //                 percentage: file.percentage < 0 ? 0 : Math.floor(file.percentage),
  //               }));

  //               this.service.setConversionData(this.fileStats);
  //               console.log('Merged fileStats:', this.fileStats);
  //               const totalPercentage = this.fileStats.reduce((sum, file) => sum + file.percentage, 0);
  //               const percentageOccurrences = this.fileStats.filter((file) => 'percentage' in file).length;

  //               this.automaticConversionPercentage = Math.round(totalPercentage / percentageOccurrences);
  //               this.manualConversionPercentage = Math.round(100 - this.automaticConversionPercentage);
  //               this.updateDoughnutStyle();
  //               this.spinner.hide();
  //               console.log(
  //                 `this.automaticConversionPercentage: ${this.automaticConversionPercentage}, ` +
  //                 `manualConversionPercentage: ${this.manualConversionPercentage}, ` +
  //                 `totalPercentage: ${totalPercentage}, ` +
  //                 `percentageOccurrences: ${percentageOccurrences}`
  //               );
  //             },
  //             (error) => {
  //               console.error('Error fetching HTML and JS stats:', error);
  //               this.spinner.hide();
  //             }
  //           );
  //         },
  //         (error) => {
  //           console.error('Error fetching file stats:', error);
  //           this.spinner.hide();
  //         }
  //       );
  //     },
  //     (error) => {
  //       console.error('Error changing path:', error);
  //       this.spinner.hide();
  //     }
  //   );
  // }

  checkForProjectDetailsAndPath() {
    const requestBody = {
      conversionAiMethod: this.conversionAiMethod,
      buildNumber: this.sourcePath
    }
    this.service.checkForProjectDetailsAndPath(requestBody).subscribe(resposnse => {
      if (resposnse) {
        //this.openConfirmationDialogForPath(resposnse);
        this.loadFileStats();
        console.log("Struts Source File Path and Package Path:" + resposnse.strutsWebProjPath + "   " + resposnse.strutsWebBasePkg)
      } else {
        this.matSnackBar.open("There is Error in Fetching the Source Path , Try Again", 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }
    }, (error) => {
      console.error('Error fetching file stats:', error);
      this.matSnackBar.open("There is Error in Fetching the Source Path , Try Again", 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    })
  }


  private openConfirmationDialogForPath(resposnse: any) {
    if (resposnse) {
      let res = resposnse;
      const dialogRef = this.fuseConfirmationService.open({
        icon: {
          show: false,
        },
        message: `<pre>
    <strong>Confirmation for Struts Project Path 
                 and source File Packages</strong>
         
    Common Project Name: <strong>${res.strutsCommonProjPath}</strong>
    Web Project Name: <strong>${res.strutsWebProjPath}</strong>
    Web Package Path: <strong>${res.strutsWebBasePkg}</strong>
    Common Package Path: <strong>${res.strutsCommonBasePkg}</strong>
  </pre>`,

        actions: {
          confirm: {
            label: 'Yes',
            color: 'primary'
          },
          cancel: {
            label: 'No'
          }
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);

        if (result === 'confirmed') {
          this.loadFileStats();
        } else {
        }
      });
    }
  }

  loadFileStats(): void {
    this.processInProgress = true;
    this.progressBarService.show();
    const data = {
      basePath: this.sourcePath
    };
    const requestBody = {
      conversionAiMethod: this.conversionAiMethod,
      buildNumber: this.sourcePath,
      sourceDatabase: this.selectedSourceDatabase,
      targetDatabase: this.selectedTargetDatabase
    }
    forkJoin({
      backendStats: this.service.getFileStats(requestBody),
      frontendStats: this.service.getHTMLFileStats(requestBody),
    }).subscribe(
      ({ backendStats, frontendStats }) => {
        // Process backend stats
        this.backendFileStats = backendStats.map((file) => ({
          ...file,
          percentage: file.percentage < 0 ? 0 : Math.floor(file.percentage),
        }));
        this.service.setConversionData(this.backendFileStats);
        const totalBackendPercentage = this.backendFileStats.reduce((sum, file) => sum + file.percentage, 0);
        const backendOccurrences = this.backendFileStats.filter((file) => 'percentage' in file).length;
        this.automaticConversionPercentageBackend = Math.round(totalBackendPercentage / backendOccurrences);
        this.manualConversionPercentageBackend = Math.round(100 - this.automaticConversionPercentageBackend);
        this.updateBackendDoughnutStyle();

        // Process frontend stats
        // this.frontendFileStats = frontendStats.map((file) => ({
        //   ...file,
        //   percentage: file.percentage < 0 ? 0 : Math.floor(file.percentage),
        // }));

        this.frontendFileStats = frontendStats
          .filter(file => file.count > 0) // Excludes 0.0
          .map(file => ({
            ...file,
            percentage: Math.floor(file.percentage), // Rounds down
          }));

        this.service.setNgConversionData(this.frontendFileStats);

        const totalFrontendPercentage = this.frontendFileStats.reduce((sum, file) => sum + file.percentage, 0);
        const frontendOccurrences = this.frontendFileStats.filter((file) => 'percentage' in file).length;
        this.automaticConversionPercentageFrontend = Math.round(totalFrontendPercentage / frontendOccurrences);
        this.manualConversionPercentageFrontend = Math.round(100 - this.automaticConversionPercentageFrontend);
        this.updateFrontendDoughnutStyle();

        // Hide spinner after both calls complete
        // this.spinner.hide();
        this.progressBarService.hide();
        this.showContent = true;
        this.processInProgress = false;
        this.passToParent.emit(true);
        // this.matSnackBar.open('Analysis Completed!', '', {
        //   duration: 3000,
        //   horizontalPosition: 'center', 
        //   verticalPosition: 'top',
        //   panelClass: ['custom-success-snackbar'],
        // });
        this.toaster.showMessage('Analysis Completed!', 'success');
      },
      (error) => {
        console.error('Error fetching file stats:', error);
        this.processInProgress = false;
        this.progressBarService.hide();
        // this.spinner.hide();

        this.matSnackBar.open("There is Error in Fetching the File Stats", 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }


  updateBackendDoughnutStyle(): void {
    // this.backendDoughnutStyle = {
    //   background: `conic-gradient(
    //   #0d7cbd 0% ${this.automaticConversionPercentageBackend}%,
    //   #ffbd59 ${this.automaticConversionPercentageBackend}% 100%
    // )`
    // };

    const canvas = document.createElement('canvas');
    const size = 300; // Adjust size as needed
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {

      // const gradient = ctx.createConicGradient(-0.5 * Math.PI, size / 2, size / 2);
      // const percentageStop = this.automaticConversionPercentageBackend / 100;

      const clampedPercentage = Math.min(Math.max(this.automaticConversionPercentageBackend, 0), 100);
      const percentageStop = clampedPercentage / 100;

      const gradient = ctx.createConicGradient(-0.5 * Math.PI, size / 2, size / 2); // Adjust for correct start angle

      gradient.addColorStop(0, '#3182CE');
      gradient.addColorStop(percentageStop, '#3182CE');
      gradient.addColorStop(percentageStop, '#ffbd59');
      gradient.addColorStop(1, '#ffbd59');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();

      const gradientImageUrl = canvas.toDataURL();
      this.backendDoughnutStyle = {
        backgroundImage: `url(${gradientImageUrl})`,
        backgroundSize: 'cover',
      };
      const percentage = {
        automatic: this.automaticConversionPercentageBackend,
        manual: this.manualConversionPercentageBackend
      }
      this.conversionReport.setBackendConversion(percentage);
      this.conversionReport.setBackendDoughnutStyle(this.backendDoughnutStyle);
    }
  }

  updateFrontendDoughnutStyle(): void {

    // this.frontendDoughnutStyle = {
    //   background: `conic-gradient(
    //   #0d7cbd 0% ${this.automaticConversionPercentageFrontend}%,
    //   #ffbd59 ${this.automaticConversionPercentageFrontend}% 100%
    // )`
    // };

    const canvas = document.createElement('canvas');
    const size = 300; // Adjust size as needed
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {


      const clampedPercentage = Math.min(Math.max(this.automaticConversionPercentageFrontend, 0), 100);
      const percentageStop = clampedPercentage / 100;

      const gradient = ctx.createConicGradient(-0.5 * Math.PI, size / 2, size / 2); // Adjust for correct start angle

      // const gradient = ctx.createConicGradient(-0.5 * Math.PI, size / 2, size / 2);
      // const percentageStop = this.automaticConversionPercentageFrontend / 100;

      gradient.addColorStop(0, '#3182CE');
      gradient.addColorStop(percentageStop, '#3182CE');
      gradient.addColorStop(percentageStop, '#ffbd59');
      gradient.addColorStop(1, '#ffbd59');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();

      const gradientImageUrl = canvas.toDataURL();
      this.frontendDoughnutStyle = {
        backgroundImage: `url(${gradientImageUrl})`,
        backgroundSize: 'cover',
      };
      const percentage = {
        automatic: this.automaticConversionPercentageFrontend,
        manual: this.manualConversionPercentageFrontend
      }
      this.conversionReport.setFrontendConversion(percentage);
      this.conversionReport.setFrontendDoughnutStyle(this.frontendDoughnutStyle);
    }
  }


  //with table
  downloadPDF(): void {
    this.delaySeconds = 0;
    this.downloadReport = true;
    this.pdfMethod();
  }

  pdfMethod() {
    const element = document.querySelector('.summary') as HTMLElement; // Replace with your desired element selector
    const headerElement = document.querySelector('.header-text') as HTMLElement;
    let cppyElement = cloneDeep(headerElement)
    if (element) {
      // cppyElement.style.color = 'red';
      html2canvas(element, { scale: 2 }).then((canvas) => {
        setTimeout(() => {
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgData = canvas.toDataURL('image/png');
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const margin = 10;
          const headerHeight = 20; // Space for header

          const imgWidth = pageWidth - margin * 2; // Reduce side margins
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Prepare header values
          const logoWidth = 18; // Adjust as needed
          const logoHeight = 13; // Adjust as needed
          const title = "Source Analysis Report";
          const currentDate = new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
          const logoUrl = 'assets/images/logo/logoBlack.png'; // Adjust path accordingly

          // Define a function to add header and footer to every page
          const addHeaderFooter = (doc: jsPDF) => {
            const totalPages = doc.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
              doc.setPage(i);

              // Header
              doc.addImage(logoUrl, 'PNG', margin, 5, logoWidth, logoHeight);
              doc.setFontSize(14);
              const titleWidth = doc.getTextWidth(title);
              doc.text(title, (pageWidth - titleWidth) / 2, 12);

              doc.setFontSize(10);
              doc.text(currentDate, pageWidth - margin, 12, { align: 'right' });

              doc.setDrawColor(0); // Black color
              doc.line(margin, 20, pageWidth - margin, 20); // (x1, y1, x2, y2)

              // Footer
              doc.setFontSize(10);
              doc.text("STG Proprietary & Confidential", pageWidth - margin, pageHeight - 10, { align: 'right' });
              doc.text(`Page ${i} of ${totalPages}`, margin, pageHeight - 10); // Page number on the left
              doc.setDrawColor(0); // Black color
              doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
            }
          };
          // Add the image to PDF
          pdf.addImage(imgData, 'PNG', margin, headerHeight, imgWidth, imgHeight);

          this.addTableView(pdf, imgHeight, margin);
          addHeaderFooter(pdf);

          // Convert PDF to Data URI and Save
          const pdfData = pdf.output('datauristring');

          this.conversionReport.savePdfData(pdfData);
          if (this.downloadReport) {
            pdf.save('struts-conversion-report.pdf');
          }
        }, this.delaySeconds);
      });
    } else {
      console.error('Element not found!');
    }
  }
  addTableView(pdf, imgHeight, margin) {
    pdf.addPage();
    let nextY = 25

    const pageWidth = pdf.internal.pageSize.getWidth(); // Get the PDF page width
    const tableWidth = 150; // Sum of your column widths (e.g., 90 + 40)

    const marginLeft = (pageWidth - tableWidth) / 2;

    pdf.setFontSize(14);
    pdf.text('Backend Analysis Report', margin, 35);
    nextY += 15;

    const headers = [['Extension', 'Conversion Percentage ']];
    const rowsBackend: any[] = [];

    this.backendFileStats.forEach((item) => {
      rowsBackend.push([`${item.extension} (${item.count})`, { content: `${item.percentage}%`, styles: { cellPadding: { left: 15, right: 15, top: 2 } } }]);

      if (item.files.length !== 0) {
        item.files.forEach((file: any) => {
          rowsBackend.push([
            { content: file.fileName, styles: { textColor: [92, 95, 102], fontSize: 9, cellPadding: { left: 5, right: 2, top: 2 } } },
            { content: `${Math.round(file.percentage)}%`, styles: { textColor: [92, 95, 102], fontSize: 8, cellPadding: { left: 15, right: 15, top: 2 } } }
          ]);
        })
      }
    });
    rowsBackend.push([
      { content: 'Automatic Conversion', styles: { fontStyle: 'bold' } },
      { content: `${this.automaticConversionPercentageBackend}%`, styles: { cellPadding: { left: 15, right: 15, top: 2 } } }
    ]);
    rowsBackend.push([
      { content: 'Manual Conversion', styles: { fontStyle: 'bold' } },
      { content: `${this.manualConversionPercentageBackend}%`, styles: { cellPadding: { left: 15, right: 15, top: 2 } } }
    ]);

    autoTable(pdf, {
      head: headers,
      body: rowsBackend,
      startY: nextY + 5, // Below subtitle
      margin: { left: marginLeft, top: 25 },
      columnStyles: {
        0: { cellWidth: 90 }, // Set specific width for the 1st column
        1: { cellWidth: 55 }, // Set specific width for the 2nd column
      },
      tableWidth: 'auto', // Maintain natural table width

    });


    // Update nextY position after Backend Table
    nextY = (pdf as any).lastAutoTable.finalY + 20;

    // **Frontend Table**
    pdf.setFontSize(14);
    pdf.text('Frontend Analysis Report', margin, nextY);
    nextY += 5;

    const rowsFrontend: any[] = [];

    this.frontendFileStats.forEach((item) => {
      rowsFrontend.push([`${item.extension} (${item.count})`, { content: `${item.percentage}%`, styles: { cellPadding: { left: 15, right: 15, top: 2 } } }]);

      if (item.files.length !== 0) {
        item.files.forEach((file: any) => {
          rowsFrontend.push([
            { content: file.fileName, styles: { textColor: [92, 95, 102], fontSize: 9, cellPadding: { left: 5, right: 2, top: 2 } } },
            { content: `${Math.round(file.percentage)}%`, styles: { textColor: [92, 95, 102], fontSize: 8, cellPadding: { left: 15, right: 15, top: 2 } } }
          ]);
        })
      }
    });

    rowsFrontend.push([
      { content: 'Automatic Conversion', styles: { fontStyle: 'bold' } },
      { content: `${this.automaticConversionPercentageFrontend}%`, styles: { cellPadding: { left: 15, right: 15, top: 2 } } }
    ]);
    rowsFrontend.push([
      { content: 'Manual Conversion', styles: { fontStyle: 'bold' } },
      { content: `${this.manualConversionPercentageFrontend}%`, styles: { cellPadding: { left: 15, right: 15, top: 2 } } }
    ]);

    autoTable(pdf, {
      head: headers,
      body: rowsFrontend,
      startY: nextY + 5, // Below subtitle
      margin: { left: marginLeft, top: 25 },
      columnStyles: {
        0: { cellWidth: 90 }, // Set specific width for the 1st column
        1: { cellWidth: 55 }, // Set specific width for the 2nd column

      },
      tableWidth: 'auto', // Maintain natural table width

    });
  }

  analyze() {
    this.showContent = false;
    this.passToParent.emit(false);
    this.checkForProjectDetailsAndPath();
    //this.loadFileStats();
    this.updateConversionMethodInService();
    this.isAnalyzeDisabled = true;
    // this.showConvertButton = true;
    this.sendData();
  }
  sendData() {
    this.selectedAi.emit(this.conversionAiMethod);
  }

  onAiMethodChange() {
    this.isAnalyzeDisabled = false;
    this.downloadReport = false;
    this.delaySeconds = 2000;
    this.conversionReport.setBackendConversion(null);
    this.conversionReport.setBackendDoughnutStyle(null);
    this.conversionReport.setFrontendConversion(null);
    this.conversionReport.setFrontendDoughnutStyle(null);

  }
  onReviewClick() {
    this.reviewClicked.emit();
  }

  onConvertClick() {
    this.convertClicked.emit();
    this.delaySeconds = 2000;
    if (!this.downloadReport) {
      this.pdfMethod();
    } else {
      this.downloadReport = false;
    }
  }

  onSourceDatabaseChange(value: string) {
    this.service.setSourceDatabase(value);
  }

  onTargetDatabaseChange(value: string) {
    this.service.setTargetDatabase(value);
  }
  updateConversionMethodInService(): void {
    console.log('conversionAiMethod passed to service: ', this.conversionAiMethod);
    this.service.setConversionAiMethod(this.conversionAiMethod);
  }

  showSuccess() {
    this.matSnackBar.open('Analyzis Completed!', '✔', {
      duration: 3000, // Auto-close after 3 seconds
      horizontalPosition: 'center', // Center horizontally
      verticalPosition: 'top', // Position at the top
      panelClass: ['success-snackbar'] // Apply custom styles
    });
  }


  //for table view alone

  // generatePdfTableView(): void {
  //   const doc = new jsPDF();

  //   const pageWidth = doc.internal.pageSize.getWidth();

  //   // Load and add logo
  //   const logo = new Image();
  //   logo.src = 'assets/images/logo/LogoBlue.png'; // Adjust the path accordingly

  //   logo.onload = () => {
  //     doc.addImage(logo, 'PNG', 10, 5, 10, 10); // (X=10, Y=5), Width=30mm, Height=15mm

  //     // Add Title in the Center
  //     doc.setFontSize(16);
  //     const title = 'STG Struts Modernization Accelerator';
  //     const titleWidth = doc.getTextWidth(title);
  //     doc.text(title, (pageWidth - titleWidth) / 2, 15);

  //     // Add Date on the Right
  //     const currentDate = new Date().toLocaleDateString();
  //     doc.setFontSize(10);
  //     doc.text(`Date: ${currentDate}`, pageWidth - 40, 15);

  //     // Prepare table headers and rows for Backend
  //     const headers = [['Extension', 'No of files', 'Percentage']];
  //     const rowsBackend = [];
  //     this.backendFileStats.forEach((item) => {
  //       rowsBackend.push([item.extension, item.count, `${item.percentage}%`]);

  //       if (item.extension === 'Actions') {
  //         const actionFiles = [
  //           'ListEmployeeAction',
  //           'MasterDataReportAction',
  //           'HomeAction',
  //           'SearchEmployeeAction',
  //           'BaseDispatchAction',
  //           'BaseAction',
  //           'CreateEmployeeDispatchAction',
  //           'AdminAction',
  //           'ReportsAction',
  //           'DesignationAction',
  //           'DesignationDispatchAction'
  //         ];
  //         actionFiles.forEach((file) => {
  //           rowsBackend.push([{ content: `${file}`, styles: { textColor: [92, 95, 102], fontSize: 9, cellPadding: { left: 5, right: 2 } } }, '', '']); // Set blue color
  //         });
  //       }

  //       if (item.extension === 'Forms') {
  //         const formsFiles = [
  //           'BaseValidatorActionForm',
  //           'CreateEmployeeForm',
  //           'MasterDataForms',
  //           'BaseLazyValidatorForm',
  //           'AdminForms',
  //           'AddDesignationForm',
  //           'SearchEmployeeForm',
  //           'BaseDynaValidatorActionForm',
  //           'ReportsForms'
  //         ];
  //         formsFiles.forEach((file) => {
  //           rowsBackend.push([{ content: `${file}`, styles: { textColor: [92, 95, 102], fontSize: 9, cellPadding: { left: 5, right: 2 } } }, '', '']); // Set blue color
  //         });
  //       }

  //       if (item.extension === 'SQL Transition' || item.extension === 'DAO') {
  //         const sqlAndDaoFiles = [
  //           'UserDao',
  //           'BaseDAO',
  //           'DesignationDAO',
  //           'DAOFactory',
  //           'AdminDao',
  //           'EmployeeDAO',
  //           'MasterDataDAO',
  //           'ReportsDAO',
  //         ];
  //         sqlAndDaoFiles.forEach((file) => {
  //           rowsBackend.push([{ content: `${file}`, styles: { textColor: [92, 95, 102], fontSize: 9, cellPadding: { left: 5, right: 2 } } }, '', '']); // Set blue color
  //         });
  //       }

  //       if (item.extension === 'Service') {
  //         const serviceFiles = [
  //           'AdminServices',
  //           'DesignationServices',
  //           'EmployeeService',
  //           'EmpSoapService',
  //           'UserSoapService',
  //           'MasterDataServices',
  //           'ReportsServices',
  //           'ServiceFactory',
  //         ];
  //         serviceFiles.forEach((file) => {
  //           rowsBackend.push([{ content: `${file}`, styles: { textColor: [92, 95, 102], fontSize: 9, cellPadding: { left: 5, right: 2 } } }, '', '']); // Set blue color
  //         });
  //       }

  //     });

  //     rowsBackend.push([
  //       { content: 'Automatic Conversion', styles: { fontStyle: 'bold' } },
  //       '-',
  //       `${this.automaticConversionPercentageBackend}%`
  //     ]);
  //     rowsBackend.push([
  //       { content: 'Manual Conversion', styles: { fontStyle: 'bold' } },
  //       '-',
  //       `${this.manualConversionPercentageBackend}%`
  //     ]);
  //     // Add Backend Table
  //     autoTable(doc, {
  //       head: headers,
  //       body: rowsBackend,
  //       startY: 25, // Start position after header
  //     });

  //     // Calculate next position
  //     const nextY = (doc as any).lastAutoTable.finalY + 20;

  //     // Add Subtitle for Frontend Data
  //     doc.setFontSize(16);
  //     doc.text('Angular Conversion Report', 14, nextY);

  //     // Prepare table headers and rows for Frontend

  //     const rowsFrontend = [];
  //     this.frontendFileStats.forEach((item) => {
  //       rowsFrontend.push([item.extension, item.count, `${item.percentage}%`]);

  //       if (item.extension === 'Html') {
  //         const htmlFiles = [
  //           'EmployeeWeb_addDesignation',
  //           'EmployeeWeb_createEmployee',
  //           'EmployeeWeb_home',
  //           'EmployeeWeb_listEmployee',
  //           'EmployeeWeb_reportEmployee',
  //           'EmployeeWeb_searchEmployee',

  //         ];
  //         htmlFiles.forEach((file) => {
  //           rowsFrontend.push([{ content: `${file}`, styles: { textColor: [92, 95, 102], fontSize: 9, cellPadding: { left: 5, right: 2 } } }, '', '']); // Set blue color
  //         });
  //       }
  //     });

  //     rowsFrontend.push([
  //       { content: 'Automatic Conversion', styles: { fontStyle: 'bold' } },
  //       '-',
  //       `${this.automaticConversionPercentageFrontend}%`
  //     ]);
  //     rowsFrontend.push([
  //       { content: 'Manual Conversion', styles: { fontStyle: 'bold' } },
  //       '-',
  //       `${this.manualConversionPercentageFrontend}%`
  //     ]);
  //     // Add Frontend Table
  //     autoTable(doc, {
  //       head: headers,
  //       body: rowsFrontend,
  //       startY: nextY + 10, // Below subtitle
  //     });

  //     // Save the PDF
  //     doc.save('struts-conversion-report.pdf');
  //   };

  //   logo.onerror = () => {
  //     console.error('Logo failed to load. Ensure the file path is correct.');
  //   };
  // }
}
