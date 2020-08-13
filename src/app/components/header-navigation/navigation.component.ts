import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { DataSessionService } from '../../services/dataSession/data-session.service';
declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit {

  constructor(public dataSessionService: DataSessionService) {}

  ngAfterViewInit() {}

  logOut(){
    this.dataSessionService.logOut();
  }
}
