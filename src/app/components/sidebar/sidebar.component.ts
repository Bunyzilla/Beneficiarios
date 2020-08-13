import { User } from './../../classes/user.class';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DataSessionService } from '../../services/dataSession/data-session.service';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: any[];
  userData : User;

  constructor(
    private dataSessionService : DataSessionService
  ) {}

  // End open close
  ngOnInit() {
    this.userData = this.dataSessionService.user;
  }

  // this is for the open close
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }
}
