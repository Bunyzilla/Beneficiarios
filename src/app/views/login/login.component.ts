import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DataSessionService } from '../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../services/utilities/utilities.service';
import { LogedResponse } from '../../classes/logedResponse.class';
import { ServerMessage } from '../../classes/serverMessage.class';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{

  email: string;
  password: string;

  loginform = true;
  recoverform = false;

  constructor(public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    this.clearData();
    // this.dataSessionService.logOut();
    // console.log(this.dataSessionService.user);
    /* this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      // console.log(logedResponse);
      if (this.dataSessionService.user.role != 0 && this.dataSessionService.user.role != 1 && this.dataSessionService.user.role != 2) {
        this.dataSessionService.logOut();
        this.utilitiesService.showErrorToast( "Usuario desconocido.","Error!");
      } else if (this.dataSessionService.user.role == 0 ) {
        // console.log("es admin");
        this.dataSessionService.navigateByUrl("/dashboard/admin/home");
        
      } else if (this.dataSessionService.user.role == 2 || this.dataSessionService.user.role == 0) {
        this.utilitiesService.showInfoToast("Aun no se cuenta con este servicio.")
      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);
    }); */
  }

  clearData() {
    this.email = "";
    this.password = "";
  }

  validateLoginData(): Boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(String(this.email).toLowerCase()) ) {
      this.utilitiesService.showInfoToast( "Correo invalido.");
      return false;
    } else if (this.password.length < 8) {
      this.utilitiesService.showInfoToast("Contraseña invalida.");
      return false;
    } else {
      return true;
    }
  }

  loginUser() {
    if (this.validateLoginData()) {
      this.dataSessionService.loginUser(this.email, this.password).then((response: ServerMessage) => {
        //console.log(response);
        this.clearData();
        this.utilitiesService.showSuccessToast( response.message,"Exito!");
        if (this.dataSessionService.user.role != 0 && this.dataSessionService.user.role != 1 && this.dataSessionService.user.role != 2) {
          this.dataSessionService.logOut();
          this.utilitiesService.showErrorToast( "Usuario desconocido.","Error!");
        } else if (this.dataSessionService.user.role == 0 ) {
          //console.log("es admin");
          this.dataSessionService.navigateByUrl("/dashboard/admin/home");
        } else if (this.dataSessionService.user.role == 1 || this.dataSessionService.user.role == 2) {
          this.utilitiesService.showInfoToast("Aun no se cuenta con este servicio.")
        }
      }, (error) => {
        //console.log(error);
        this.utilitiesService.showErrorToast( error.message, "Error!");
      });
    }
  }

  showRecoverForm() {
    this.loginform = !this.loginform;
    this.recoverform = !this.recoverform;
  }
}
