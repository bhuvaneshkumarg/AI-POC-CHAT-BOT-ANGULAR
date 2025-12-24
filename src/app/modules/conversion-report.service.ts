import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConversionReportService {
  private pdfData: string | null = null;
  private backendStyle: any | null = null;
  private frontendStyle: any | null = null;
  private backendConversion: any;
  private frontendConversion: any;
  savePdfData(data: string): void {
    this.pdfData = data;
  }

  getPdfData(): string | null {
    return this.pdfData;
  }

  clearPdfData(): void {
    this.pdfData = null; // Clear after download if needed
  }
  setBackendDoughnutStyle(style: any): void {
    this.backendStyle = style;
  }
  getBackendDoughnutStyle(): any | null {
    return this.backendStyle;
  }
  setFrontendDoughnutStyle(style: any): void {
    this.frontendStyle = style;
  }
  getFrontendDoughnutStyle(): any | null {
    return this.frontendStyle;
  }
  setBackendConversion(percentage: any): void {
    this.backendConversion = percentage
  }
  getBackendConversion(): any | null {
    return this.backendConversion;
  }
  setFrontendConversion(percentage: any): void {
    this.frontendConversion = percentage
  }
  getFrontendConversion(): any | null {
    return this.frontendConversion;
  }
}
