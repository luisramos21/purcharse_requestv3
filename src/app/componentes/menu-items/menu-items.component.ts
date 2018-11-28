import { Component, OnInit,Input ,ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MenuInterface} from '../../views/menu/menu-interface';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.css']
})
export class MenuItemsComponent implements OnInit {

  @Input() items: MenuInterface[]; 

  @ViewChild('childMenu')
   public childMenu;
  
  constructor(public router: Router) {}

  ngOnInit() {
  }

}
