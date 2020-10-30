import { ServerMessage } from './../../../classes/serverMessage.class';
import { DataSessionService } from './../../../services/dataSession/data-session.service';
import { LogedResponse } from './../../../classes/logedResponse.class';
import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { ApiDataService } from '../../../services/apiData/api-data.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {

  beneficiarys : any[];
  beneficiarysFiltered : any[];
  searchValue : string = "";
  
  constructor(private dataSessionService : DataSessionService, private utilitiesService : UtilitiesService,
    private apiDataService: ApiDataService) { }

  ngOnInit(): void {
    this.beneficiarys = [];

    this.dataSessionService.checkLogin(async (loggedResponse: LogedResponse) => {
      //console.log(loggedResponse);  
      if (this.dataSessionService.user.role != 0 && this.dataSessionService.user.role != 1) {
        this.dataSessionService.logOut();
        this.utilitiesService.showErrorToast("Usuario desconocido.", "Error");
      } else if (this.dataSessionService.user.role == 0 || this.dataSessionService.user.role == 1) {
        //Things to do in this view when user is already logged
        //this.beneficiarysgetBeneficiaryList
        this.getList().then(async (response)=>{
          this.beneficiarys = response;
          this.beneficiarysFiltered = Array.from(this.beneficiarys);
          //console.log(this.beneficiarys);
        });
      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);
      this.dataSessionService.logOut();
    });
  }

  getList() : Promise<any>{
    return new Promise((resolve,reject)=>{
      this.apiDataService.getBeneficiaryList().then(async (response : ServerMessage)=>{
        //console.log(response);
        let data = await response.data;
        let fixedData = [];

        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          let imageBlob = "";
          if (element.haveImage == true) {
            //console.log(this.selectedUser);
            imageBlob = await this.apiDataService.getImage(this.dataSessionService.baseURL.toString() +
              'uploads/beneficiary-image/' + element.idBeneficiary.toString());
          }
          await fixedData.push({
            haveImage: element.haveImage,
            idBeneficiary: element.idBeneficiary,
            lastName: element.lastName,
            motherLastName: element.motherLastName,
            name: element.name,
            imageBlob : imageBlob
          });
        }
        resolve(fixedData);
      }).catch((error)=>{
        console.log("error");
        console.log(error);
        resolve([])
      })
    })
  }

  filterByName(event) {
    let searchValueTemp = event.charAt(0).toLowerCase() + event.slice(1);

    if (this.searchValue == "") {
      this.beneficiarysFiltered = Array.from(this.beneficiarys);
    } else {
      this.beneficiarysFiltered = this.beneficiarys.filter(function (beneficiary) {
        let fixed = beneficiary.name.charAt(0).toUpperCase() + event.slice(1);
        return ( beneficiary.name.toLowerCase() ).includes(searchValueTemp);
      });
    }
  }

}
