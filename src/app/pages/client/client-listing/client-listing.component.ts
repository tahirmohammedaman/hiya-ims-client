import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { Client } from 'src/app/services/client/client';
import { ClientService } from 'src/app/services/client/client.service';
import { ApiResponse } from 'src/app/services/item/common/api-response.interface';
import { GetOptions } from 'src/app/services/item/item.service';
import { DialogService } from 'src/app/services/util/dialog/dialog.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-client-listing',
  templateUrl: './client-listing.component.html',
  styleUrl: './client-listing.component.scss'
})
export class ClientListingComponent {

  getOptions: GetOptions = {
    limit: 10,
    offset: 0,
  }

  clients: Client[];
  expandedRow: number = -1;

  clientForm: FormGroup;
  selectedClient?: Client;

  @ViewChild('modal') private modalComponent: ModalComponent;
  modalConfig: ModalConfig = {
    modalTitle: 'Add Client',
    dismissButtonLabel: 'Save',
    closeButtonLabel: 'Cancel',
    // size: 'lg',
  };

  @ViewChild('fileInput') fileInput: ElementRef;

  submitLoading: boolean = false;
  confirmLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private clientService: ClientService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadClients();
    this.initForm();
  }

  loadClients(): void {
    this.clientService.getAllClients(this.getOptions).subscribe({
      next: (res: ApiResponse<Client[]>) => {
        if (res.data) {
          this.clients = res.data;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.dialogService.showError(err.error.message);
      },
    });
  }

  initForm(): void {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      TIN: [''],
      contactPerson: [''],
      primaryPhoneNumber: ['', Validators.required],
      secondaryPhoneNumber: [''],
      email: [''],
      city: [''],
      subCity: [''],
      woreda: [''],
      houseNumber: [''],
      files: [[]],
    });
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      this.clientForm.get('files')?.setValue(target.files);
    }
  }

  toggleRow(index: number): void {
    this.expandedRow = this.expandedRow === index ? -1 : index;
  }

  openModal(client?: Client): void {
    if (client) {
      this.clientForm.patchValue(client);
      this.selectedClient = client;
      this.modalConfig.modalTitle = 'Edit Client';
    } else {
      this.modalConfig.modalTitle = 'Add Client';
    }
    this.modalComponent.open();
  }

  closeModal(): void {
    this.modalComponent.close();
    this.clientForm.reset();
    this.selectedClient = undefined;
  }

  resetForm(): void {
    this.clientForm.reset();
    this.fileInput.nativeElement.value = '';
  }

  getDisplayFilename(filename: string) {
    return filename.split('_').pop();
  }

  getStaticUrl(filename: string): string {
    return `${environment.staticApiUrl}/${filename}`;
  }

  submitForm(): void {
    if (this.clientForm.invalid) {
      return;
    }

    this.submitLoading = true;
    const formData = new FormData();
    Object.keys(this.clientForm.value).forEach((key) => {
      if (key === 'files') {
        const files = this.clientForm.get('files')?.value;
        if (files.length) {
          for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
          }
        }
      } else {
        formData.append(key, this.clientForm.get(key)?.value);
      }
    });

    const operation = this.selectedClient ?
      this.clientService.updateClient(this.selectedClient.id, formData) :
      this.clientService.createClient(formData);

    operation.subscribe({
      next: (res: ApiResponse<Client>) => {
        this.loadClients();
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
      title: 'Are you sure you want to delete this client?',
      onConfirm: () => this.deleteClient(id),
      loading$: this.confirmLoading$,
    });
  }

  deleteClient(id: string): void {
    this.confirmLoading$.next(true);
    this.clientService.deleteClient(id).subscribe({
      next: (res: ApiResponse<any>) => {
        this.dialogService.showSuccess(res.message);
        this.loadClients();
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

  confirmDeleteFile(clientId: string, filename: string): void {
    this.dialogService.showConfirm({
      title: 'Are you sure you want to delete this file?',
      onConfirm: () => this.deleteClientFile(clientId, filename),
      loading$: this.confirmLoading$,
    });
  }

  deleteClientFile(clientId: string, filename: string): void {
    this.confirmLoading$.next(true);
    this.clientService.deleteClientFile(clientId, filename).subscribe({
      next: (res: ApiResponse<any>) => {
        this.dialogService.showSuccess(res.message);
        this.loadClients();
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
