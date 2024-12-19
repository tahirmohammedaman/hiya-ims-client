import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor() { }

  // showConfirm(
  //   config: {
  //     title: string;
  //     onConfirm: () => void;
  //     onCancel?: () => void;
  //     loading$?: Observable<boolean>;
  //   }
  // ) {
  //   Swal.fire({
  //     icon: 'warning',
  //     title: config.title,
  //     text: 'This action cannot be undone',
  //     showCancelButton: true,
  //     cancelButtonText: 'Cancel',
  //     confirmButtonText: 'Confirm',
  //     focusCancel: true,
  //     buttonsStyling: false,
  //     customClass: {
  //       confirmButton: 'btn btn-danger',
  //       cancelButton: 'btn btn-active-light'
  //     }
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       config.onConfirm();
  //     } else if (result.isDismissed && config.onCancel) {
  //       config.onCancel();
  //     }
  //   });
  // }

  showConfirm(
    config: {
      title: string;
      onConfirm: () => void;
      onCancel?: () => void;
      loading$?: Observable<boolean>;
    }
  ) {
    Swal.fire({
      icon: 'warning',
      title: config.title,
      text: 'This action cannot be undone',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm',
      focusCancel: true,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-active-light'
      },
      preConfirm: () => {
        return new Promise<void>((resolve) => {
          config.onConfirm();
          if (config.loading$) {
            config.loading$.subscribe((loading) => {
              const confirmButton = Swal.getConfirmButton();
              if (confirmButton) {
                if (loading) {
                  confirmButton.disabled = true;
                  confirmButton.innerHTML = `
                    <span class="indicator-label">Please wait...</span>
                    <span class="indicator-progress">
                      <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  `;
                } else {
                  confirmButton.disabled = false;
                  confirmButton.innerHTML = 'Confirm';
                  resolve(); // Close the dialog when loading is false
                }
              }
            });
          } else {
            resolve(); // Close the dialog if no loading$ observable is provided
          }
        });
      }
    }).then((result: SweetAlertResult) => {
      if (result.isDismissed && config.onCancel) {
        config.onCancel();
      }
    });
  }

  showSuccess(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      confirmButtonText: 'Ok, got it!',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-success',
      }
    });
  }

  showError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonText: 'Ok, got it!',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-danger',
      }
    });
  }
}
