import { Beneficiary } from './../../../classes/beneficiary.class';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute } from '@angular/router';
import { DataSessionService } from '../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { ApiDataService } from '../../../services/apiData/api-data.service';
import { LogedResponse } from '../../../classes/logedResponse.class';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ServerMessage } from '../../../classes/serverMessage.class';
import { EconomicStudyForm, EvidenceImages } from '../../../classes/economicStudyForm.class';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  selectedBeneficiary: Beneficiary;

  selectedForm : EconomicStudyForm;
  imagesFiltered : EvidenceImages[];
  typeImageSelected : number;

  //variables para el modal de editar beneficiario
  modelCustomerBirthDay: NgbDateStruct;
  date: { year: number, month: number, day: number };

  source: string = '';
  selectedFile: any;

  // Emit an event when a file has been picked. Here we return the file itself
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  @ViewChild("btnCancelEdit") btnCancelEdit: ElementRef;
  @ViewChild("btnConfirmDelete") btnConfirmDelete: ElementRef;

  constructor( private _location: Location, private activatedRoute: ActivatedRoute, public dataSessionService: DataSessionService, public utilitiesService: UtilitiesService,
    private apiDataService: ApiDataService) {
    //Subscription Method
    this.activatedRoute.paramMap.subscribe(params => {
      this.dataSessionService.checkLogin(async (loggedResponse: LogedResponse) => {
        //console.log(loggedResponse);  
        if (this.dataSessionService.user.role != 0 && this.dataSessionService.user.role != 1) {
          this.dataSessionService.logOut();
          this.utilitiesService.showErrorToast("Usuario desconocido.", "Error");
        } else if (this.dataSessionService.user.role == 0 || this.dataSessionService.user.role == 1) {
          //Things to do in this view when user is already logged
          let idBeneficiary: number = parseInt(params.get('idBeneficiary'));

          if (idBeneficiary == null || idBeneficiary == undefined) {
            this.dataSessionService.navigateByUrl("/dashboard/records");
          } else {
            this.loadData(idBeneficiary);
          }
        }
      }, (noLoginResponse: LogedResponse) => {
        //console.log(noLoginResponse);
        this.dataSessionService.logOut();
      });
    });
  }
  ngOnInit(): void {
    this.selectedBeneficiary = new Beneficiary();
    this.selectedForm = new EconomicStudyForm();
    this.imagesFiltered = [];
    this.typeImageSelected = 0;
  }

  loadData(idBeneficiary: number) {
    this.selectedBeneficiary = new Beneficiary();
    this.selectedForm = new EconomicStudyForm();
    this.typeImageSelected = -1;
    
    //se carga el objeto con la información de la vista
    this.dataSessionService.getBeneficiary(idBeneficiary, async () => {
      //se carga el objeto para el modal de editar;
      this.selectedBeneficiary = JSON.parse(JSON.stringify(this.dataSessionService.openBeneficiary));

      this.selectedBeneficiary.birthDay = new Date(this.selectedBeneficiary.birthDay);
      this.selectedBeneficiary.createDate = new Date(this.selectedBeneficiary.createDate);
      if (this.selectedBeneficiary.haveImage == true) {
        //console.log(this.selectedUser);
        this.selectedBeneficiary.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
          'uploads/beneficiary-image/' + this.selectedBeneficiary.idBeneficiary.toString());
      }

      this.modelCustomerBirthDay = {
        year: this.selectedBeneficiary.birthDay.getFullYear(),
        month: parseInt(this.selectedBeneficiary.birthDay.toLocaleDateString("es-MX", { month: "2-digit" })),
        day: parseInt(this.selectedBeneficiary.birthDay.toLocaleDateString("es-MX", { day: "2-digit" }))
      }

      for (let index = 0; index < this.dataSessionService.actualForms.length; index++) {
        for (let indexx = 0; indexx < this.dataSessionService.actualForms[index].family.length; indexx++) {
          this.dataSessionService.actualForms[index].family[indexx].birthDay = 
            new Date(this.dataSessionService.actualForms[index].family[indexx].birthDay);
        }

        for (let indexx = 0; indexx < this.dataSessionService.actualForms[index].images.length; indexx++) {
          let fixElement : EvidenceImages = new EvidenceImages();
          fixElement.idEvidenceImages = this.dataSessionService.actualForms[index].images[indexx].idEvidenceImages;
          fixElement.idEconomicStudyForm= this.dataSessionService.actualForms[index].images[indexx].idEconomicStudyForm; 
          fixElement.type = this.dataSessionService.actualForms[index].images[indexx].type;
          fixElement.source  = "";
          fixElement.selectedFile = "";
          fixElement.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
          'uploads/form-image/'+fixElement.idEconomicStudyForm+'/'+fixElement.idEvidenceImages+'/');
          this.dataSessionService.actualForms[index].images[indexx] = fixElement;
        }
      }

      this.filterImageByType(this.typeImageSelected);
      
      //console.log(this.dataSessionService.actualForms);
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
    this.selectedBeneficiary.haveImage = false;
  }

  async cancelEdit() {
    this.selectedBeneficiary = JSON.parse(JSON.stringify(this.dataSessionService.openBeneficiary));

    this.selectedBeneficiary.birthDay = new Date(this.selectedBeneficiary.birthDay);
    this.selectedBeneficiary.createDate = new Date(this.selectedBeneficiary.createDate);
    if (this.selectedBeneficiary.haveImage == true) {
      //console.log(this.selectedUser);
      this.selectedBeneficiary.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
        'uploads/beneficiary-image/' + this.selectedBeneficiary.idBeneficiary.toString());
    }

    this.modelCustomerBirthDay = {
      year: this.selectedBeneficiary.birthDay.getFullYear(),
      month: parseInt(this.selectedBeneficiary.birthDay.toLocaleDateString("es-MX", { month: "2-digit" })),
      day: parseInt(this.selectedBeneficiary.birthDay.toLocaleDateString("es-MX", { day: "2-digit" }))
    }
    //console.log(this.selectedBeneficiary);
  }


  validateNewBeneficiaryData(): Boolean {
    if (this.selectedBeneficiary.name.length < 8) {
      this.utilitiesService.showErrorToast("El nombre del usuario debe ser mayor de 8 caracteres", "Nombre invalido");
      return false;
    } else {
      return true;
    }
  }

  save() {
    //BirthDay Fix
    this.selectedBeneficiary.birthDay = new Date(this.modelCustomerBirthDay.year + "-" + this.modelCustomerBirthDay.month + "-" + this.modelCustomerBirthDay.day);
    //console.log(this.selectedBeneficiary);
    //Se elimino la imagen
    if (!this.selectedBeneficiary.haveImage && this.dataSessionService.openBeneficiary.haveImage && this.source.length == 0 && this.selectedBeneficiary.idBeneficiary != -1) {
      console.log("Elimino imagen");
      //Loading de carga
      this.updateBeneficiary().then((response: ServerMessage) => {
        //primero se actualiza la info del usuario para luego subir su imagen
        this.apiDataService.deleteImageBeneficiary(response.data.idBeneficiary).then((response: any) => {
          if (response.error == true) {
            this.utilitiesService.showSuccessToast(response.message, "Éxito");
            console.log("error");
            console.log(response);
          } else if (response.error == false) {
            //recargar la info del usuario
            this.cancelImage();
            this.loadData(this.dataSessionService.openBeneficiary.idBeneficiary);
            this.btnCancelEdit.nativeElement.click();
          }

        }).catch((error) => {
          console.log("error");
          console.log(error);
          this.utilitiesService.showErrorToast("A ocurrido un error", "Éxito");
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
      this.updateBeneficiary().then((response: ServerMessage) => {
        //primero se actualiza la info del usuario para luego subir su imagen
        this.uploadImage(this.selectedFile, "" + response.data.idBeneficiary).then((response: any) => {
          //recargar la info del usuario
          this.cancelImage();
          this.loadData(this.dataSessionService.openBeneficiary.idBeneficiary);
          this.btnCancelEdit.nativeElement.click();
        }).catch((error) => {
          console.log("error");
          console.log(error);
          this.utilitiesService.showErrorToast("A ocurrido un error", "Éxito");
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
      this.updateBeneficiary().then(async (response: ServerMessage) => {
        //console.log(response);
        //recargar la info del usuario
        this.cancelImage();
        this.loadData(this.dataSessionService.openBeneficiary.idBeneficiary);
        this.btnCancelEdit.nativeElement.click();
      }).catch((error) => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("A ocurrido un error", "Éxito");
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

  updateBeneficiary() {
    return new Promise((resolve, reject) => {
      if (this.validateNewBeneficiaryData()) {
        this.apiDataService.updateBeneficiary(this.selectedBeneficiary).then((response: ServerMessage) => {
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

  filterImageByType(type : number){
    this.imagesFiltered = [];
    this.imagesFiltered = this.selectedForm.images.filter((image : EvidenceImages)=>{
      return image.type == type;
    })
  }

  deleteBeneficiary(){
    this.apiDataService.deleteBeneficiaryData(this.selectedBeneficiary.idBeneficiary).then((response: ServerMessage) => {
      //console.log(response);
      
      if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
        this.btnConfirmDelete.nativeElement.click();
        this.backClicked();
      } else if (response.error == true) {
        this.utilitiesService.showErrorToast(response.message, "Error");
        console.log(response);
      }
    }).catch((error) => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("A ocurrido un error", "Error");
    });
  }

  backClicked() {
    this._location.back();
  }

}
