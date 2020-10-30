import { FamilyBeneficiarys, EvidenceImages } from './../../../classes/economicStudyForm.class';
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, Output, EventEmitter } from '@angular/core';
import { EconomicStudyForm } from '../../../classes/economicStudyForm.class';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { DataSessionService } from '../../../services/dataSession/data-session.service';
import { ApiDataService } from '../../../services/apiData/api-data.service';
import { ServerMessage } from '../../../classes/serverMessage.class';
import { LogedResponse } from '../../../classes/logedResponse.class';

@Component({
  selector: 'app-add-exp',
  templateUrl: './add-exp.component.html',
  styleUrls: ['./add-exp.component.scss']
})
export class AddExpComponent implements OnInit {

  newEconomicStudyForm: EconomicStudyForm;
  newFamily: FamilyBeneficiarys;

  @ViewChild("btnCloseAddFamily") btnCloseAddFamily: ElementRef;

  //variables para el modal de editar beneficiario
  modelCustomerBirthDay: NgbDateStruct;
  date: { year: number, month: number, day: number };

  @ViewChild("btnOpenModalEvidences") btnOpenModalEvidences: ElementRef;

  //images
  // Emit an event when a file has been picked. Here we return the file itself
  @Output() onChangeeStudio: EventEmitter<File> = new EventEmitter<File>();
  @Output() onChangeeBeneficiary: EventEmitter<File> = new EventEmitter<File>();
  @Output() onChangeeHouse: EventEmitter<File> = new EventEmitter<File>();
  @Output() onChangeeVouchers: EventEmitter<File> = new EventEmitter<File>();

  constructor(public utilitiesService: UtilitiesService, private _location: Location, public dataSessionService: DataSessionService,
    private apiDataService: ApiDataService) { }

  async ngOnInit() {
    this.newEconomicStudyForm = new EconomicStudyForm();
    this.newFamily = new FamilyBeneficiarys();

    //await this.utilitiesService.sleep(1000);
    //this.btnOpenModalEvidences.nativeElement.click();

    
    this.dataSessionService.checkLogin(async (loggedResponse: LogedResponse) => {
      //console.log(loggedResponse);  
      if (this.dataSessionService.user.role != 0 && this.dataSessionService.user.role != 1) {
        this.dataSessionService.logOut();
        this.utilitiesService.showErrorToast("Usuario desconocido.", "Error");
      } else if (this.dataSessionService.user.role == 0 || this.dataSessionService.user.role == 1) {
        //Things to do in this view when user is already logged
        if (this.dataSessionService.openBeneficiary.idBeneficiary == -1) {
          this.backClicked();
        }
        
      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);
      this.dataSessionService.logOut();
    });

  }

  openAddFamily() {
    this.newFamily = new FamilyBeneficiarys();
    this.newFamily.birthDay = new Date(this.newFamily.birthDay);

    this.modelCustomerBirthDay = {
      year: this.newFamily.birthDay.getFullYear(),
      month: parseInt(this.newFamily.birthDay.toLocaleDateString("es-MX", { month: "2-digit" })),
      day: parseInt(this.newFamily.birthDay.toLocaleDateString("es-MX", { day: "2-digit" }))
    }
  }

  addFamily() {
    let data: FamilyBeneficiarys = JSON.parse(JSON.stringify(this.newFamily))
    //BirthDay Fix
    data.birthDay = new Date(this.modelCustomerBirthDay.year + "-" + this.modelCustomerBirthDay.month + "-" + this.modelCustomerBirthDay.day);
    this.newEconomicStudyForm.family.push(data);
    this.newFamily = new FamilyBeneficiarys();
    this.btnCloseAddFamily.nativeElement.click();
  }

  deleteFamily(index) {
    //console.log(index);
    let tempFamily: FamilyBeneficiarys[] = [];
    for (let indexx = 0; indexx < this.newEconomicStudyForm.family.length; indexx++) {
      if (indexx != index) {
        tempFamily.push(this.newEconomicStudyForm.family[indexx]);
      };
    }

    this.newEconomicStudyForm.family = tempFamily;
  }

  // If the input has changed(file picked) we project the file into the img previewer
  addSource($event: Event, type: number) {
    // We access he file with $event.target['files'][0]
    let file = $event.target['files'][0];
    let reader = new FileReader;
    // TODO: Define type of 'e'
    reader.onload = (e: any) => {
      // Simply set e.target.result as our <img> src in the layout
      let newImage: EvidenceImages = new EvidenceImages();
      newImage.type = type;
      newImage.source = e.target.result;
      if (type == 0) {
        this.onChangeeStudio.emit(file);
      } else if (type == 1) {
        this.onChangeeBeneficiary.emit(file);
      } else if (type == 2) {
        this.onChangeeHouse.emit(file);
      } else if (type == 3) {
        this.onChangeeVouchers.emit(file);
      }

      newImage.selectedFile = file;
      this.newEconomicStudyForm.images.push(newImage);
    };
    // This will process our file and get it's attributes/data
    reader.readAsDataURL(file);
  }

  cancelImage(index) {
    let tempImages: EvidenceImages[] = [];
    for (let indexx = 0; indexx < this.newEconomicStudyForm.images.length; indexx++) {
      if (indexx != index) {
        tempImages.push(this.newEconomicStudyForm.images[indexx]);
      };
    }

    this.newEconomicStudyForm.images = tempImages;
  }

  validateNewBeneficiaryData(): Boolean {
    /* if (this.newEconomicStudyForm.colony.length < 8) {
      this.utilitiesService.showErrorToast("La colonia esta vaciá", "Colonia invalido");
      return false;
    } else {
      return true;
    } */
    return true;
  }

  async save() {
    let formDataToSave : EconomicStudyForm = JSON.parse( JSON.stringify( this.newEconomicStudyForm ) );
    formDataToSave.idBeneficiary = this.dataSessionService.openBeneficiary.idBeneficiary;
    formDataToSave.creationDate = new Date();

    console.log(formDataToSave);

    let images : any[] = [];

    for (let index = 0; index < this.newEconomicStudyForm.images.length; index++) {
      images.push({
        idEconomicStudyForm: -1,
        type: this.newEconomicStudyForm.images[index].type
      });
    }
    formDataToSave.images = images;

    if (this.validateNewBeneficiaryData()) {
      this.apiDataService.createEconomicStudyForm(formDataToSave).then(async (response: ServerMessage) => {
        console.log(response.data.images);

        if (response.error == false) {
          this.utilitiesService.showSuccessToast(response.message, "Éxito");
          //TO DO falta subir las imagenes en este punto
          let resultUploads : any[] = [];
          for (let index = 0; index < response.data.images.length; index++) {
            this.newEconomicStudyForm.images[index].idEvidenceImages= response.data.images[index].idEvidenceImages;
            this.newEconomicStudyForm.images[index].idEconomicStudyForm = response.data.images[index].idEconomicStudyForm,
            this.newEconomicStudyForm.images[index].type = response.data.images[index].type;

            resultUploads.push(await this.uploadImage(
              this.newEconomicStudyForm.images[index].selectedFile, 
              this.newEconomicStudyForm.images[index].idEvidenceImages.toString() , 
              this.newEconomicStudyForm.images[index].idEconomicStudyForm, 
              this.newEconomicStudyForm.images[index].type) );
          }
          console.log(resultUploads);

          this.backClicked();
        } else if (response.error == true) {
          this.utilitiesService.showErrorToast(response.message, "Error");

        }
      }).catch((error) => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("A ocurrido un error", "Error");
      });
    }
  }

  uploadImage(file: any, idEvidenceImages: String , idEconomicStudyForm, type : number) : Promise<ServerMessage> {
    return new Promise((resolve, reject) => {
      var newFileName = idEconomicStudyForm +"-"+ idEvidenceImages + ".jpg";
      let reader = new FileReader;

      try {
        // TODO: Define type of 'e'
        reader.onload = (e: any) => {
          if (type == 0) {
            this.onChangeeStudio.emit(file);
          } else if (type == 1) {
            this.onChangeeBeneficiary.emit(file);
          } else if (type == 2) {
            this.onChangeeHouse.emit(file);
          } else if (type == 3) {
            this.onChangeeVouchers.emit(file);
          }
          const formData = new FormData();
          let image: Blob = new Blob([reader.result], {
            type: file.type
          });
          formData.append('files[]', image, newFileName);
          //Loading de carga
          this.apiDataService.uploadEconomicStudyForm(formData).then((result: ServerMessage) => {
            if (result.error == false) {
              //this.utilitiesService.showSuccessToast(result.message, "Éxito");
              resolve(new ServerMessage(false,"se a subido la imagen con exito",result ) );
            } else {
              this.utilitiesService.showErrorToast(result.message, "Error");
              reject(new ServerMessage(true,"A ocurrido un error subiendo la imagen",result) );
            }
          }, (error) => {
            //this.utilitiesService.showNotification(0, "A ocurrido un error.", 5000, () => { });
            this.utilitiesService.showErrorToast("A ocurrido un error", "Error");
            //this.utilitiesService.closeLoadingMsg();
            reject(new ServerMessage(true,"A ocurrido un error subiendo la imagen",error) );
          });
        };
        // This will process our file and get it's attributes/data
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.log("sin imagen seleccionada");
        reject(new ServerMessage(true,"Sin imagen seleccionada",{ url: "" }) );
      }
    });
  }

  backClicked() {
    this._location.back();
  }
}
