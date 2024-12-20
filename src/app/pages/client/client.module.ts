import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientListingComponent } from './client-listing/client-listing.component';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalsModule } from 'src/app/_metronic/partials';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ClientListingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ClientListingComponent,
      }
    ]),
    InlineSVGModule,
    SharedModule,
    NgbCollapseModule,
    ModalsModule,
    ReactiveFormsModule,
  ],
})
export class ClientModule { }
