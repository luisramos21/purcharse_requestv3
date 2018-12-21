import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '../../datatable/datatable.component';
import { OrdenesService } from 'src/app/services/ordenes/ordenes.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-consultas-ordenes',
  templateUrl: './consultas-ordenes.component.html',
  styleUrls: ['./consultas-ordenes.component.css']
})
export class ConsultasOrdenesComponent implements AfterViewInit {


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
  constructor(private service: OrdenesService, private app_component: AppComponent) { }

  ngAfterViewInit() {
    this.service.getOrdenesPendientes()
      .subscribe((data =>
        this.setDatatable(data, false))
        , error => this.setDatatable({ "data": [{}], "KEY": [] }, true));
  }
  DefColumns: string[] = [
    "I_req",
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
    "Id"];

  setDatatable(data: { "data": [{}], "KEY": string[] }, error: boolean): void {
    this.app_component.setProgress(30);

    this.datatable.options__setDataKey = {
      'data': data,
      'actions': this.actions,
      'error': error,
    };

    this.datatable._setDataKey(this.datatable.options__setDataKey);
  }

  onNotify(options: {}): void {
    this.app_component.test();
  }

}
