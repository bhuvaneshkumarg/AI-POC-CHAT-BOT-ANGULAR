export const environment = {
    production: true,
    baseURL : 'http://localhost:9090/gcp',
    modernizationURL : 'http://localhost:8085/',
    htmlToAngularURL: 'http://localhost:9091/',
    batchBaseURL : 'http://localhost:9090/rdbmsBatch',
    partialUrl : 'http://localhost:9090/'
};
export const hadoopEnvironmentNames: any = {
    
    // initial 

    hadoopInitialProcessSummaryColumnsTask:'Task',
    hadoopInitialProcessSummaryColumnsDatabase:'Database Name',
    hadoopInitialProcessSummaryColumnsTable:'Table Name',
    hadoopInitialProcessSummaryColumnsStatus:'Status',
    
    hadoopInitialProcessStatusComplete:'Completed',
    hadoopInitialProcessStatusError:'Error',
    hadoopInitialProcessStatusNotstarted:'Not Started',
    hadoopInitialProcessStatusInProgress:'In Progress',

    hadoopWindoInitial:'Hadoop - Initial Data Transfer provision Resource',
    hadoopWindowInitialSetup:'Hadoop - initial Transfer job Resource setup',
    hadoopWindowIncremental:'Hadoop - Incremental Data Transfer',
    hadoopWindowDelete:'Hadoop - Delete Provision Resources',
    hadoopWindowCreateAndGenarateDatasets:'Genarate Datasets Names and Create Datasets for Hadoop',
    hadoopWindowInitialTransfer:'Hadoop - Initial Transfer job Load Data',

    hadoopInitialButtonProvisionResource:'Provision Resource',
    hadoopInitialButtonGenarateDataset:'Genarate Dataset Names',
    hadoopInitialButtonProvisionDataset:'Provision Dataset',
    hadoopInitialButtonLoaddata:'Load Data',

    hadoopInitialInputMatLabelProject:'Project Id',
    hadoopInitialInputMatLabelBucket:'Bucket Name',
    hadoopInitialInputMatLabelGcpDatasetNames:'Dataset Names',
    hadoopInitialInputMatLabelServiceAccount:'Service Account Name ',
    hadoopInitialInputMatLabelProjectNumber:'Project Number',
    hadoopInitialInputMatLabelValidationDataset:'validation Dataset Name',

    hadoopInitialProcessSummeryProvision:'Process Summary',
    hadoopInitialProcessSummeryCreateResources:'Create Datasets Process Summary',
    hadoopInitialProcessSummeryLoadData:'Load Data Process Summary',

    hadoopInitialProcessTaskBucket:'Create GCS Storage Bucket',
    hadoopInitialProcessTaskTableWithJsonSchema:'create Table With Json Schema',
    hadoopInitialProcessTaskresultsSchema:'Upload results_schema file',

    hadoopInitialDatasetsError:'modify the names of the datasets only but not add any extra dataset name',
    // incremental

    hadoopwindowIncrementalMainhead:'Hadoop - Incremental Data Transfer',
    hadoopwindowIncrementalsubhead:'Hadoop - Incremental Transfer job Load Data',

    hadoopIncrementalInputMatLabelProject:'Project Id',
    hadoopIncrementalInputMatLabelBucket:'Bucket Name',
    hadoopIncrementalInputMatLabelGcpDatasetNames:'GCP Dataset Names',
   
    hadoopIncrementalButtonLoaddata:'Load Data',
    hadoopIncrementalProcessSummeryLoadData:'Load Data Process Summary',
    hadoopIncrementalProcessSummaryColumnsDatabase:'Database Name',
    hadoopIncrementalProcessSummaryColumnsTable:'Table Name',
    hadoopIncrementalProcessSummaryColumnsStatus:'Status',

    hadoopIncrementalProcessStatusComplete:'Completed',
    hadoopIncrementalProcessStatusError:'Error',
    hadoopIncrementalProcessStatusNotstarted:'Not Started',
    hadoopIncrementalProcessStatusInProgress:'In Progress',

    // delete
    hadoopwindowDeleteMainhead:'Hadoop - Delete Provision Resources',
    hadoopwindowDeletesubhead:'Delete Resources',

    hadoopDeleteInputMatLabelProject:'Project Id',
    hadoopDeleteInputMatLabelBucket:'Bucket Name',
    hadoopDeleteButton:'Run',
    hadoopDeleteProcessSummeryLoadData:'Process Summary',
    hadoopDeleteProcessSummaryColumnsTask:'Task',
    hadoopDeleteProcessSummaryColumnsStatus:'Status',

    hadoopDeleteProcessStatusComplete:'Completed',
    hadoopDeleteProcessStatusError:'Error',
    hadoopDeleteProcessStatusNotstarted:'Not Started',
    hadoopDeleteProcessStatusInProgress:'In Progress',
};
export const teradataEnvironmentNames ={

    // initial 

    teradataProcessSummaryColumnsTask:'Task',
    teradataProcessSummaryColumnsStatus:'Status',
    
    teradataInitialProcessStatusComplete:'Completed',
    teradataInitialProcessStatusError:'Error',
    teradataInitialProcessStatusNotstarted:'Not Started',
    teradataInitialProcessStatusInProgress:'In Progress',
 

    teradataWindowInitial:'Teradata - Initial Data Transfer',
    teradataInitilaSetup:'Initial Data Transfer',
    teradataInitialButton:'Run',
    teradataInitialProcessSummery:'Process Summary',
   
    teradataInitialInputMatLabelProject:'Project Id',
    teradataInitialInputMatLabelBucket:'Bucket Name',
    teradataInitialInputMatLabelVMInstanceZone:'VM Instance Zone',
    teradataInitialInputMatLabelVMInstanceZoneOptionOne:'us-central1-a',
    teradataInitialInputMatLabelTransferConfigName:'Data Transfer Config Name',
    teradataInitialInputMatLabelVMName:'VM Instance Name',
    teradataInitialInputMatLabelVMNamePatteran:'[a-z][-a-z0-9]{0,61}[a-z0-9]',
    teradataInitialInputMatLabelDatabaseName:'Teradata Database Name',
    teradataInitialInputMatLabelGcpDataset:'Gcp Dataset Name',
    teradataInitialInputMatLabelServiceAccount:'Service Account Name ',
    teradataInitialInputMatLabelHost:'Teradata Host',
    teradataInitialInputMatLabelPort:'Teradata port',
    teradataInitialInputMatLabelProjectNumber:'Project Number',
    teradataInitialInputMatLabelTablePatterna:'Table name Patterns',
    teradataInitialInputMatLabelValidationDataset:'validation Dataset Name',
    teradataInitialInputMatLabelTeradataTransferJobName:'teradata Bq Transfer Job Name ',
    
    teradataInitialProcessTaskBucket:'Create GCS Storage Bucket',
    teradataInitialProcessTaskJdbcDriver:'Upload teradata JDBC driver',
    teradataInitialProcessTaskTransferMigrationAgent:'Upload MigrationAgent driver',
    teradataInitialProcessTaskStartupScript:'Upload StartupScript file',
    teradataInitialProcessTaskDbCredentials:'Upload DbCredentials file',
    teradataInitialProcessTaskStartBqAgent:'Upload StartBqAgent file',
    teradataInitialProcessTaskTransferAgentVM:'Create Transfer Agent (TA) VM ',
    teradataInitialProcessTaskAddSshKey:'AddSsh Key To Instance',
    teradataInitialProcessTaskBigQueryDataset:'Create BigQuery (BQ)Dataset',
    teradataInitialProcessTaskBGDataTransfer:'Create BG Data Transfer',
    teradataInitialProcessTaskConfigFile:'Upload config file',
    teradataInitialProcessTaskTableWithJsonSchema:'create Table With Json Schema',
    teradataInitialProcessTaskresultsSchema:'Upload results_schema file',
    
   
    
    // incremental

    teradataIncrementalProcessSummaryColumnsTask:'Task',
    teradataIncrementalProcessSummaryColumnsStatus:'Status',

    teradataIncrementalProcessStatusComplete:'Completed',
    teradataIncrementalProcessStatusError:'Error',
    teradataIncrementalProcessStatusInProgress:'In Progress',
    teradataIncrementalProcessStatusNotstarted:'Not Started',

   
    teradataWindowIncremental:'Teradata - Incremental Data Transfer',
    teradataIncrementalInputMatLabelConfig:'Config Name',
    teradataIncrementalSetup:'Incremental Data Transfer',
    teradataIncrementalProcessSummery:'Process Summary',
    teradataIncrementalProcessTask:'Create Incremental Transfer Run',
    teradataIncrementalButton:'Run',

    // delete 

    teradataDeleteProcessSummaryColumnsTask:'Task',
    teradataDeleteProcessSummaryColumnsStatus:'Status',

    teradataDeleteProcessStatusComplete:'Completed',
    teradataDeleteProcessStatusError:'Error',
    teradataDeleteProcessStatusInProgress:'In Progress',
    teradataDeleteProcessStatusNotstarted:'Not Started',

    teradataWindowDelete:'Teradata - Delete Resources',
    teradataDeleteInputs:'Delete Resources',

    teradataDeleteProcessTaskBucket:'Delete Storage Bucket',
    teradataDeleteProcessTaskVM:'Delete VM Instance',
    teradataDeleteProcessTaskTransferJob:'Delete Data Transfer Job',
    teradataDeleteInputMatLabelVMInstanceZoneOptionOne:'us-central1-a',
    
    teradataDeleteInputMatLabelProject:'Project Id ',
    teradataDeleteInputMatLabelBucket:'Bucket Name',
    teradataDeleteInputMatLabelVMInstanceZone:'VM Instance Zone',
    teradataDeleteInputMatLabelTransferConfigName:'Data Transfer Config Name',
    teradataDeleteInputMatLabelVMName:'VM Instance Name',

    teradataDeleteButton:'Run',
    teradataDeleteProcessSummery:'Process Summary',
    // teradataDeleteProcessTaskBucket:'Create GCS Storage Bucket',
    // teradataDeleteProcessTaskJdbcDriver:'Upload teradata JDBC driver',
    // teradataDeleteProcessTaskTransferMigrationAgent:'Upload MigrationAgent driver',
    // teradataDeleteProcessTaskStartupScript:'Upload StartupScript file',
    // teradataDeleteProcessTaskDbCredentials:'Upload DbCredentials file',
    // teradataDeleteProcessTaskStartBqAgent:'Upload StartBqAgent file',
}

// Translate SQL 

export const sqlTranslate ={

    sqlTranslateInputMatLabelProject:'Project Id ',
    sqlTranslateInputMatLabelBucket:'Bucket Name',
    sqlTranslateInputMatLabelVMInstanceZone:'Translation Source Dialect',
    sqlTranslateInputMatLabelVMInstanceZoneOption1:'Teradata Dialect',
    sqlTranslateInputMatLabelVMInstanceZoneOption2:'Apache Hive HQL',
  

    sqlTranslateWindoMainHead:'SQL Translation - Translate job',
    sqlTranslateWindowSubHead:'Translate Job',
    sqlTranslateWindowFileUpload:'Text File Uploads*',
    sqlTranslateWindowDragAndDrop:'Drag and Drop Txt Files Here',
    sqlTranslateWindowOr:'Or',
    sqlTranslateWindowNote:'*Note: Please upload only Txt files',

    sqlTranslateButtonUpload:'Upload',
    sqlTranslateButtonReset:'Reset',
    sqlTranslateButtonBrowseFile:'Browse for file',
    sqlTranslateButtonTranslate:'Translate',

    sqlTranslateProcessSummaryColumnsStatus:'Status',
    sqlTranslateProcessStatusComplete:'Completed',
}
export const rdbmsDataloaderNames = {
    rdbmsInstanceTemplateName:'Instance Template Name',
    rdbmsInstanceTemplateZone:'Instance Template Zone',
    rdbmsInstanceTemplateZoneOptionOne:'us-central1-a',
} 