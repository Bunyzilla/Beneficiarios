import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../services/utilities/utilities.service';
declare var $: any;

@Component({
  selector: 'app-full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {

  constructor(public router: Router, public utilitiesService : UtilitiesService) { }


  ngOnInit() {

  }
}
