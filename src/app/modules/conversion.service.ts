import { EventEmitter, Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpEventType, HttpParams } from "@angular/common/http";
import { BehaviorSubject, catchError, concatMap, map, Observable, of, OperatorFunction, tap, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { GitRequest } from "./struts-conversion/reponse-from-backend";
export interface FileNode {
  name: string;
  isFile: boolean;
  children: FileNode[];
}
@Injectable({
  providedIn: 'root'
})
export class ConversionService {
  // private eventSource: EventSource | undefined;
  // public stepUpdates: EventEmitter<any> = new EventEmitter();
  //
  // constructor() {}
  //
  // public startSseStream(): void {
  //   this.eventSource = new EventSource('http://localhost:9090/covert/stream');
  //   console.log(this.eventSource)
  //   this.eventSource.onmessage = (event: MessageEvent) => {
  //     console.log(event)
  //     try {
  //       console.log(event)
  //       const data = JSON.parse(event.data);
  //
  //       this.stepUpdates.emit(data);
  //     } catch (error) {
  //       console.error('Error parsing event data:', error);
  //     }
  //   };
  //
  //   // Handle errors
  //   // this.eventSource.onerror = (err) => {
  //   //   console.error('EventSource failed:', err);
  //   //   if (this.eventSource) {
  //   //     this.eventSource.close();
  //   //   }
  //   // };
  // }
  //
  // public closeConnection(): void {
  //   if (this.eventSource) {
  //     this.eventSource.close();
  //   }
  // }
  private conversionDataSubject = new BehaviorSubject<any>(null);
  private ngconversionDataSubj = new BehaviorSubject<any>(null);

  private sourceDatabaseSubject = new BehaviorSubject<string | null>(null);
  private targetDatabaseSubject = new BehaviorSubject<string | null>(null);

  sourceDatabase$ = this.sourceDatabaseSubject.asObservable();
  targetDatabase$ = this.targetDatabaseSubject.asObservable();
  
  data: any
  private aiOptions: string = '';
  setData(value: any): void {
    console.log(value);

    this.data = value;
  }

  // Method to get the data
  getData(): any {
    console.log(this.data);

    return this.data;
  }

  private eventSource: EventSource | null = null;
  private ngEventSource: EventSource | null = null;
  // private apiUrl: string="http://localhost:8085/";
  private apiUrl = environment.modernizationURL;
  private partialUrl = environment.partialUrl;
  private htmlToAngularUrl = environment.htmlToAngularURL;
  constructor(private httpClient: HttpClient) { }
  listFiles(directoryPath: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}list`, {
      params: { directoryPath },
    });
  }

  pushChangesWithPath(directoryPath: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}pushChangesWithPath`, {
      params: { localPath: directoryPath },
    });
  }


  // cloneGit(gitUrl: string): Observable<any> {
  //   return this.httpClient.post<any>(`${this.apiUrl}cloneGit`, {url:gitUrl
  //   });
  // }
  cloneRepository(gitRequest: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}cloneFrmGit`,
      gitRequest);
  }

  cloneAndCreateDestRepoBranch(gitRequest: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}cloneAndCreateDestRepoBranch`,
      gitRequest);
  }

  cloneAndCreateDestAngularRepoBranch(gitRequest: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}cloneAndCreateDestAngularRepoBranch`,
      gitRequest);
  }
  setDestinationPath(request: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.partialUrl}covert/setDestinationPath`, request);
  }

  checkForProjectDetailsAndPath(request: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.partialUrl}covert/checkForProjectDetailsAndPath`, request);
  }
  
  updateFiles(formData: any): Observable<any> {
    const encodedSourcePath = encodeURIComponent(formData.sourcePath);
    return this.httpClient.put<any>(`${this.apiUrl}upload?sourcePath=${encodedSourcePath}`, formData.fileNodes);
  }

  setConversionAiMethod(method: string): void {
    this.aiOptions = method;
  }

  getConversionAiMethod(): string {
    return this.aiOptions;
  }

  connect(): EventSource {
    this.eventSource = new EventSource(`${this.partialUrl}covert/stream`);
    return this.eventSource;
  }
  connectToSpringbootConvert(aiOption:string, dataSrc: string): EventSource {
    this.eventSource = new EventSource(`${this.partialUrl}covert/stream/`+aiOption+'/'+dataSrc);
    return this.eventSource;
  }

  connectToAngularConvert(sourcePath:string): EventSource {
    const encodedSourcePath = encodeURIComponent(sourcePath);
    this.ngEventSource = new EventSource(`${this.htmlToAngularUrl}covert/stream?sourcePath=${encodedSourcePath}`);
    return this.ngEventSource;
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  getFileStats(requestBody:any): Observable<any> {
    return this.httpClient.post<any>(`${this.partialUrl}covert/analyze`,requestBody);
  }

  getHTMLFileStats(requestBody:any):Observable<any>{
    return this.httpClient.post<any>(`${this.htmlToAngularUrl}angular/analyze`,requestBody);
  }

  getProjectFolderStructure(localFolderPath:string){
    const params = new HttpParams().set('directoryPath', localFolderPath);
    return this.httpClient.get<any>(`${this.apiUrl}list`, { params });
    
  }
  getConversionData() {
    return this.conversionDataSubject.asObservable();
  }

  // Setter to update the data
  setConversionData(data: any) {
    this.conversionDataSubject.next(data); // Emits the new value to all subscribers
  }
  getNgConversionData() {
    return this.ngconversionDataSubj.asObservable();
  }

  // Setter to update the data
  setNgConversionData(data: any) {
    this.ngconversionDataSubj.next(data); // Emits the new value to all subscribers
  }

  setSourceDatabase(dbKey: string) {
    this.sourceDatabaseSubject.next(dbKey);
  }

  setTargetDatabase(dbKey: string) {
    this.targetDatabaseSubject.next(dbKey);
  }

  clonedDirFileContent(base: string, clonedFilePath: string) {
    const params = new HttpParams()
      .set('base', base)
      .set('filePath', clonedFilePath);
  
    return this.httpClient.get<string>(`${this.apiUrl}readFileContent`, { params, responseType: 'text' as 'json' });
  } 

}
