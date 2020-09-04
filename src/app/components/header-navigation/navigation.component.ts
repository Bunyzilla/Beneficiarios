import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { DataSessionService } from '../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../services/utilities/utilities.service';
declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit {



  constructor(public dataSessionService: DataSessionService, public utilitiesService : UtilitiesService) {}

  ngAfterViewInit() {}

  logOut(){
    this.dataSessionService.logOut();
  }
}
