import { User } from './../../classes/user.class';
import { Component, AfterViewInit, OnInit, Input } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {


  constructor(public utilitiesService : UtilitiesService) {

  }

  // End open close
  ngOnInit(): void {

  }

  changeClassOpenMenu(){

  }

}
