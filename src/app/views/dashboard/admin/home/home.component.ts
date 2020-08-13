import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';
import { LogedResponse } from '../../../../classes/logedResponse.class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit,OnInit {
  public users: number = 0;
  public usersToday: number = 0;

  public message: string = '';
  public messages: string[] = [];

  constructor(public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService) { 
      //this.initPage();
    }

  ngAfterViewInit() {
    //this.initPage();
  }

  ngOnInit(): void {
    //this.initPage();
  }

  initPage(){
    //this.dataSessionService.logOut();
    //console.log(this.dataSessionService.user);
    this.dataSessionService.checkLogin((logedResponse: LogedResponse) => {
      //console.log(logedResponse);    
      if (this.dataSessionService.user.role != 0 && this.dataSessionService.user.role != 1 && this.dataSessionService.user.role != 2) {
        this.dataSessionService.logOut();
        this.utilitiesService.showErrorToast( "Usuario desconocido.","Error!");
      } else if (this.dataSessionService.user.role == 0 ) {
        //console.log("es admin");
        
      } else if (this.dataSessionService.user.role == 2 || this.dataSessionService.user.role == 0) {
        this.utilitiesService.showInfoToast("Aun no se cuenta con este servicio.");
        this.dataSessionService.navigateByUrl("/");
      }
    }, (noLoginResponse: LogedResponse) => {
      //console.log(noLoginResponse);
      this.dataSessionService.navigateByUrl("/");
    });
  }
}
