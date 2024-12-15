import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemListingComponent } from './item-listing/item-listing.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';



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
  ]
})
export class ItemModule { }
