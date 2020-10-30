import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../classes/user.class';
import { ApiDataService } from '../apiData/api-data.service';
import { ServerMessage } from '../../classes/serverMessage.class';
import { LogedResponse } from '../../classes/logedResponse.class';
import { Beneficiary } from '../../classes/beneficiary.class';
import { UtilitiesService } from '../utilities/utilities.service';
import { EconomicStudyForm } from '../../classes/economicStudyForm.class';

@Injectable({
  providedIn: 'root'
})
export class DataSessionService {

  token: String;
  alreadyLoged: Boolean = false;

  user: User;
  baseURL: String;

  //Views variables
  openBeneficiary: Beneficiary;
  actualForms : EconomicStudyForm[];

  constructor(private apiDataService: ApiDataService, private route: Router, private utilitiesService: UtilitiesService) {
    this.token = "";
    this.user = new User();
    this.openBeneficiary = new Beneficiary();
    this.actualForms = [];
    this.baseURL = apiDataService.baseURL;
    //localStorage.setItem('token', JSON.stringify(this.token));
    let token = localStorage.getItem('token');
    if (!token) {
      console.log("Primer uso");
      localStorage.setItem('token', JSON.stringify(this.token));
    } else {
      this.token = JSON.parse(token);
      this.apiDataService.setToken(this.token);
      //Acciones a realizar cuando el token estaba ya guardado pero la data para la interfaz no esta disponible
      //Se sabe que no esta disponible porque apenas se mando llamar el contructor
      if (this.token.length > 0) {
        this.apiDataService.getUserData(this.token).then((response: ServerMessage) => {
          //console.log(response);
          if (response.error == true) {
            console.log(response);
          } else {
            this.user = new User();
            this.user.idUser = response.data.user.idUser;
            this.user.name = response.data.user.name;
            this.user.email = response.data.user.email;
            this.user.password = response.data.user.password;
            this.user.canCreateBen = response.data.user.canCreateBen;
            this.user.canSeeExp = response.data.user.canSeeExp;
            this.user.role = response.data.user.role;
            this.user.haveImage = response.data.user.haveImage;

            if (this.user.role == 0 || this.user.role == 1) {

              //posible TO DO : En caso de que se carguen cosas extras que se usen ent odo el sistema aquí es la parte
              //donde se deberían de cargar
              //console.log("carga de datos del usuario");

            } else {

            }
            //console.log(this.user);
          }
        }, (error) => {
          console.log("error")
          console.log(error);
        });

      };
    }
  }

  navigateByUrl(url: String) {
    this.route.navigateByUrl(url.toString());
  }

  checkLogin(succesCallBack, errorCallBack) {
    //console.log(this.token);
    if (this.token == "") {
      errorCallBack(new LogedResponse(true, "Sin token"))
    } else {
      this.apiDataService.setToken(this.token);
      //console.log(this.user);

      if (this.user.email == "") {
        this.apiDataService.getUserData(this.token).then((response: ServerMessage) => {
          //console.log(response);
          if (response.error == true) {
            this.navigateByUrl("/login");
            errorCallBack(new LogedResponse(false, response.message))
          } else {
            this.user = new User();
            this.user.idUser = response.data.user.idUser;
            this.user.name = response.data.user.name;
            this.user.email = response.data.user.email;
            this.user.password = response.data.user.password;
            this.user.canCreateBen = response.data.user.canCreateBen;
            this.user.canSeeExp = response.data.user.canSeeExp;
            this.user.role = response.data.user.role;
            this.user.haveImage = response.data.user.haveImage;

            if (this.user.haveImage) {
              // TO DO : completar correctamente la implementación en el servidor
              this.apiDataService.getImage(this.baseURL.toString() +
                'uploads/user-image/' + this.user.idUser.toString()).then((image) => {
                  this.user.imageBlob = image;
                  succesCallBack(new LogedResponse(false, "Con token y usario actualizado"));
                }, (error) => {
                  console.log(error);
                  this.user.imageBlob = "";
                  errorCallBack(new LogedResponse(true, "A ocurrido un error obteniendo la imagen del usuario"));
                });
              succesCallBack(new LogedResponse(false, "Con token y usario actualizado"));
            } else {
              succesCallBack(new LogedResponse(false, "Con token y usario actualizado"));
            }
            /* console.log(this.user); */
          }
        }, (error) => {
          console.log("error 2");

          console.log(error);
          errorCallBack(new LogedResponse(true, "A ocurrido un error"));
        });
      } else {
        if (this.user.haveImage == true) {
          // TO DO : completar correctamente la implementación en el servidor
          this.apiDataService.getImage(this.baseURL.toString() +
            'uploads/user-image/' + this.user.idUser.toString()).then((image: string) => {
              this.user.imageBlob = image;
              //console.log(image);
              succesCallBack(new LogedResponse(false, "Sesion Con token e informacion de usuario"));
            }, (error) => {
              console.log(error);
              this.user.imageBlob = "";
              errorCallBack(new LogedResponse(true, "A ocurrido un error obteniendo la imagen del usuario"));
            });
          succesCallBack(new LogedResponse(false, "Con token y usario actualizado"));
        } else {
          succesCallBack(new LogedResponse(false, "Sesion Con token e informacion de usuario"));
        }

      }
    }
  }

  loginUser(email: String, password: String) {
    return new Promise((resolve, reject) => {
      this.apiDataService.doLogin(email, password).then((response: ServerMessage) => {
        if (response.error) {
          reject(response)
        } else {
          //Logica con la que guardamos los datos del inicio de sesion
          localStorage.setItem('token', JSON.stringify(response.data.token));
          this.token = response.data.token;
          this.apiDataService.setToken(this.token);
          resolve(response);
        }
      }, (error) => {
        reject(error)
      });
    });
  }

  logOut() {
    localStorage.setItem('token', "");
    this.token = localStorage.getItem('token');
    this.route.navigateByUrl('/login')
  }

  getBeneficiary(idBeneficiary: number,callBack) {
    this.openBeneficiary = new Beneficiary();
    this.actualForms = [];
    this.apiDataService.getBeneficiaryData(idBeneficiary).then(async (response: ServerMessage) => {
      if (response.error == true) {
        this.utilitiesService.showWarningToast(response.message, "Error");
        this.navigateByUrl("/dashboard/records");
      } else if (response.error == false) {
        //this.utilitiesService.showSuccessToast(response.message,"Éxito");
        this.openBeneficiary = response.data.beneficiary;
        this.openBeneficiary.birthDay = new Date(this.openBeneficiary.birthDay);
        this.openBeneficiary.createDate = new Date(this.openBeneficiary.createDate);
        if (this.openBeneficiary.haveImage == true) {
          //console.log(this.selectedUser);
          this.openBeneficiary.imageBlob = await this.apiDataService.getImage(this.baseURL.toString() +
            'uploads/beneficiary-image/' + this.openBeneficiary.idBeneficiary.toString());
        }
        this.actualForms = response.data.economicStudyForms;
        for (let index = 0; index <  this.actualForms.length; index++) {
          this.actualForms[index].creationDate = new Date(this.actualForms[index].creationDate);
        }
        callBack();
      }
    }).catch((error) => {
      console.log("error");
      console.log(error);
    })
  }
}
