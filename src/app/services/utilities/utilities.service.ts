import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  sidebarClass : String;
  navbarClass : String;

  constructor(private toastr: ToastrService) {
    this.sidebarClass = "";
    this.navbarClass = "";
  }

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
  showSidebar(){
    if(this.sidebarClass == "ShowMenu"){
      this.sidebarClass = "";
    } else{
      this.sidebarClass = "ShowMenu";
    }

    if(this.navbarClass == "ExpandNavBar"){
       this.navbarClass = "";
    }else{
      this.navbarClass = "ExpandNavBar";
    }
  }
}
