import { Component, OnInit } from '@angular/core';
import { DataSessionService } from '../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { LogedResponse } from '../../../classes/logedResponse.class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService) { }

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
  }

}
