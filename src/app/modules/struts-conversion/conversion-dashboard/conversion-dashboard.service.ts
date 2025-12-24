import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { PropertiesDTO, ResponseDto, HadoopPropertiesDTO, RDBMSDTO, rdbmsDataLoadDto, loadStatusDto, RDBMSReloadDTO, rdbmsDeleteResponseDto } from '../reponse-from-backend';

@Injectable({
  providedIn: 'root'
})
export class ConversionDashboardService {

  createOperationResponse: BehaviorSubject<PropertiesDTO | null> =
  new BehaviorSubject(null);

get createOperationResponse$(): Observable<any> {
  return this.createOperationResponse.asObservable();
}
setResponse(newResponse: PropertiesDTO) {
  return this.createOperationResponse.next(newResponse);
}

private baseURL = environment.baseURL;
private batchBaseURL = environment.batchBaseURL;

constructor(private _httpClient: HttpClient) {}

runCreateJob(Properties: PropertiesDTO): Observable<ResponseDto> {
  return this._httpClient.post<ResponseDto>(
    `${this.baseURL}/create`,
    Properties
  );
}

deleteJob(Properties: PropertiesDTO): Observable<ResponseDto[]> {
  return this._httpClient.post<ResponseDto[]>(
    `${this.baseURL}/delete`,
    Properties
  );
}

IncrementalJob(config:ResponseDto): Observable<ResponseDto> {
  return this._httpClient.post<ResponseDto>(
    `${this.baseURL}/incrementalTransferRun`,
    config
  );
}
runHadoopInitialJob(properties: HadoopPropertiesDTO): Observable<ResponseDto[]> {
  return this._httpClient.post<ResponseDto[]>(
    `${this.baseURL}/hadoopInitialTransfer`,
    properties
  );
}



runLoadData(properties: HadoopPropertiesDTO):Observable<ResponseDto[]>{
  return this._httpClient.post<ResponseDto[]>(
    `${this.baseURL}/hadoopLoadData`,
    properties
    );
}

runIncrementLoadData(properties: HadoopPropertiesDTO):Observable<ResponseDto[]>{
  return this._httpClient.post<ResponseDto[]>(
    `${this.baseURL}/hadoopIncrementLoadData`,
    properties
    );
}

runHadoopDelete(deleteProperties:HadoopPropertiesDTO):Observable<ResponseDto[]>{
  return this._httpClient.post<ResponseDto[]>(
    `${this.baseURL}/hadoopDelete`,
    deleteProperties
    );
}

runGenerateDatasetsNames(hadoopDto:HadoopPropertiesDTO):Observable<ResponseDto[]>{
  return this._httpClient.post<ResponseDto[]>(
    `${this.baseURL}/databaseList`,
    hadoopDto
    );
}

runCreateDatasets(hadoopDto:HadoopPropertiesDTO):Observable<ResponseDto[]>{
  return this._httpClient.post<ResponseDto[]>(
    `${this.baseURL}/createDatasets`,
    hadoopDto
    );
}

rdbmsProvisionResource(properties: RDBMSDTO): Observable<ResponseDto> {
  return this._httpClient.post<ResponseDto>(
    `${this.batchBaseURL}/batchProvisionResource`,
    properties
  );
}

validateBatchTables(properties: RDBMSDTO):Observable<rdbmsDataLoadDto[]>{
  return this._httpClient.post<rdbmsDataLoadDto[]>(
    `${this.batchBaseURL}/validation`,
    properties
  );
}

loadDataJob(properties: RDBMSDTO):Observable<rdbmsDataLoadDto[]>{
  return this._httpClient.post<rdbmsDataLoadDto[]>(
    `${this.batchBaseURL}/loadData`,
    properties
  );
}

getLoadStatus(properties: loadStatusDto[]):Observable<rdbmsDataLoadDto[]>{
  return this._httpClient.post<rdbmsDataLoadDto[]>(
    `${this.batchBaseURL}/jobList`,
    properties
  );
}

reloadJObs(properties: RDBMSReloadDTO):Observable<rdbmsDataLoadDto[]>{
  return this._httpClient.post<rdbmsDataLoadDto[]>(
    `${this.batchBaseURL}/reloadJobs`,
    properties
  );
}

deleteRdbmsResources(properties: RDBMSDTO):Observable<rdbmsDeleteResponseDto>{
  return this._httpClient.post<rdbmsDeleteResponseDto>(
    `${this.batchBaseURL}/deleteRdbmsResources`,
    properties
  );
}
}
