import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { formatDate } from '@angular/common';
import { AppComponent } from 'src/app/app.component';
import { OrdenesService } from 'src/app/services/ordenes/ordenes.service';
import { DialogoComponent } from '../../dialogo/dialogo.component';
import { Product } from 'src/app/views/product/product';
import { ProductsService } from 'src/app/services/products/products.service';
import { DatatableComponent } from '../../datatable/datatable.component';

interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'purch-req-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements AfterViewInit {

  today = new Date();
  Title: string = "Crear Orden de Compra";
  N_Order: string = "";
  Date_Order: string = formatDate(this.today, 'dd-MM-yyyy', 'en-US', '+0530');

  private aprobadores: [] = [];
  actions: any = {
    "id": {
      "action": true,
      "edit": true,
      "remove": true
    },
    "limit_date": {
      mrender: function (data) {
        return data == "0000-00-00" ? "" : data;
      }
    }
  };

  aprobador = 0;
  @ViewChild("dialog") dialog: DialogoComponent;
  private CentersCost: [];
  /* Notifique at current component of the isntance of this class component */
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  @Input() progress: number = 1;
  displayedColumns: string[] = [];
  DefColumns: string[] = ["ID_TEMP","______#______", "Cantidad", "Descripción", "Codigo_wo", 
  "Centro_Costo", "Proveedor","PN_Proveedor","Fabricante","PN_Fabricante","Prioridad","Fecha_Limite","Comentarios","Acciones"];
  TableData: [{}] = [{}];
  /*INSTANCE TO DATATABLE */
  @ViewChild("datatable") datatable: DatatableComponent;

  constructor(private service: OrdenesService, private serviceProducts: ProductsService, private app_component: AppComponent) { }

  ngAfterViewInit() {

    this.service.getNextOrder()
      .subscribe((data =>
        this.setNReq(data)
      ), error => console.log("Error"));

  }

  setNReq(data: any): void {
    this.N_Order = data["data"][0]["next"];
    this.service.getAprobers()
      .subscribe((data =>
        this.setAprobers(data)
      )
        , error => console.log("Error"));
  }
  setAprobers(data): void {
    this.aprobadores = data["data"]
    this.aprobador = this.aprobadores["0"]['Id']

    this.getCenterCost();
    this.Title += " #" + this.N_Order;
    this.action('updateSpinner', { status: false });
    this.progress = 20;
    this.allTempProducts();

  }

  private getCenterCost(): void {
    this.service.getCentersCoste()
      .subscribe((data =>
        this.CentersCost = data
      )
        , error => console.log("Error getCenterCost"));
  }

  ModalNewOrder(): void {
    this.dialog.OpenDialog(
      {
        'action': 'NewProduct',
        'title': "Nuevo Producto REQ #" + this.N_Order,
        "centers_cost": this.CentersCost,
        "product": {
          "fomplus_code": "",
          "description": "",
          "manufacturer": "",
          "part_number": "",
          "provider": "",
          "pn_provider": "",
          "qty": "",
          "cost_centre": "",
          "priority_id": "",
          "limit_date": "",
          "comments": ""
        }
      }, 2
    );
  }

  private dateformat(date: Date): string {

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;

  }

  onNotify(options: {}): void {

    console.log("onNotify : Add Order Component", options)
    if (options['action'] == "NewProduct") {
      //save new Product Temp
      this.saveTemProduct(options);
    }
  }
  private setTempProducts(data: any, error: boolean) {
    this.progress = 80;
    this.app_component.setProgressSpinner(false);
    this.app_component.setTitle(this.Title);

    if (error) {
      console.log("Error allTempProducts")
      this.setDatatable(data, true);
    } else {
      this.setDatatable(data, false);
    }

  }


  private allTempProducts() {

    this.serviceProducts.getAllProductsTemp(this.N_Order)
      .subscribe((data =>
        this.setTempProducts(data, false)
      ), error => this.setTempProducts([], true));
  }

  private saveTemProduct(options: {}) {

    let $product = options['data']['product'];
    if (typeof $product.fomplus_code == 'object') {
      $product.fomplus_code = $product.fomplus_code.code_wo;
    }

    if ($product.limit_date != '') {
      $product.limit_date = this.dateformat($product.limit_date);
    }

    let product: Product = $product;
    product.purchase_request_id = this.N_Order;

    //console.log(product)
    this.serviceProducts.saveTemProduct(product)
      .subscribe((data =>
        this.allTempProducts()
      )
        , error => console.log("Error"));
  }

  //pasar datos a controller to component parent
  /**
   * 
   * @param action 
   * @param data 
   */
  action(action: string, data: any): void {
    this.notify.emit({ "action": action, "data": data });
  }

  setDatatable(data: any, error: boolean): void {
    this.app_component.setProgress(30);
    this.datatable.options__setDataKey = {
      'data': data,
      'actions': this.actions,
      'columns_header': this.DefColumns,      
      'error': error
    };
    this.datatable.Buttons = false;
    this.datatable._setDataKey(this.datatable.options__setDataKey);
    this.datatable.update(data['data']);
    this.progress = 100;
  }
}
