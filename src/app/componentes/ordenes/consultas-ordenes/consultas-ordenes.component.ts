import { Component, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DatatableComponent } from '../../datatable/datatable.component';
import { OrdenesService } from 'src/app/services/ordenes/ordenes.service';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
import { MenuItemsComponent } from '../../menu-items/menu-items.component';

@Component({
  selector: 'app-consultas-ordenes',
  templateUrl: './consultas-ordenes.component.html',
  styleUrls: ['./consultas-ordenes.component.css']
})
export class ConsultasOrdenesComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    
  }


  Title: string = "Ordenes - ";
  displayedColumns: string[] = [];
  TableData: [{}] = [{}];
  /*INSTANCE TO DATATABLE */
  @ViewChild("datatable") datatable: DatatableComponent;

  actions: any = {
    "Id": {
      "action": true,
      "edit": true,
      "remove": true,
      "view": true,
      "all": true
    }
  };
  constructor(private service: OrdenesService, private  app_component: AppComponent, private router: Router) {  }

  ngAfterContentInit() {
    
    switch (this.router.url) {
      case "/ordenes_pendientes":
        this.setTitle("Ordenes Pendientes");
        this.service.getOrdenesPendientes()
          .subscribe((data =>
            this.setDatatable(data, false))
            , error => this.setDatatable({ "data": [{}], "KEY": [] }, true));
        break;

      case "/ordenes_aprobadas":
        this.setTitle("Ordenes Aprobadas");
        this.service.getOrdenesAprobadas()
          .subscribe((data =>
            this.setDatatable(data, false))
            , error => this.setDatatable({ "data": [{}], "KEY": [] }, true));
        break;
      default:        
        this.setTitle("NO Controller Ordernes");
        break;
    }


  }

  private setTitle(title: string): void {
    this.Title = title;
    this.app_component.title = title;    
  }

  DefColumns: string[] = [
    //"I_req",
    "N_req", 
    "Cant",
    "Descripcion",
    "Codigo_wo",
    "Centro_Costo",
    "Proveedor",
    "PN_Proveedor",
    "Fabricante",
    "PN_Fabricante",
    "Prioridad",
    "F_requi",
    "Usuario",
    "Observaciones",
    "Acciones"];

  setDatatable(data: { "data": [{}], "KEY": string[] }, error: boolean): void {
    this.app_component.setProgress(30);

    this.datatable.options__setDataKey = {
      'data': data,
      'columns_header': this.DefColumns,    
      'RemoveIndexs': [0],  
      'actions': this.actions,
      'error': error,
    };

    this.datatable._setDataKey(this.datatable.options__setDataKey);
  }

  onNotify(options: {}): void {
    if(options['action']=="updateSpiner")
    console.log(options)
  }

}
