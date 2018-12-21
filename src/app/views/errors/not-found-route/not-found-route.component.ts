import { Component, OnInit, AfterContentInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'purch-req-not-found-route',
  templateUrl: './not-found-route.component.html',
  styleUrls: ['./not-found-route.component.css']
})
export class NotFoundRouteComponent implements  AfterContentInit, OnInit{
 

  constructor(private app_component: AppComponent) {
   this.app_component.setProgressSpinner(false); 
  } 
  
  
  ngAfterContentInit(): void {
   // this.app_component.setProgressSpinner(false);
  }

  ngOnInit() {
    //this.app_component.setProgressSpinner(false); 
  } 

}
