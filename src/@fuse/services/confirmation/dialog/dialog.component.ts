import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseConfirmationConfig } from '@fuse/services/confirmation/confirmation.types';

@Component({
    selector     : 'fuse-confirmation-dialog',
    templateUrl  : './dialog.component.html',
    styles       : [
        `
            .fuse-confirmation-dialog-panel {
                @screen md {
                    @apply w-128;
                }

                .mat-dialog-container {
                    padding: 0 !important;
                    // width: 600px !important;
                    // max-width: 600px !important;
                    // height: 400px !important;
					// overflow-y: auto; 
					// white-space: pre-wrap;
                }
            }
        `
    ],
    encapsulation: ViewEncapsulation.None
})
export class FuseConfirmationDialogComponent
{
    /**
     * Constructor
     */
    constructor(@Inject(MAT_DIALOG_DATA) public data: FuseConfirmationConfig)
    {
    }

}
