
export class ResponseDto{

    message:String;
    configName:String;
    status:boolean;
}

export class PropertiesDTO{

    projectId:String;
    bucketName:String;
    instanceZone:String;
    instanceName:String;
    datasetName:String;
    databaseName:String;
    serviceAccountName:String;
    host:String;
    port:Number;
    projectNumber:String;
    tableNamePattern:String;
    validationDatasetName:String;
    dataTransferJobConfigName:String;
    deleteItemsListGcp:String;


}


export class HadoopPropertiesDTO{

    hadoopGcpProjectId:String;
    hadoopGcpBucketName:String;
    hadoopGcpDatasetName:String;
    hadoopGcpValidationDatasetName:String;
    hadoopGcpServiceAccountName:String;
    hadoopGcpProjectNumber:String;
}

export class RDBMSDTO{
    rdbmsProjectId:String;
    rdbmsGcpBucketName:String;
    rdbmsGcpServiceAccountName:String;
    rdbmsGcpProjectNumber:String;
    rdbmsInstanceTemplateName:String;
    rdbmsInstanceTemplateZone:String;
    rdbmsLevelName:String;
    rdbmsVMzone:String;
    rdbmsVMInstanceName:String;
}

export class RDBMSReloadDTO{
    rdbmsProjectId:String;
    rdbmsGcpBucketName:String;
    rdbmsGcpServiceAccountName:String;
    rdbmsGcpProjectNumber:String;
    rdbmsInstanceTemplateName:String;
    rdbmsInstanceTemplateZone:String;
    rdbmsLevelName:String;
    rdbmsTableNames:String[]=[];
}

export class loadStatusDto{
    rdbmsJobProjectID:String;
    rdbmsJobName:String;
    rdbmsJobInstanceTemplateZone:String
}

export class multipleDatabasesHadoopResponse{
    responseOfMultipleHadoop: ResponseDto[]
}

export class rdbmsDataLoadDto{
    levelName:String;
    tableName:String;
    status:boolean;
    statusName:String;
    description:String;
    jobId:String;
    jobName:String;
}

export class rdbmsDeleteResponseDto{
    bucketResponse:ResponseDto;
    templateRsponse:ResponseDto;
    vmResponse:ResponseDto;
    batchJobsRespons:ResponseDto[];
}

export class GitRequest{
    url:string;
    username:string;
    password:string;
    branch:string;
    conversionAiMethod:string[];
}
