import { ApiDataService } from './../../../services/apiData/api-data.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataSessionService } from '../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { LogedResponse } from '../../../classes/logedResponse.class';
import { User } from '../../../classes/user.class';
import { ServerMessage } from '../../../classes/serverMessage.class';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  userData: User = new User();

  password: string = "";
  confirmPassword: string = "";

  source: string = '';
  selectedFile: any;

  // Emit an event when a file has been picked. Here we return the file itself
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  constructor(public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService,
    private apiDataService: ApiDataService) { }

  ngOnInit(): void {
    this.userData = new User();
    this.password = "";
    this.confirmPassword = "";

    this.dataSessionService.checkLogin(async (loggedResponse: LogedResponse) => {
      //console.log(loggedResponse);    
      if (this.dataSessionService.user.role != 0 && this.dataSessionService.user.role != 1) {
        this.dataSessionService.logOut();
        this.utilitiesService.showErrorToast("Usuario desconocido.", "Error");
      } else if (this.dataSessionService.user.role == 0 || this.dataSessionService.user.role == 1) {
        //Things to do in this view when user is already logged


        this.userData = JSON.parse(JSON.stringify(this.dataSessionService.user))
        this.userData.imageBlob = "";

        if (this.userData.haveImage == true) {
          //console.log(this.selectedUser);
          this.userData.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
            'uploads/user-image/' + this.userData.idUser.toString());
        }
      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);
      this.dataSessionService.logOut();
    });
  }

  // If the input has changed(file picked) we project the file into the img previewer
  updateSource($event: Event) {
    // We access he file with $event.target['files'][0]
    let file = $event.target['files'][0];
    let reader = new FileReader;
    // TODO: Define type of 'e'
    reader.onload = (e: any) => {
      // Simply set e.target.result as our <img> src in the layout
      this.source = e.target.result;
      this.onChange.emit(file);
      this.selectedFile = file;
    };
    // This will process our file and get it's attributes/data
    reader.readAsDataURL(file);
  }

  cancelImage() {
    this.source = "";
    this.userData.haveImage = false;
  }

  validateUpdatedUserData(): Boolean {
    if (this.userData.name.length < 8) {
      this.utilitiesService.showErrorToast("El nombre del usuario debe ser mayor de 8 caracteres", "Nombre invalido");
      return false;
    } else {
      this.userData.password = this.password;
      return true;
    }
  }

  generatePassword() {
    // Start. Create Automatic Password 
    var length = 8;
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    return retVal;
  }

  saveData() {
    if (this.password.length > 0) {
      if (this.password.length < 8) {
        this.utilitiesService.showErrorToast("Contraseña debe ser mayor de 8 caracteres", "Contraseña invalida");
      } else if (this.password != this.confirmPassword) {
        this.utilitiesService.showErrorToast("Las contraseñas no coinciden", "Contraseña invalida");
      } else {

        this.apiDataService.changePasswordUser(this.userData.idUser, this.password).then((result: ServerMessage) => {
          if (result.error == false) {
            this.utilitiesService.showSuccessToast(result.message, "Éxito");

            //recargar la info del usuario
            this.dataSessionService.checkLogin(async (loggedResponse: LogedResponse) => {
              this.userData = JSON.parse(JSON.stringify(this.dataSessionService.user))
              this.userData.imageBlob = "";
              this.password = "";
              this.confirmPassword = "";
              if (this.userData.haveImage == true) {
                //console.log(this.selectedUser);
                this.userData.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
                  'uploads/user-image/' + this.userData.idUser.toString());
              }
            }, (noLoginResponse: LogedResponse) => {
              //console.log(noLoginResponse);
              this.dataSessionService.logOut();
            });

          } else {
            this.utilitiesService.showErrorToast(result.message, "Error");
          }
        }, (error) => {
          this.utilitiesService.showErrorToast("A ocurrido un error", "Error");
          console.log(error);

        });
      }
    }
    //Se elimino la imagen
    else if (!this.userData.haveImage && this.dataSessionService.user.haveImage && this.source.length == 0 && this.userData.idUser != -1) {
      console.log("Elimino imagen");
      //Loading de carga
      this.updateUser().then((response: ServerMessage) => {
        //primero se actualiza la info del usuario para luego subir su imagen
        this.apiDataService.deleteImageUser(response.data.idUser).then((response: any) => {
          this.apiDataService.getUserData(this.dataSessionService.token).then(async (response: ServerMessage) => {
            this.dataSessionService.user = new User();
            this.dataSessionService.user.idUser = response.data.user.idUser;
            this.dataSessionService.user.name = response.data.user.name;
            this.dataSessionService.user.email = response.data.user.email;
            this.dataSessionService.user.password = response.data.user.password;
            this.dataSessionService.user.canCreateBen = response.data.user.canCreateBen;
            this.dataSessionService.user.canSeeExp = response.data.user.canSeeExp;
            this.dataSessionService.user.role = response.data.user.role;
            this.dataSessionService.user.haveImage = response.data.user.haveImage;
            this.userData = JSON.parse(JSON.stringify(this.dataSessionService.user));
            this.userData.imageBlob = "";
            if (this.userData.haveImage == true) {
              //console.log(this.selectedUser);
              this.userData.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
                'uploads/user-image/' + this.userData.idUser.toString());
            }

            if (this.dataSessionService.user.haveImage == true) {
              //console.log(this.selectedUser);
              this.dataSessionService.user.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
                'uploads/user-image/' + this.dataSessionService.user.idUser.toString());
            }
            this.password = "";
            this.confirmPassword = "";
          }, (error) => {
            console.log("error");
            console.log(error);
          });
        }).catch((error) => {
          console.log("error");
          console.log(error);
        });
      }).catch((error: ServerMessage) => {
        //
        console.log("error");
      });
    }
    //Si se selecciona una imagen
    else if (this.source.length > 0) {
      console.log("imagen diferente");
      //here the user is edited
      this.updateUser().then((response: ServerMessage) => {
        //primero se actualiza la info del usuario para luego subir su imagen
        this.uploadImage(this.selectedFile, "" + this.userData.idUser).then((response: any) => {
          
          this.apiDataService.getUserData(this.dataSessionService.token).then(async (response: ServerMessage) => {
            this.dataSessionService.user = new User();
            this.dataSessionService.user.idUser = response.data.user.idUser;
            this.dataSessionService.user.name = response.data.user.name;
            this.dataSessionService.user.email = response.data.user.email;
            this.dataSessionService.user.password = response.data.user.password;
            this.dataSessionService.user.canCreateBen = response.data.user.canCreateBen;
            this.dataSessionService.user.canSeeExp = response.data.user.canSeeExp;
            this.dataSessionService.user.role = response.data.user.role;
            this.dataSessionService.user.haveImage = response.data.user.haveImage;
            this.userData = JSON.parse(JSON.stringify(this.dataSessionService.user));
            this.userData.imageBlob = "";
            if (this.userData.haveImage == true) {
              //console.log(this.selectedUser);
              this.userData.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
                'uploads/user-image/' + this.userData.idUser.toString());
            }

            if (this.dataSessionService.user.haveImage == true) {
              //console.log(this.selectedUser);
              this.dataSessionService.user.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
                'uploads/user-image/' + this.dataSessionService.user.idUser.toString());
            }
            this.password = "";
            this.confirmPassword = "";
          }, (error) => {
            console.log("error");
            console.log(error);
          });
          //console.log(response);
        }).catch((error) => {
          console.log("error");
          console.log(error);
        });
      }).catch((error: ServerMessage) => {
        //
        console.log("error");
      });
    }
    //Si la imagen no se va a eliminar ni cambiar
    else {
      console.log("Sin cambios en la imagen");
      //here the user is edited
      this.updateUser().then((response) => {
        console.log("usuario actualizado");
        //recargar la info del usuario
        this.apiDataService.getUserData(this.dataSessionService.token).then(async (response: ServerMessage) => {
          this.dataSessionService.user = new User();
          this.dataSessionService.user.idUser = response.data.user.idUser;
          this.dataSessionService.user.name = response.data.user.name;
          this.dataSessionService.user.email = response.data.user.email;
          this.dataSessionService.user.password = response.data.user.password;
          this.dataSessionService.user.canCreateBen = response.data.user.canCreateBen;
          this.dataSessionService.user.canSeeExp = response.data.user.canSeeExp;
          this.dataSessionService.user.role = response.data.user.role;
          this.dataSessionService.user.haveImage = response.data.user.haveImage;
          this.userData = JSON.parse(JSON.stringify(this.dataSessionService.user));
          this.userData.imageBlob = "";
          if (this.userData.haveImage == true) {
            //console.log(this.selectedUser);
            this.userData.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
              'uploads/user-image/' + this.userData.idUser.toString());
          }

          if (this.dataSessionService.user.haveImage == true) {
            //console.log(this.selectedUser);
            this.dataSessionService.user.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
              'uploads/user-image/' + this.dataSessionService.user.idUser.toString());
          }
          this.password = "";
          this.confirmPassword = "";
        }, (error) => {
          console.log("error");
          console.log(error);
        });

      }).catch((error) => {

        console.log("error");
        console.log(error);
      });
    }
  }

  uploadImage(file: any, id: String) {
    return new Promise((resolve, reject) => {
      var newFileName = id + ".jpg";
      let reader = new FileReader;

      try {
        // TODO: Define type of 'e'
        reader.onload = (e: any) => {
          this.onChange.emit(file);
          const formData = new FormData();
          let image: Blob = new Blob([reader.result], {
            type: file.type
          });
          formData.append('files[]', image, newFileName);
          //Loading de carga
          this.apiDataService.uploadImageUser(formData).then((result: ServerMessage) => {

            if (result.error == false) {
              this.utilitiesService.showSuccessToast(result.message, "Éxito");
              resolve(result);
            } else {
              this.utilitiesService.showErrorToast(result.message, "Error");
              reject(result);
            }
          }, (error) => {
            //this.utilitiesService.showNotification(0, "A ocurrido un error.", 5000, () => { });
            this.utilitiesService.showErrorToast("A ocurrido un error", "Error");
            //this.utilitiesService.closeLoadingMsg();
            reject(error);
          });
        };
        // This will process our file and get it's attributes/data
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.log("sin imagen seleccionada");
        resolve({ url: "" });
      }
    });
  }

  updateUser() {
    return new Promise((resolve, reject) => {
      if (this.validateUpdatedUserData()) {
        this.apiDataService.updateUser(this.userData).then((response: ServerMessage) => {
          if (response.error == false) {
            this.utilitiesService.showSuccessToast(response.message, "Éxito");
        
            resolve(response);
          } else {
            this.utilitiesService.showErrorToast(response.message, "Error");
            reject(response);
          }
        }).catch((error) => {
          console.log("error");
          console.log(error);
          this.utilitiesService.showErrorToast("A ocurrido un error", "Error");
          reject(error)
        });
      } else {
        reject("Error en validaciones")
      }

    })
  }

}
