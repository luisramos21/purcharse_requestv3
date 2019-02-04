import {
  Component, OnInit,
  Input, Output, ViewChild,
  AfterViewInit, EventEmitter
} from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ExcelService } from '../../services/excel/excel.service';
import { Datatable } from 'src/app/views/datatable/datatable';
import { Columns } from 'src/app/views/datatable/columns';
import { AppComponent } from 'src/app/app.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit, AfterViewInit, Datatable {

  options__setDataKey?: {
    data: any;
    columns_header?: string[];
    error: boolean;
    RemoveIndexs?: number[];
    actions?: {};
  };

  title: string;
  column?: string;
  /* instance of Excel Service for export file */
  excelService: ExcelService;
  columns_header: string[];
  Filename: string = 'Requisiciones';

  ngAfterViewInit(): void {
    //console.log("ngAfterViewInit")
  }

  @Input() NO_DATA: [{}] = [{
    "DATOS": "NO HAY DATOS DISPONIBLES."
  }];
  @Input() no_data_columns: string[] = ["DATOS"];
  @Input() CHECKBOX_ID: string = "#";
  @Input() Buttons: boolean = true;

  @Input() ButtonsArray: any = [];
  @Input() data: [{}];
  @Input() columns: string[];
  /* Notifique at current component of the isntance of this class component */
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();

  /**
   * declare propery @CustomColumns for custumise columns
   * **/
  @Input() CustomColumns: [Columns] = [
    {
      get() {
        return this.column;
      },
      mrender(data) {
        return data;
      }
    }];

  @Input() column_state = "Estado";

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private app_component: AppComponent) {
    this.excelService = new ExcelService();
  }

  ngOnInit() {

  }


  selection = new SelectionModel<any>(true, []);

  get_selection(): number {
    return this.selection.selected.length;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.get_selection();
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  SendSelected(): void {
    this.action("Items_selection", this.selection.selected)
    this.ClearSelected();
  };

  CkeckItem($event: Event, row: any, selection: { toggle: (arg0: any) => void; }) {
    let result = $event ? selection.toggle(row) : null;
    this.action("Items_selection", this.selection.selected)
    return result;
  }

  ClearSelected(): void {
    this.selection.clear();
  }


  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

    if (this.isAllSelected() || typeof this.dataSource.data == 'undefined') {
      this.selection.clear();
    } else {
      let i:number = 0;
      this.dataSource.data.forEach((row) => {
        if (i <  this.dataSource.paginator.pageSize) {
          this.selection.select(row)
        };
        i++;
      });
    }


    this.action("Items_selection", this.selection.selected)

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
  /**
   * 
   * @param _data 
   * return void
   */
  _setData(_data: [{}]): void {
    this.data = _data;
  }

  /**
   * 
   * @param options type Datatable
   * return none
   */
  _setDataKey(options: Datatable["options__setDataKey"]): void {

    let data = options["data"];
    if (options["columns_header"]) {
      this.columns_header = options["columns_header"];
    }
    let error = options["error"];
    let RemoveIndexs = options["RemoveIndexs"];
    let actions = options["actions"];

    let keys: string[];
    if (!error && data["data"]) {

      this.data = data["data"];
      keys = data["KEY"];

      let temp_keys: string[] = [];
      for (let t in keys) {
        if (typeof keys[t] != 'undefined') {
          temp_keys.push(keys[t]);
        }
      }
      keys = temp_keys;

      if (RemoveIndexs && RemoveIndexs.length > 0) {
        RemoveIndexs.forEach(index => {
          keys.splice(index, 1);
        });
      }

      if (!this.columns_header || typeof this.columns_header == 'undefined' || this.columns_header.length == 0) {
        this.columns_header = keys;
      }
    }

    if (!this.data) {
      this.data = this.NO_DATA;
      keys = this.no_data_columns;
      this.columns_header = this.no_data_columns;
    }

    if (this.columns_header.length > 0 && keys.length > 0) {

      for (let i = 0; i < this.columns_header.length; i++) {
        //defaut render columns if change value in row 
        let render = function (data) {
          return data == 'null' ? '' : data;
        };

        let action = false;
        let action_edit = false;
        let action_remove = false;
        let action_view = false;
        let action_all = false;
        let action_modal = false;

        if (actions && actions[keys[i]]) {
          if (actions[keys[i]].action)
            action = actions[keys[i]].action

          if (actions[keys[i]].remove)
            action_remove = actions[keys[i]].remove

          if (actions[keys[i]].edit)
            action_edit = actions[keys[i]].edit

          if (actions[keys[i]].all)
            action_all = actions[keys[i]].all

          if (actions[keys[i]].view)
            action_view = actions[keys[i]].view

          if (actions[keys[i]].modal)
            action_modal = actions[keys[i]].modal

          if (actions[keys[i]].mrender)
            render = actions[keys[i]].mrender
        }

        this.app_component.setProgress(40 + i);
        if (!keys[i]) {
          console.log(`index ${i} in keys[i] undefined`)
        } else {

          this.CustomColumns[i] = {
            column: keys[i],
            title: this.columns_header[i],
            action: action,
            action_all: action_all,
            action_view: action_view,
            action_edit: action_edit,
            action_remove: action_remove,
            action_modal: action_modal,
            get: function () {
              return this.column;
            },
            cell: (element: any) => `${element[keys[i]]}`,
            mrender: render
          };
        }
      }

      this.app_component.setProgress(60);
      this.columns = this.CustomColumns.map(c => c.column);
      //      console.log(this.CustomColumns, this.columns_header)
      this._setData(this.data);
      this.update();
    } else {
      console.error("this.columns_header not found")
    }
  }

  update(_data?: [{}]): void {
    if (_data) {
      this._setData(_data);
    }

    if (!this.dataSource || _data) {
      this.dataSource = new MatTableDataSource(this.data);
    }
    if (this.data) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }

    this.app_component.setProgress(100);
    this.app_component.show_progress = false;
    this.action('updateSpiner', { status: false });
  }

  applyFilter(filterValue: string) {
    let value = filterValue.trim();
    let valueArray = value.split(" ");
    //console.log(valueArray)
    if (valueArray.length == 1) {
      this.dataSource.filter = filterValue;
    } else {
      valueArray.forEach(element => {
        this.dataSource.filter = element;
      });
    }

  }

  printComponent(id) {
    let printContents = document.getElementById(id).innerHTML;
    let originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();
    document.body.innerHTML = originalContents;

  }
  /**
   * expor data at to excel file 
   */
  ExportarExcel(): void {
    this.excelService.exportAsExcelFile(this.dataSource.filteredData, this.Filename, this.columns_header);
  }
}
