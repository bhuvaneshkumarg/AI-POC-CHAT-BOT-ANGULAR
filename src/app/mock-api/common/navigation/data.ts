/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
        
    }
];
export const compactNavigation1: FuseNavigationItem[] = [
    {
        id : 'struts',
        title : 'Struts',
        subtitle: 'Struts',
        type : 'aside',
        icon : 'heroicons_outline:currency-bangladeshi',
        children: [
            {
                id   : 'chatbotdashboard',
                title: 'Conversion Dashboard',
                type : 'basic',
                icon : 'heroicons_outline:database',
                link : '/chatbotdashboard'
            },
            {
                id   : 'chatbotdashboard1',
                title: 'Conversion Dashboard',
                type : 'basic',
                icon : 'heroicons_outline:database',
                link : '/chatbotdashboard1'
            },
            {
                id   : 'strutsModernDashboard',
                title: 'Struts Modernization Dashboard',
                type : 'basic',
                icon : 'heroicons_outline:database',
                link : '/strutsModernDashboard'
            }
    ]
    },
    
    {

        id : 'teradata',
        
        title : 'Teradata',
        
        subtitle: 'Unique dashboard designs',
        
        type : 'aside',
        
        icon : 'heroicons_outline:currency-bangladeshi',
        
        children: [
        
            {
                id   : 'create',
                title: 'Initial Data Transfer',
                type : 'basic',
                icon : 'heroicons_outline:database',
                link : '/create'
            },
            {
                id   : 'incrementalTransfer',
                title: 'Incremental Data Transfer',
                type : 'basic',
                icon : 'heroicons_outline:trending-up',
                link : '/incrementalTransfer'
            },
            {
                id   : 'delete',
                title: 'Delete Resources',
                type : 'basic',
                icon : 'heroicons_outline:trash',
                link : '/delete'
            },
    ]
    },
    {

        id : 'hadoop',
        
        title : 'Hadoop',
        
        subtitle: 'Unique dashboard designs',
        
        type : 'aside',
        
        icon : 'heroicons_outline:cloud',

        
        children: [
            {
                id   : 'hadoopInitial',
                title: 'Initial Data Transfer [Hadoop]',
                type : 'basic',
                icon : 'heroicons_outline:database',
                link : '/hadoopInitial'
            },
            {
                id   : 'hadoopIncremental',
                title: 'Incremental Data Transfer [Hadoop]',
                type : 'basic',
                icon : 'heroicons_outline:trending-up',
                link : '/hadoopIncremental'
            },
            {
                id   : 'hadoopDelete',
                title: 'Delete Resources [Hadoop]',
                type : 'basic',
                icon : 'heroicons_outline:trash',
                link : '/hadoopDelete'
            }
        ]
    },
    {
        id   : 'translate',
        title: 'Translate SQL',
        type : 'basic',
        icon : 'heroicons_outline:cube',
        link : '/translate'
    },
    // {
    //     id   : 'dataLoader',
    //     title: 'RDBMS Data Loader',
    //     type : 'basic',
    //     icon : 'heroicons_outline:collection',
    //     link : '/dataLoader'
    // },
    {

        id : 'rdbmsDataloader',
        
        title : 'RDBMS Data Loader',
        
        subtitle: 'Unique dashboard designs',
        
        type : 'aside',
        
        icon : 'heroicons_outline:collection',
        children: [
            {
                id   : 'dataLoader',
                title: 'RDBMS Data Loader',
                type : 'basic',
                icon : 'heroicons_outline:database',
                link : '/dataLoader'
            },
            {
                id   : 'dataLoaderDelete',
                title: 'Delete Resources [RDBMS]',
                type : 'basic',
                icon : 'heroicons_outline:trash',
                link : '/dataLoaderDelete'
            }
        ]
    }

   
];


export const compactNavigation: FuseNavigationItem[] = [
    
    {
        id : 'struts',
        title : 'Home',
        subtitle: 'Home',
        type : 'basic',
        icon : 'heroicons_outline:home',
        link : '/home',
    //     children: [
    //         {
    //             id   : 'conversionDashboard1',
    //             title: 'Conversion Dashboard V1',
    //             type : 'basic',
    //             icon : 'heroicons_outline:database',
    //             link : '/conversionDashboard1'
    //         },
    //          {
    //             id   : 'conversionDashboard',
    //             title: 'Conversion Dashboard V2',
    //             type : 'basic',
    //             icon : 'heroicons_outline:database',
    //             link : '/conversionDashboard'
    //         },

    //         {
    //             id   : 'strutsModernDashboard',
    //             title: 'Struts Modernization Dashboard',
    //             type : 'basic',
    //             icon : 'heroicons_outline:database',
    //             link : '/strutsModernDashboard'
    //         }
    // ]
    }
];

export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'group',
        icon : 'heroicons_outline:home',
        link : '/example'
    }
];
