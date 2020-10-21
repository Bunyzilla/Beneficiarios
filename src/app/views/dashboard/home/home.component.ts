import { Component, OnInit } from '@angular/core';
import { DataSessionService } from '../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { LogedResponse } from '../../../classes/logedResponse.class';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService) { }

  dropdownList = [];
  selectedItems = [];
  dropdownyearSettings :IDropdownSettings ;
  dropdownpersonSettings: IDropdownSettings;
  ngOnInit(): void {
    //console.log(this.dataSessionService.user);
    this.dataSessionService.checkLogin((loggedResponse: LogedResponse) => {
      //console.log(loggedResponse);
      if (this.dataSessionService.user.role != 0 && this.dataSessionService.user.role != 1 ) {
        this.dataSessionService.logOut();
        this.utilitiesService.showErrorToast("Usuario desconocido.", "Error");
      }else if (this.dataSessionService.user.role == 0 || this.dataSessionService.user.role == 1 ) {
        //Things to do in this view when user is already logged
        //console.log("usuerio valido");
        //this.dataSessionService.navigateByUrl("/dashboard/home");
      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);
      this.dataSessionService.logOut();
    });

    this.dropdownyearSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Seleccionar todos',
      unSelectAllText: 'Deseleccionar todos',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.dropdownpersonSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Seleccionar todos',
      unSelectAllText: 'Deseleccionar todos',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

}
