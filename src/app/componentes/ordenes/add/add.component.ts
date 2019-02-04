import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { AppComponent } from 'src/app/app.component';
import { OrdenesService } from 'src/app/services/ordenes/ordenes.service';
import { DialogoComponent } from '../../dialogo/dialogo.component';
import { Product } from 'src/app/views/product/product';
import { ProductsService } from 'src/app/services/products/products.service';
import { DatatableComponent } from '../../datatable/datatable.component';
import { Producto } from 'src/app/views/product/producto';
import { MatSnackBar } from '@angular/material';
import { forkJoin } from 'rxjs';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

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

  @ViewChild('file') file: ElementRef;
  public files: Set<File> = new Set();

  private aprobadores: [{ 'id' }] = [{ id: 0 }];
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
  uploading: boolean = false;
  aprobador = 0;
  progressUpload;

  @ViewChild("dialog") dialog: DialogoComponent;
  private CentersCost: [];
  /* Notifique at current component of the isntance of this class component */
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  @Input() progress: number = 1;
  displayedColumns: string[] = [];
  DefColumns: string[] = ["ID_TEMP", "______#______", "Cantidad", "Descripción", "Codigo_wo",
    "Centro_Costo", "Proveedor", "PN_Proveedor", "Fabricante", "PN_Fabricante", "Prioridad", "Fecha_Limite", "Comentarios", "Acciones"];
  TableData: [{}] = [{}];
  /*INSTANCE TO DATATABLE */
  @ViewChild("datatable") datatable: DatatableComponent;
  ItemsSelected: boolean = false;
  status_products:boolean = false;
  ItemSelectionArray: [] = [];
  private products:any;

  constructor(private service: OrdenesService, private serviceProducts: ProductsService, 
    private app_component: AppComponent, private snackBar: MatSnackBar,private notifications_service:NotificationsService ) { }

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

    this.aprobador = (typeof this.aprobadores != 'undefined' && typeof this.aprobadores != 'undefined' ? this.aprobadores[0]['Id'] : 0)

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

  ModalNewOrder(edit: boolean, id?: number): void {
    let title = "Nuevo Producto REQ #" + this.N_Order;
    let action = 'NewProduct';
    let product = {
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
    };

    if (edit) {

      /**
     * check if isset product temp
     */
      this.serviceProducts.getTemProduct(id)
        .subscribe((producto: Producto) => {

          producto = producto["data"][0];

          title = `Editar Producto - ${producto['description']}`;
          action = "UpdateProductTemp";
          let cc = producto['cost_centre'];
          if (typeof producto['Comentarios'] != 'undefined') {
            delete producto['Comentarios'];
          }

          this.dialog.OpenDialog(
            {
              'action': action,
              'title': title,
              "rows": producto["comments"].split(/\r\n|\r|\n/).length,
              'CentreCoste': cc.substr(0, 2),
              'subCentreCoste': cc.substr(2, 3),
              "centers_cost": this.CentersCost,
              "product": producto
            }, 2
          );

        }, (error) => {
          console.error("Ha habido error al intentar consultar el producto #" + id)
        })
    } else {
      this.dialog.OpenDialog(
        {
          'action': action,
          'title': title,
          "rows": 5,
          "centers_cost": this.CentersCost,
          "product": product
        }, 2
      );
    }


  }

  uploadProducts(): void {
    this.app_component.setProgressSpinner(true);
    this.progress = 1;
    this.uploading = true;
    const file: File = this.file.nativeElement.files[0];

    this.file.nativeElement.value = '';

    this.progress = 10;
    // start the upload and save the progress map
    this.serviceProducts._UploadFile(file, { "purchase_request_id": this.N_Order })
      .subscribe((data) => {
        this.progress = 100;
        this.uploading = false;
        this.showMessaje("Productos subidos Correctamente.");
        this.app_component.setProgressSpinner(false);
        this.allTempProducts();
      }, (error) => {
        console.error("Ha habido error al intentar subir el archivo.")
      });

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
      this.saveTemProduct(options, false);
    } if (options['action'] == "UpdateProductTemp") {
      //update Product Temp
      this.saveTemProduct(options, true);
    } else if (options['action'] == "edit") {
      //save new Product Temp
      this.ModalNewOrder(true, options['data']);
    }
    else if (options['action'] == "remove") {
      //save new Product Temp
      this.removeProduct(parseInt(options['data']));
    } else if (options['action'] == 'RemoveTempProduct') {
      let items = "";

      if (typeof options['data']['json']['id'] != 'undefined') {
        items = options['data']['json']['id']
      } else {
        let i = 0;
        options['data']['json'].forEach(element => {
          let split = ',';
          if (i + 1 == options['data']['json'].length) {
            split = "";
          }
          items += `${element}${split}`;
          i++;
        });
      };

      let products: [{ description: string }] = [{ description: options['data']['json'] }];

      if (typeof options['data']['Items'] != 'undefined' && options['data']['Items'].length > 0) {

        products.pop();

        options['data']['Items'].forEach(element => {
          products.push({ description: element });
        });
      } else {
        products = [{ description: options['data']['json']["description"] }];
      }

      this._removed_product(items, products);
    }
    else if (options['action'] == 'Items_selection') {

      this.ItemsSelected = options['data'].length > 0;
      this.ItemSelectionArray = options['data'];
    }
  }

  CrearNuevaOrden() {
    this.showMessaje("Mensaje 1")
    console.log(this.products)
  }

  private _removed_product(id: string, products: [{}]) {

    this.serviceProducts.removeTemProduct(id)
      .subscribe((data) => {

        this.progress = 20;
        let index_clases: string[] = ['5', '10', '15', '20','25','30','35','40','45','50'];
        let i: number = 0, m: number = 0;

        products.forEach(product => {
          this.progress += 1;

          let classe: string = 'snack-Bar-' + index_clases[m];
          if (i <= 0 && products.length <= 1) {
            classe = '';
          }

          this.Show_Messaje_Multiple(`Producto Eliminado ${product['description']}.`, classe);
          i++;
          m++;
          if (m == index_clases.length) {
           // console.log("reseteada ",index_clases.length)
            m = 0;
          }
        });
        this.allTempProducts();

      }, (error) => {
        console.error("Ha habido error al intentar Eliminar el producto #" + id)
      })
  }

  private Show_Messaje_Multiple(message:string,classe?:string) {
    this.notifications_service.show(message,"",{duration:1000,panelClass:classe});
  }

  private showMessaje(message: string, clase?: string[] | string, duracion?: number, callback?: Function,new_messaje?:boolean) {

    let duration: number = 1000;
    let _clase: string | string[] = ['clase'];

    if (duracion) {
      duration = duracion;
    }

    if (clase) {
      _clase = clase;
    }
    let snackBar= this.snackBar;
    if(new_messaje){
      //snackBar = MatSnackBar;
    }
    snackBar.open(message, "Aceptar", {
      duration: duration,
      panelClass: _clase
    });
    if (callback) {
      this.snackBar._openedSnackBarRef.afterDismissed().subscribe(() => {
        callback();
      });
    }

  }

  private setTempProducts(data: any, error: boolean) {
    this.progress = 80;
   if(data['data']==-1){
     this.status_products = false;
      this.products = []      
    } else{
      this.status_products = true;
      this.products = data['data'];
    }  

    this.app_component.setProgressSpinner(false);
    this.app_component.setTitle(this.Title);

    if (error) {
      console.log("Error allTempProducts")
      this.setDatatable(data, error);
    } else {
      this.setDatatable(data, error);
    }
    this.datatable.ClearSelected();
    this.ItemSelectionArray = [];
    this.ItemsSelected = false;
  }

  removeProduct(id: number): void {
    /**
     * check if isset product temp
     */
    this.serviceProducts.getTemProduct(id)
      .subscribe((producto: Producto) => {

        producto = producto["data"][0];
        this.dialog.OpenDialog(
          {
            json: producto,
            'action': 'RemoveTempProduct',
            title:
              `Estas seguro de eliminar este producto ${producto['description']}`
          }, 1);
      }
        , (error) => {
          console.error("Ha habido error al intentar consultar el producto #" + id)
        })
  }

  RemoveItemsSelected(): void {
    let items: number[] = [];
    let itemsDescription: string[] = [];
    this.ItemSelectionArray.forEach(element => {
      if (parseInt(element["id"]) > 0) {
        items.push(parseInt(element["id"]))
        itemsDescription.push(element['Descripcion'])
      }
    });
    if (items.length > 0) {
      this.dialog.OpenDialog(
        {
          "json": items,
          "Items": itemsDescription,
          'action': 'RemoveTempProduct',
          "title":
            `Estas seguro de eliminar estos productos`
        }, 1);
    }
  }

  private allTempProducts() {

    this.serviceProducts.getAllProductsTemp(this.N_Order)
      .subscribe((data => {
        this.setTempProducts(data, false)
        // this.showMessaje("Cargado Exitosamente los productos.")
      }
      ), error => this.setTempProducts([], true));
  }

  private saveTemProduct(options: {}, update: boolean) {

    let $product = typeof options['data'] != 'undefined' && typeof options['data']['product'] != 'undefined' ? options['data']['product'] : undefined;
    if ($product) {
      if (typeof $product.fomplus_code == 'object') {
        $product.fomplus_code = $product.fomplus_code.code_wo;
      }

      if ($product.priority_id != 5 && $product.limit_date != '') {
        $product.limit_date = '';
      }

      if ($product.limit_date != '' && typeof $product.limit_date == 'object' && $product.limit_date) {
        console.log($product.limit_date)
        $product.limit_date = this.dateformat($product.limit_date);
      }

      let product: Product = $product;
      product.purchase_request_id = this.N_Order;

      //console.log(product)
      this.serviceProducts.saveTemProduct(product, update)
        .subscribe((data =>
          this.allTempProducts()
        )
          , error => console.log("Error"));
    }

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
