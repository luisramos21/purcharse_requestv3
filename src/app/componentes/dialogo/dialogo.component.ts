import { Component, OnInit, Inject, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatSelect } from '@angular/material';
import { AppComponent } from 'src/app/app.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { OrdenesService } from 'src/app/services/ordenes/ordenes.service';
import { isNgTemplate } from '@angular/compiler';




@Component({
  selector: 'app-dialog',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.css']
})

export class DialogoComponent implements OnInit {

  Template: any = [DialogoOverview, DialogoConfirm, DialogNewOrder];
  TemplateOptions = [
    {
      "minWidth": "40%",
      "minHeight": "80%",
      "class": "custom-modalbox"
    },
    {
      "minWidth": "20%",
      "minHeight": "10%",
      "class": ""
    },
    {
      "minWidth": "40%",
      "minHeight": "80%",
      "class": "custom-modalbox"
    }
  ]

  /* Notifique at current component of the isntance of this class component */
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();

  constructor(public dialog: MatDialog, private AppComp: AppComponent) { }

  ngOnInit() {
  }

  @Input()
  OpenDialog(options: any, option?: number): void {
    if (!option) {
      option = 0;
    }

    const dialogRef = this.dialog.open(this.Template[option], {
      minWidth: this.TemplateOptions[option]["minWidth"],
      minHeight: this.TemplateOptions[option]["minHeight"],

      disableClose: true,
      panelClass: this.TemplateOptions[option]["class"],
      data: options
    });

    dialogRef.afterClosed().subscribe(result => {
      this.notify.emit({ "action": options['action'], "data": result });
    })
  }

}

@Component({
  selector: 'app-dialog-overview',
  templateUrl: './dialogo-overview.component.html'
})
export class DialogoOverview {

  constructor(
    private dialogRef: MatDialogRef<DialogoOverview>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  close(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialogo-confirm.component.html'
})
export class DialogoConfirm {

  constructor(
    private dialogRef: MatDialogRef<DialogoConfirm>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  close(): void {
    this.dialogRef.close();
  }
}

export interface wo {
  code_wo: string;
  descripction: string;
}

@Component({
  selector: 'dialog-new-order',
  templateUrl: '../ordenes/add/add.product.html',
  providers: [OrdenesService, MatSnackBar]
})
export class DialogNewOrder {


  myControl = new FormControl();
  options: wo[] = [];


  @ViewChild("Input_cost_centre") Input_cost_centre: ElementRef;
  @ViewChild("Input_description") Input_description: ElementRef;
  @ViewChild("Input_limit_date") Input_limit_date: ElementRef;
  @ViewChild("Input__cost_centre") Input__cost_centre: MatSelect;
  @ViewChild("Input_sub_cost_centre") Input_sub_cost_centre: MatSelect;
  @ViewChild("Input_priority_id") Input_priority_id: MatSelect;
  @ViewChild("Input_Qty") Input_Qty: ElementRef;



  filteredOptions: Observable<wo[]>;

  constructor(
    private dialogRef: MatDialogRef<DialogNewOrder>,
    private service: OrdenesService,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.setOptions(this.options);
  }


  close(): void {
    this.dialogRef.close();
  }

  private showMessaje(message: string) {

    this.snackBar.open(message, "OK", {
      duration: 5000,
    });
  }

  save(): void {
    //valido si el formulario es valido
    if (this.data.product.description == "" || this.data.product.description.length == 0) {
      this.showMessaje("Por favor digite una descripcion válida");
      this.Input_description.nativeElement.focus();
    } else if (this.data.product.qty == "" || this.data.product.qty.length == 0 || this.data.product.qty == 0) {
      this.showMessaje("Por favor digite al menos una cantidad valida.")
      this.Input_Qty.nativeElement.focus();
    } else if (!this.data.CentreCoste) {
      this.showMessaje("Por favor digite un centro de costo válido.");
      this.Input__cost_centre.focus();
    } else if (!this.data.subCentreCoste) {
      this.showMessaje("Por favor digite un sub centro de costo válido.")
      this.Input_sub_cost_centre.focus();
    } else if (!this.data.product.cost_centre) {
      this.showMessaje("Por favor digite un centro de costo válido.")
      this.Input_cost_centre.nativeElement.focus();
    } else if (!this.data.product.priority_id || this.data.product.priority_id == "" || this.data.product.priority_id == 0) {
      this.showMessaje("Por favor digite una prioridad válida.")
      this.Input_priority_id.focus();
    } else if (this.data.product.priority_id == 5 && this.data.product.limit_date == "") {
      this.showMessaje("Por favor digite una fecha limite válida.")
      this.Input_limit_date.nativeElement.focus();
    } else {
      this.dialogRef.close(this.data);
    }
  }
  displayFn(item?: wo): string | undefined {
    return item ? item.code_wo : undefined;
  }

  private _filter(filter: string): wo[] {
    const filterValue = filter.toLowerCase();
    return this.options.filter(option => this.selectedCodeWO(filterValue, option));
  }

  CenterCost($event) {
    if (this.data.CentreCoste && this.data.subCentreCoste) {
      this.data.product.cost_centre = this.data.CentreCoste + this.data.subCentreCoste;
    }
  }

  private selectedCodeWO(filter: string, item: wo): boolean {
    let status = item.code_wo.toLowerCase().indexOf(filter) === 0
    if (status) {
      this.Input_description.nativeElement.disabled = true;
      this.data.product.description = item.descripction;
      this.data.product.fomplus_code = item.code_wo;
    }

    return status;
  }

/**
 * Check if code wo selected exist
 * @param $event 
 * 
 */

  CheckCodigo($event): void {
    
    let find_code = false;
    for (let i in this.options) {
      let item = this.options[i];
      
      if (this.data.product.fomplus_code == item.code_wo || this.data.product.fomplus_code.code_wo == item.code_wo) {        
        find_code = true;
        break;
      }
    }

    if(!find_code && this.data.product.fomplus_code !=''){
     // this.data.product.description = "";
      this.Input_description.nativeElement.disabled = false;
    }
  }

  /**
   *
   * @param $event 
   * 
   * return boolean status
   */
  BuscarCodigo($event): boolean {
    //key code no valids for search
    let keys = [20, 16, 17, 91, 18, 93, 8, 37, 38, 39, 40];

    this.CheckCodigo($event)

    if (keys.includes($event.keyCode)) {
      return false;
    }

    if (this.data.product.fomplus_code.length == 0) {
      this.Input_description.nativeElement.disabled = false;
      this.data.product.description = "";
      return false;
    }
    this.service.getCode(this.data.product.fomplus_code)
      .subscribe((data =>
        this.setOptions(data['data'] == -1 ? [] : data['data'])
      )
      ), error => this.setOptions([])

  }
  private setOptions(options: wo[]) {
    if (options.length == 0) {
      return;
    }
    this.options = options;

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | wo>(''),
        map(value => typeof value === 'string' ? value : value.code_wo),
        map(fill => fill ? this._filter(fill) : this.options.slice())
      );
  }
}


