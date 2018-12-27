import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '../datatable/datatable.component';
import { OrdenesService } from 'src/app/services/ordenes/ordenes.service';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.css']
})
export class OrdenesComponent implements AfterViewInit {

  Title: string = "Ordenes de Compra";
  displayedColumns: string[] = [];
  TableData: [{}] = [{}];

  /*INSTANCE TO DATATABLE */
  @ViewChild("datatable") datatable: DatatableComponent;

  actions: any = {
    "Id": {
      "action": true,
      "edit": false,
      "remove": true,
      "view": true,
      "all": false,
      "modal":true,
      mrender: function (data) {
        return data;
      }
    },
    "Estado": {
      mrender: function (data) {
        return data == 1 ? "Completado" : "Incompleto";
      }
    }
  };



  DefColumns: string[] = ["No.", "Usuario", "Fecha Requisición", "Estado", "Acciones"];

  constructor(private service: OrdenesService, private app_component: AppComponent) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.service.getOrdenes()
      .subscribe((data =>
        this.setDatatable(data, false))
        , error => this.setDatatable([], true));
    }, 1000);
    
  }

  setDatatable(data: any, error: boolean): void {
    this.app_component.setProgress(30);
    this.datatable.options__setDataKey = {
      'data': data,
      'columns_header': this.DefColumns,
      'actions': this.actions,
      'error': error
    };
    this.datatable.Buttons = false;
    this.datatable.ButtonsArray = [
      {
        "title": 'Crear Nueva Orden',
        "action": null,
        "type": "link",
        "url": "/ordenes/add"
      }
    ]
    this.datatable._setDataKey(this.datatable.options__setDataKey);
  }

  onNotify(options: {}): void {
    console.log(options)
    this.app_component.test();
  }

}
