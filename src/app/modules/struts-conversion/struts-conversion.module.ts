import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversionDashboardComponent } from './conversion-dashboard/conversion-dashboard.component';
import { Route, RouterModule } from '@angular/router';
import { InitialDataResolver } from 'app/app.resolvers';
import { LayoutComponent } from 'app/layout/layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileStructureComponent } from "../file-structure/file-structure.component";
import { MatTreeModule } from "@angular/material/tree";
import { MatStepperModule } from "@angular/material/stepper";
import { FileStandardizationComponent } from './file-standardization/file-standardization.component';
import { FileTransferComponent } from './file-transfer/file-transfer.component';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ConversionDashboardV1Component } from './conversion-dashboard-v1/conversion-dashboard-v1.component';
import { FileCountStandardizationComponent } from './file-count-standardization/file-count-standardization.component';
import { GitLoginComponent } from './git-login/git-login.component';
import { SourceCodeConversionPageComponent } from './source-code-conversion-page/source-code-conversion-page.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileNamePipe } from './file-name.pipe';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {FuseAlertModule} from "../../../@fuse/components/alert";
import { ConversionHomeComponent } from './conversion-home/conversion-home.component';
import {MatRadioModule} from '@angular/material/radio';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import {ProgressBarModule} from 'primeng/progressbar';
import { CheckboxModule } from 'primeng/checkbox';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ModernizedProjectStructureComponent } from './modernized-project-structure/modernized-project-structure.component';
import { FileContentDialogComponent } from './file-content-dialog/file-content-dialog.component';
import { ToasterComponent } from './toaster/toaster.component';
const dashboardRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    resolve: {
      initialData: InitialDataResolver,
    },
    children: [
      { path: 'chatbotdashboard', component: ConversionDashboardComponent },
      { path: '', pathMatch: 'full', redirectTo: '/home' },
      { path: 'home',component: ConversionHomeComponent },
      { path: 'filepath', component: FileStructureComponent },
      
    ]
  }
];

@NgModule({
  declarations: [ConversionDashboardComponent, 
            FileStructureComponent, 
            FileStandardizationComponent, 
            FileTransferComponent, 
            ConversionDashboardV1Component, 
            FileCountStandardizationComponent, 
            GitLoginComponent, 
            SourceCodeConversionPageComponent, 
            FileNamePipe, 
            ConversionHomeComponent,
          ProgressBarComponent,
          ModernizedProjectStructureComponent,
          FileContentDialogComponent,
          ToasterComponent,
          ],
  imports: [
    RouterModule.forChild(dashboardRoutes),
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule,
    MatTooltipModule,
    MatSortModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTreeModule, MatStepperModule, MatCheckboxModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule,
    MatProgressBarModule,MatProgressSpinnerModule,
    MatButtonToggleModule,
    FuseAlertModule,
    MatTooltipModule,
    MatRadioModule,
    ProgressBarModule,
    CheckboxModule
  ],
  providers:[{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}}]
})
export class StrutsConversionModule { }
