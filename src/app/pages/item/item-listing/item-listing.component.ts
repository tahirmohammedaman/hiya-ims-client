import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ModalConfig, ModalComponent } from 'src/app/_metronic/partials';
import { ApiResponse } from 'src/app/services/item/common/api-response.interface';
import { Item } from 'src/app/services/item/item';
import { GetOptions, ItemService } from 'src/app/services/item/item.service';
import { LookupService } from 'src/app/services/lookup/lookup.service';
import { DialogService } from 'src/app/services/util/dialog/dialog.service';

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

  itemForm: FormGroup;
  selectedItem?: Item;

  lookupItems: {
    id: string,
    name: string,
  }[] = [];

  @ViewChild('modal') private modalComponent: ModalComponent;
  modalConfig: ModalConfig = {
    modalTitle: 'Add Item',
    dismissButtonLabel: 'Save',
    closeButtonLabel: 'Cancel',
    // size: 'lg',
  };

  @ViewChild('fileInput') fileInput: ElementRef;

  submitLoading: boolean = false;
  confirmLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private itemService: ItemService,
    private lookupService: LookupService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadItems();
    this.initForm();
  }

  loadItems(): void {
    this.itemService.getAllItems(this.getOptions).subscribe({
      next: (res: ApiResponse<Item[]>) => {
        if (res.data) {
          this.items = res.data;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.dialogService.showError(err.error.message);
      },
    });
  }

  initForm(): void {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      image: [''],
      defaultRentRate: [''],
      defaultSalePrice: [''],
      isSet: [false, Validators.required],
      itemLines: this.fb.array([
        this.fb.group({
          id: [''],
          quantity: [''],
        }),
      ]),
    });

    this.loadLookupItems();
  }

  loadLookupItems(): void {
    this.lookupService.getItems('unit').subscribe({
      next: (res) => {
        if (res.data) {
          this.lookupItems = res.data;
        }
      },
      error: (err) => {
        this.dialogService.showError(err.error.message);
      },
    });
  }

  get itemLinesFormArray(): FormArray {
    return this.itemForm.get('itemLines') as FormArray;
  }

  addToItemLineFormArray(): void {
    this.itemLinesFormArray.push(this.fb.group({
      id: [''], // Make required
      quantity: [''], // Make required
    }));
  }

  removeFromItemLineFormArray(index: number): void {
    this.itemLinesFormArray.removeAt(index);
    if (this.itemLinesFormArray.length === 0) {
      this.addToItemLineFormArray();
    }
  }

  onImageChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.itemForm.patchValue({
      image: file,
    });
  }

  toggleRow(index: number): void {
    this.expandedRow = this.expandedRow === index ? -1 : index;
  }

  openModal(item?: Item): void {
    if (item) {
      this.itemForm.patchValue(item);
      if (item.isSet) {
        this.itemLinesFormArray.clear();
        item.itemLines?.forEach((line) => {
          this.itemLinesFormArray.push(
            this.fb.group({
              id: line.item.id,
              quantity: line.quantity
            })
          );
        });
      }
      this.selectedItem = item;
      this.modalConfig.modalTitle = 'Edit Item';
    } else {
      this.modalConfig.modalTitle = 'Add Item';
    }

    this.modalComponent.open();
  }

  closeModal(): void {
    this.modalComponent.close();
    this.resetForm();
    this.selectedItem = undefined;
  }

  resetForm(): void {
    this.itemForm.reset();
    this.itemForm.patchValue({
      name: '',
      description: '',
      image: '',
      defaultRentRate: '',
      defaultSalePrice: '',
      isSet: false,
    });

    this.fileInput.nativeElement.value = '';

    this.itemLinesFormArray.clear();
    this.addToItemLineFormArray();
  }

  submitForm(): void {
    if (this.itemForm.invalid) {
      return;
    }

    this.submitLoading = true;
    const formData = new FormData();
    Object.keys(this.itemForm.value).forEach((key) => {
      if (key === 'itemLines' && this.itemForm.value.isSet) {
        if (this.itemForm.value.itemLines && this.itemForm.value.itemLines.length) {
          this.itemForm.value.itemLines.forEach((line: any, index: any) => {
            Object.keys(line).forEach(lineKey => {
              if (line[lineKey]) {
                formData.append(`itemLines[${index}][${lineKey}]`, line[lineKey]);
              }
            });
          });
        }
      } else {
        if (this.itemForm.value[key] || key === 'isSet') {
          formData.append(key, this.itemForm.value[key]);
        }
      }
    });

    const operation = this.selectedItem ?
      this.itemService.updateItem(this.selectedItem.id, formData) :
      this.itemService.createItem(formData);

    operation.subscribe({
      next: (res: ApiResponse<Item>) => {
        this.loadItems();
        this.loadLookupItems();
        this.closeModal();
        this.resetForm();
        this.dialogService.showSuccess(res.message);
      },
      error: (err) => {
        this.dialogService.showError(err.error.message);
        this.submitLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.submitLoading = false;
      }
    });
  }

  confirmDelete(id: string): void {
    this.dialogService.showConfirm({
      title: 'Are you sure you want to delete this item?',
      onConfirm: () => this.deleteItem(id),
      loading$: this.confirmLoading$,
    });
  }

  deleteItem(id: string): void {
    this.confirmLoading$.next(true);
    this.itemService.deleteItem(id).subscribe({
      next: (res: ApiResponse) => {
        this.dialogService.showSuccess(res.message);
        this.loadItems();
        this.loadLookupItems();
      },
      error: (err) => {
        this.dialogService.showError(err.error.message);
        this.confirmLoading$.next(false);
      },
      complete: () => {
        this.confirmLoading$.next(false);
      }
    });
  }
}
