import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemListingComponent } from './item-listing/item-listing.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalsModule } from 'src/app/_metronic/partials';
import { ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [ItemListingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ItemListingComponent,
      }
    ]),
    SharedModule,
    NgbCollapseModule,
    ModalsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgSelectModule,
  ]
})
export class ItemModule { }
