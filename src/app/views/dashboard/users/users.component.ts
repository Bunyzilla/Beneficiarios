import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { User } from '../../../classes/user.class';
import { UtilitiesService } from './../../../services/utilities/utilities.service';
import { DataSessionService } from '../../../services/dataSession/data-session.service';
import { ApiDataService } from '../../../services/apiData/api-data.service';
import { ServerMessage } from '../../../classes/serverMessage.class';
import { LogedResponse } from '../../../classes/logedResponse.class';
import { rejects } from 'assert';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  usersList: User[] = [];
  usersListFiltered: User[] = [];
  selectedUser: User = new User();

  searchValue: String = "";

  password: string = "";
  confirmPassword: string = "";

  source: string = '';
  selectedFile: any;

  // Emit an event when a file has been picked. Here we return the file itself
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  //DOM modal references
  @ViewChild('closeAddUserBtn') closeAddUserBtn: ElementRef;
  @ViewChild('closeEditUserBtn') closeEditUserBtn: ElementRef;
  @ViewChild('closeDeleteUserBtn') closeDeleteUserBtn: ElementRef;

  constructor(private utilitiesService: UtilitiesService, public dataSessionService: DataSessionService,
    private apiDataService: ApiDataService) {
    this.usersList = new Array<User>();
    this.usersListFiltered = Array.from(this.usersList);
  }

  async ngOnInit() {
    this.password = "";
    this.confirmPassword = "";

    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);    
      if (this.dataSessionService.user.role != 0 && this.dataSessionService.user.role != 1) {
        this.dataSessionService.logOut();
        this.utilitiesService.showErrorToast("Usuario desconocido.", "Error");
      } else if (this.dataSessionService.user.role == 0 || this.dataSessionService.user.role == 1) {
        //Things to do in this view when user is already logged
        this.getUsersList();
      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);
      this.dataSessionService.logOut();
    });
  }

  getUsersList() {
    return new Promise((resolve, reject) => {
      this.usersList = [];
      this.apiDataService.getUsersData().then((response: ServerMessage) => {
        if (response.error == false) {
          this.usersList = response.data;
          this.usersListFiltered = Array.from(this.usersList);
          //console.log(this.usersList);

          resolve(response);
        } else {
          console.log("error");
          reject(response);
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }

  filterByUserName(event) {
    let searchValueTemp = event.charAt(0).toLowerCase() + event.slice(1);

    if (this.searchValue == "") {
      this.usersListFiltered = Array.from(this.usersList);
    } else {
      this.usersListFiltered = this.usersList.filter(function (user) {
        let fixed = user.name.charAt(0).toUpperCase() + event.slice(1);
        return user.name.toLowerCase().includes(searchValueTemp);
      });
    }
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
    this.selectedUser.haveImage = false;
  }

  openAddUser() {
    this.password = "admin_2020*";
    this.confirmPassword = "admin_2020*";
    this.selectedUser = new User();

    this.selectedUser.name = "Luismiguel Ortiz Alvarez";
    this.selectedUser.email = "luismi.luu@gmail.com";
    this.selectedUser.role = 0;
    this.selectedUser.canCreateBen = true;
    this.selectedUser.canSeeExp = true;
  }

  async openEditUser(userForEdit: User) {
    this.selectedUser = new User();

    this.selectedUser = JSON.parse(JSON.stringify(userForEdit))
    this.selectedUser.imageBlob = "";

    if (this.selectedUser.haveImage == true) {
      //console.log(this.selectedUser);
      this.selectedUser.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
        'uploads/user-image/' + this.selectedUser.idUser.toString());
    }
  }


  validateNewUserData(): Boolean {
    if (this.selectedUser.name.length < 8) {
      this.utilitiesService.showErrorToast("El nombre del usuario debe ser mayor de 8 caracteres", "Nombre invalido");
      return false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.selectedUser.email.toString())) { //Validacion del correo
      this.utilitiesService.showErrorToast("Introduzca un email valido", "Corro invalido");
      return false;
    } else if (this.password.toString().length < 7) {
      this.utilitiesService.showErrorToast("Las contraseñas muy corta min 8 caracteres", "Contraseña invalida");
      return false;
    } else if (this.password.toString() != this.confirmPassword.toString()) { //Validacion de la contraseña
      this.utilitiesService.showErrorToast("Las contraseñas no coinciden", "Contraseña invalida");
      return false;
    } else {
      this.selectedUser.password = this.password;
      return true;
    }
  }

  validateUpdatedUserData(): Boolean {
    if (this.selectedUser.name.length < 8) {
      this.utilitiesService.showErrorToast("El nombre del usuario debe ser mayor de 8 caracteres", "Nombre invalido");
      return false;
    } else {
      this.selectedUser.password = this.password;
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
    let userFinded = this.usersList.find((user) => {
      return user.idUser == this.selectedUser.idUser;
    });

    //Se elimino la imagen
    if (userFinded != undefined && !this.selectedUser.haveImage && userFinded.haveImage && this.source.length == 0 && this.selectedUser.idUser != -1) {
      console.log("Elimino imagen");
      //Loading de carga
      this.updateUser().then((response: ServerMessage) => {
        //primero se actualiza la info del usuario para luego subir su imagen
        this.apiDataService.deleteImageUser(response.data.idUser).then((response: any) => {
          this.getUsersList();
          this.cancelImage();
        }).catch((error) => {
          console.log("error");
          console.log(error);
          this.cancelImage();
        });
      }).catch((error: ServerMessage) => {
        //
        console.log("error");
      });
    }
    //Si se selecciona una imagen
    else if (this.source.length > 0) {
      console.log("imgagen diferente");
      if (this.selectedUser.idUser == -1) {
        //here we create a new user
        this.createNewUser().then((response: ServerMessage) => {
          //primero se actualiza la info del usuario para luego subir su imagen
          //console.log(response);
          this.uploadImage(this.selectedFile, "" + response.data.idUser).then((response: any) => {
            this.getUsersList();
            this.cancelImage();
            //console.log(response);
          }).catch((error) => {
            console.log("error");
            console.log(error);
            this.cancelImage();
          });
        }).catch((error: ServerMessage) => {
          //
          console.log("error");
        });
      } else {
        //here the user is edited
        this.updateUser().then((response: ServerMessage) => {
          //primero se actualiza la info del usuario para luego subir su imagen
          this.uploadImage(this.selectedFile, "" + response.data.idUser).then((response: any) => {
            this.getUsersList();
            this.cancelImage();
            //console.log(response);
          }).catch((error) => {
            console.log("error");
            console.log(error);
            this.cancelImage();
          });
        }).catch((error: ServerMessage) => {
          //
          console.log("error");
        });
      }

    }
    //Si la imagen no se va a eliminar ni cambiar
    else {
      console.log("Sin cambios en la imagen");
      if (this.selectedUser.idUser == -1) {
        //here we create a new user
        this.createNewUser().then((response) => {
          this.getUsersList();
        }).catch((error) => {
          //
          console.log("error");
        });
      } else {
        //here the user is edited
        this.updateUser().then((response) => {
          this.getUsersList();
        }).catch((error) => {
          //
          console.log("error");
          console.log(error);
        });
      }
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

  createNewUser() {
    return new Promise((resolve, reject) => {
      if (this.validateNewUserData()) {
        this.apiDataService.createUser(this.selectedUser).then((response: ServerMessage) => {
          if (response.error == false) {
            this.utilitiesService.showSuccessToast(response.message, "Éxito");
            this.closeAddUserBtn.nativeElement.click();
            this.selectedUser = new User();
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
        reject("Error en validacions")
      }

    })
  }

  updateUser() {
    return new Promise((resolve, reject) => {
      if (this.validateUpdatedUserData()) {
        this.apiDataService.updateUser(this.selectedUser).then((response: ServerMessage) => {
          if (response.error == false) {
            this.utilitiesService.showSuccessToast(response.message, "Éxito");
            this.closeEditUserBtn.nativeElement.click();
            this.selectedUser = new User();
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

  selectUserForDelete(user : User){
    this.selectedUser = JSON.parse(JSON.stringify(user));
  }

  confirmDelete(){
    this.apiDataService.deleteUser(this.selectedUser.idUser.toString()).then((response: ServerMessage) => {
      if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
        this.getUsersList();
        this.selectedUser = new User();
        this.closeDeleteUserBtn.nativeElement.click();
      } else {
        this.utilitiesService.showErrorToast(response.message, "Error");
      }
    }).catch((error) => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("A ocurrido un error", "Error");
    });
  }


}
