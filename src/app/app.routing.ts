import { Route } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { ConversionDashboardComponent } from './modules/struts-conversion/conversion-dashboard/conversion-dashboard.component';
import {FileStructureComponent} from "./modules/file-structure/file-structure.component";
import {
    ConversionDashboardV1Component
} from "./modules/struts-conversion/conversion-dashboard-v1/conversion-dashboard-v1.component";
// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: '/create' },
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: '/create' },
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: '', component: ConversionDashboardComponent },
            { path: 'chatbotdashboard', component: ConversionDashboardComponent },
            { path: 'chatbotdashboard1', component: ConversionDashboardV1Component },
        ]
    }

];
