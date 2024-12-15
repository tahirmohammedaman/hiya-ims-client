import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiResponse } from 'src/app/services/item/common/api-response.interface';
import { Item } from 'src/app/services/item/item';
import { GetOptions, ItemService } from 'src/app/services/item/item.service';

@Component({
  selector: 'app-item-listing',
  templateUrl: './item-listing.component.html',
  styleUrl: './item-listing.component.scss'
})
export class ItemListingComponent {
  getOptions: GetOptions = {
    limit: 10,
    offset: 0,
  }

  items: Item[];

  expandedRow: number = -1;

  constructor(
    private itemService: ItemService,
    public cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getAllItems(this.getOptions).subscribe({
      next: (res: ApiResponse<Item[]>) => {
        if (res.data) {
          this.items = res.data;
          this.cdr.detectChanges();
        }
      }
    });
  }

  toggleRow(index: number): void {
    this.expandedRow = this.expandedRow === index ? -1 : index;
  }
}
