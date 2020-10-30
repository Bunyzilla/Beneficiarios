import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  sidebarClass: String;
  navbarClass: String;

  constructor(private toastr: ToastrService) {
    this.sidebarClass = "";
    this.navbarClass = "";
  }

  //TOAST
  showSuccessToast(message: string, title: string) {
    this.toastr.success(message, title);
  }

  showErrorToast(message: string, title: string) {
    this.toastr.error(message, title);
  }

  showWarningToast(message: string, title: string) {
    this.toastr.warning(message, title);
  }

  showInfoToast(message: string) {
    this.toastr.info(message);
  }
  //END. TOAST
  showSidebar() {
    if (this.sidebarClass == "ShowMenu") {
      this.sidebarClass = "";
    } else {
      this.sidebarClass = "ShowMenu";
    }

    if (this.navbarClass == "ExpandNavBar") {
      this.navbarClass = "";
    } else {
      this.navbarClass = "ExpandNavBar";
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  yearsDiff(d1, d2) {
    let date1 = new Date(d1);
    let date2 = new Date(d2);
    let yearsDiff = date2.getFullYear() - date1.getFullYear();
    return yearsDiff;
  }

  edad(d1) {
    let date1 = new Date(d1);
    let date2 = new Date();
    let years = this.yearsDiff(d1, date2);
    let months = (years * 12) + (date2.getMonth() - date1.getMonth());
    return Math.trunc(months / 12) ;
  }
}
