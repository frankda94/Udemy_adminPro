import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../services/shared/sidebar.service';

declare function customInitFuncions();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ],
})
export class PagesComponent implements OnInit {

  constructor( private sidebarService: SidebarService) { }

  ngOnInit() {
    customInitFuncions();
    this.sidebarService.cargarMenu();
  }

}
