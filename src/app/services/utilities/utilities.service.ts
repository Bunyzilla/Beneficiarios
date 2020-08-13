import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  constructor(private toastr: ToastrService) {}

  //TOAST
  showSuccessToast(message : string , title : string) {
    this.toastr.success(message, title);
  }
  
  showErrorToast(message : string , title : string) {
    this.toastr.error(message, title);
  }

  showWarningToast(message : string , title : string) {
    this.toastr.warning(message, title);
  }

  showInfoToast(message : string) {
    this.toastr.info(message);
  }
  //END. TOAST
}
