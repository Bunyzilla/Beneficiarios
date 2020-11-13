import { Beneficiary } from './../../../classes/beneficiary.class';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataSessionService } from '../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { LogedResponse } from '../../../classes/logedResponse.class';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Registry, RegistryYear } from '../../../classes/register.class';
import { ApiDataService } from '../../../services/apiData/api-data.service';
import { ExelFilesService } from '../../../services/exelFiles/exel-files.service';
import { ServerMessage } from '../../../classes/serverMessage.class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  selectedYearRecords : RegistryYear[];
  selectedYearRecordsFiltered : RegistryYear[];
  searchValueBeneficiaryRecords : string;

  selectedRegistryYear : RegistryYear;
  newRegistryMonth : Registry;
  selectedRegistryMonth : Registry;
  
  selectedYear : number;
  opcYears : any[];

  //Modal variables
  searchValue : string;
  foundBeneficiarys : Beneficiary[];
  selectedBeneficiary : any;

  @ViewChild('closeModalBtn') closeModalBtn : ElementRef;
  @ViewChild('btnOpenModalSeeRegister') btnOpenModalSeeRegister : ElementRef;

  constructor(private exelFilesService: ExelFilesService,public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService,private apiDataService: ApiDataService) { }

  ngOnInit(): void {
    this.selectedRegistryMonth = new Registry();
    this.selectedYearRecords = [];
    this.selectedYearRecordsFiltered = Array.from(this.selectedYearRecords);
    this.selectedRegistryYear = new RegistryYear();
    this.newRegistryMonth = new Registry();
    this.searchValue = "";
    this.foundBeneficiarys = [];
    this.selectedBeneficiary = new Beneficiary();
    //console.log(this.dataSessionService.user);
    this.selectedYear = new Date().getFullYear();
    this.opcYears = [];

    for (let index = this.selectedYear; index > 1950; index--) {
      this.opcYears.push(index);
    }



    this.dataSessionService.checkLogin((loggedResponse: LogedResponse) => {
      //console.log(loggedResponse);
      if (this.dataSessionService.user.role != 0 && this.dataSessionService.user.role != 1 ) {
        this.dataSessionService.logOut();
        this.utilitiesService.showErrorToast("Usuario desconocido.", "Error");
      }else if (this.dataSessionService.user.role == 0 || this.dataSessionService.user.role == 1 ) {
        //Things to do in this view when user is already logged
        //console.log("usuerio valido");
        //this.dataSessionService.navigateByUrl("/dashboard/home");
        this.getViewData();
      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);
      this.dataSessionService.logOut();
    });
  }

  changeYear(year : number){
    this.selectedYear = year;
    this.getViewData();
  }

  getViewData(){
    this.newRegistryMonth = new Registry();
    this.searchValue = "";
    this.foundBeneficiarys = [];
    this.selectedRegistryYear = new RegistryYear();
    this.selectedBeneficiary = new Beneficiary();
    this.apiDataService.getRegistryListByYear(this.selectedYear).then(async (response: ServerMessage) => {
      if (response.error == false) {
        //this.utilitiesService.showSuccessToast(response.message, "Éxito");
        this.selectedYearRecords = response.data;
        this.selectedYearRecordsFiltered = Array.from(this.selectedYearRecords);
      } else {
        this.utilitiesService.showErrorToast(response.message, "Error");
      }
    }).catch((error) => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("A ocurrido un error", "Error");
    });
  }

  generatePDF(){
    this.exelFilesService.exportRegisterYearAsXLSX(this.selectedYearRecords,this.selectedYear);
  }

  openModalAddRegistry(){
    this.newRegistryMonth = new Registry();
    this.searchValue = "";
    this.foundBeneficiarys = [];
    this.selectedBeneficiary = new Beneficiary();
  }

  async openModalRegistry(registryYear : RegistryYear,registry : Registry){
    this.selectedRegistryMonth = new Registry();
    this.selectedRegistryYear = new RegistryYear();
    
    this.selectedRegistryMonth = registry;
    this.selectedRegistryYear = registryYear;

    if (this.selectedRegistryYear.haveImage == true) {
      //console.log(this.selectedUser);
      this.selectedRegistryYear.imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
        'uploads/beneficiary-image/' + this.selectedRegistryYear.idBeneficiary.toString());
    }
    this.btnOpenModalSeeRegister.nativeElement.click();
  }

  filterByName(event) {
    let searchValueTemp = event.charAt(0).toLowerCase() + event.slice(1);

    if (this.searchValueBeneficiaryRecords == "") {
      this.selectedYearRecordsFiltered = Array.from(this.selectedYearRecords);
    } else {
      this.selectedYearRecordsFiltered = this.selectedYearRecords.filter(function (beneficiaryRecord : RegistryYear) {
        let fixed = beneficiaryRecord.fullName.charAt(0).toUpperCase() + event.slice(1);
        return ( beneficiaryRecord.fullName.toLowerCase() ).includes(searchValueTemp);
      });
    }
  }

  getBeneficiaryCoincidences(event){
    let searchValueTemp = event.charAt(0).toLowerCase() + event.slice(1);

    if (this.searchValue == "") {
      this.foundBeneficiarys = [];
    } else {
      //console.log(searchValueTemp);

      this.apiDataService.getBeneficiaryListByName({nameForSearch : searchValueTemp}).then(async (response: ServerMessage) => {
        //console.log(response);
        
        if (response.error == false) {
          //this.utilitiesService.showSuccessToast(response.message, "Éxito");
          this.foundBeneficiarys = response.data;
          for (let index = 0; index < this.foundBeneficiarys.length; index++) {
            if (this.foundBeneficiarys[index].haveImage == true) {
              //console.log(this.selectedUser);
              this.foundBeneficiarys[index].imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
                'uploads/beneficiary-image/' + this.foundBeneficiarys[index].idBeneficiary.toString());
            }
          }
          
          
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

  save(){
    this.newRegistryMonth.year = this.selectedYear;
    this.newRegistryMonth.idBeneficiary = this.selectedBeneficiary.idBeneficiary;
    //console.log(this.newRegistryMonth);
    this.apiDataService.createRegistry(this.newRegistryMonth).then(async (response: ServerMessage) => {
      //console.log(response);
      if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Éxito");
        this.closeModalBtn.nativeElement.click();
        this.getViewData();
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
