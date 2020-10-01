import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DataSessionService } from '../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../services/utilities/utilities.service';
import { LogedResponse } from '../../classes/logedResponse.class';
import { ServerMessage } from '../../classes/serverMessage.class';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  email: string;
  password: string;

  constructor(public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    this.clearData();
    //console.log(this.dataSessionService.user);
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);    
      if (this.dataSessionService.user.role != 0 && this.dataSessionService.user.role != 1 ) {
        this.dataSessionService.logOut();
        this.utilitiesService.showErrorToast("Usuario desconocido.", "Error");
      }else if (this.dataSessionService.user.role == 0 || this.dataSessionService.user.role == 1 ) {
        //console.log("usuerio valido");
        this.dataSessionService.navigateByUrl("/dashboard/home");
      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);
      //this.dataSessionService.logOut();
    });
  }

  clearData() {
    this.email = "api.test.beneficiarios@gmail.com";
    this.password = "admin_2020*";
  }

  validateLoginData(): Boolean {
    if (this.email.length < 8) {
      this.utilitiesService.showErrorToast("Correo invalido.", "Error");
      return false;
    } else if (this.password.length < 8) {
      this.utilitiesService.showErrorToast("Contraseña invalida.", "Error");
      return false;
    } else {
      return true;
    }
  }

  loginUser() {
    if (this.validateLoginData()) {
      this.dataSessionService.loginUser(this.email, this.password).then((response: ServerMessage) => {
        console.log(response);
        if(response.error == false){
          this.clearData();
          this.utilitiesService.showSuccessToast(response.message, "Éxito");
  
          if (response.data.user.role != 0 && response.data.user.role != 1) {
            this.dataSessionService.logOut();
            this.utilitiesService.showErrorToast("Usuario desconocido.", "Error");
          } else if (response.data.user.role == 0 || response.data.user.role == 1 ) {
            //console.log("usuerio valido");
            this.dataSessionService.navigateByUrl("/dashboard/home");
          } 
        }else{
          this.utilitiesService.showErrorToast(response.message,"Error");
        }
      }, (error) => {
        //console.log(error);
        this.utilitiesService.showErrorToast( error.message, "Error");
      });
    }
  }
}
