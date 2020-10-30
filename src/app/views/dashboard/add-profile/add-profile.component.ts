import { Beneficiary } from './../../../classes/beneficiary.class';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DataSessionService } from '../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { ApiDataService } from '../../../services/apiData/api-data.service';
import { LogedResponse } from '../../../classes/logedResponse.class';
import { ServerMessage } from '../../../classes/serverMessage.class';

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.scss']
})
export class AddProfileComponent implements OnInit {

  beneficiary: Beneficiary;

  modelCustomerBirthDay: NgbDateStruct;
  date: { year: number, month: number, day: number };
  
  source: string = '';
  selectedFile: any;

  // Emit an event when a file has been picked. Here we return the file itself
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  constructor(public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService,
    private apiDataService: ApiDataService) {
    this.beneficiary = new Beneficiary();
  }

  ngOnInit(): void {
    this.dataSessionService.checkLogin(async (loggedResponse: LogedResponse) => {
      //console.log(loggedResponse);    
      if (this.dataSessionService.user.role != 0 && this.dataSessionService.user.role != 1) {
        this.dataSessionService.logOut();
        this.utilitiesService.showErrorToast("Usuario desconocido.", "Error");
      } else if (this.dataSessionService.user.role == 0 || this.dataSessionService.user.role == 1) {
        //Things to do in this view when user is already logged
        this.cancelImage();
        this.beneficiary = new Beneficiary();

        /* this.beneficiary.idBeneficiary = -1;
        this.beneficiary.name = "luismiguel";
        this.beneficiary.lastName = "ortiz";
        this.beneficiary.motherLastName = "alvarez";
        this.beneficiary.gender = 1;
        this.beneficiary.birthDay = new Date("1994-01-18");
        this.beneficiary.phone1 = "6394740742";
        this.beneficiary.phone2 = "";
        this.beneficiary.civilStatus = 2;
        this.beneficiary.occupation = "Estudiante";
        this.beneficiary.scholarship = 3;
        this.beneficiary.curp = "OIAL940118HCHRLS05";
        this.beneficiary.rfc = "nigungo"; */
        /* this.beneficiary.medicalService = 3;
        this.beneficiary.haveDisability = true;
        this.beneficiary.causeDisability = "lentes";
        this.beneficiary.disabilityTime = "4 años";
        this.beneficiary.haveChronicDisease = false;
        this.beneficiary.chronicDiseaseType = -1;
        this.beneficiary.other = "na"; */
        this.beneficiary.active = true;
        this.beneficiary.haveImage = false;

        this.beneficiary.imageBlob = "";

        this.modelCustomerBirthDay = {
          year: this.beneficiary.birthDay.getFullYear(),
          month: parseInt(this.beneficiary.birthDay.toLocaleDateString("es-MX", { month: "2-digit" })),
          day: parseInt(this.beneficiary.birthDay.toLocaleDateString("es-MX", { day: "2-digit" }))
        }

        /* if (this.userData.haveImage == true) {
          //console.log(this.selectedUser);
          this.userData.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
            'uploads/user-image/' + this.userData.idUser.toString());
        } */
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
    this.beneficiary.haveImage = false;
  }

  validateNewBeneficiaryData(): Boolean {
    if (this.beneficiary.name.length < 8) {
      this.utilitiesService.showErrorToast("El nombre del usuario debe ser mayor de 8 caracteres", "Nombre invalido");
      return false;
    } else {
      return true;
    }
  }

  save() {
    //BirthDay Fix
    this.beneficiary.birthDay = new Date(this.modelCustomerBirthDay.year + "-" + this.modelCustomerBirthDay.month + "-" + this.modelCustomerBirthDay.day);
    console.log(this.beneficiary);
    //Se elimino la imagen
    if (!this.beneficiary.haveImage && this.dataSessionService.user.haveImage && this.source.length == 0 && this.beneficiary.idBeneficiary != -1) {
      console.log("Elimino imagen");
      //Loading de carga
      /* this.createBeneficiary().then((response: ServerMessage) => {
        this.beneficiary = new Beneficiary();

      }).catch((error: ServerMessage) => {
        //
        console.log("error");
      }); */
    }
    //Si se selecciona una imagen
    else if (this.source.length > 0) {
      console.log("imagen diferente");
      //here the user is edited
      this.createBeneficiary().then((response: ServerMessage) => {
        //primero se actualiza la info del usuario para luego subir su imagen
        this.uploadImage(this.selectedFile, "" + response.data.idBeneficiary).then((response: any) => {
          console.log(response);
          
          this.cancelImage();
          this.beneficiary = new Beneficiary();
          this.modelCustomerBirthDay = {
            year: this.beneficiary.birthDay.getFullYear(),
            month: parseInt(this.beneficiary.birthDay.toLocaleDateString("es-MX", { month: "2-digit" })),
            day: parseInt(this.beneficiary.birthDay.toLocaleDateString("es-MX", { day: "2-digit" }))
          }
          this.dataSessionService.navigateByUrl("/dashboard/profile/"+response.data.idBeneficiary);
          //console.log(response);
        }).catch((error) => {
          console.log("error");
          console.log(error);
          this.utilitiesService.showErrorToast("A ocurrido un error","Éxito");
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
      this.createBeneficiary().then((response: ServerMessage) => {
        console.log(response);
        //recargar la info del usuario
        this.beneficiary = new Beneficiary();
        this.modelCustomerBirthDay = {
          year: this.beneficiary.birthDay.getFullYear(),
          month: parseInt(this.beneficiary.birthDay.toLocaleDateString("es-MX", { month: "2-digit" })),
          day: parseInt(this.beneficiary.birthDay.toLocaleDateString("es-MX", { day: "2-digit" }))
        }
        this.dataSessionService.navigateByUrl("/dashboard/profile/"+response.data.idBeneficiary);
      }).catch((error) => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("A ocurrido un error","Éxito");
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
          this.apiDataService.uploadImageBeneficiary(formData).then((result: ServerMessage) => {

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

  createBeneficiary() {
    return new Promise((resolve, reject) => {
      if (this.validateNewBeneficiaryData()) {
        this.apiDataService.createBeneficiary(this.beneficiary).then((response: ServerMessage) => {
          if (response.error == false) {
            this.utilitiesService.showSuccessToast(response.message, "Éxito");

            resolve(response);
          } else if (response.error == true) {
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
