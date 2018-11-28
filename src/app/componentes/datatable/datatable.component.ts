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

    if (!keys && !this.data) {
      this.data = this.NO_DATA;
      keys = this.no_data_columns;
      this.columns_header = this.no_data_columns;
    }

    if (this.columns_header.length > 0 && keys) {

      for (let i = 0; i < this.columns_header.length; i++) {
        //defaut render columns if change value in row 
        let render = function (data) {
          return data=='null'?'':data;
        };

        let action = false;
        let action_edit = false;
        let action_remove = false;
        let action_view = false;
        let action_all = false;

        if (actions && actions[keys[i]]) {
          if (actions[keys[i]].action)
            action = actions[keys[i]].remove

          if (actions[keys[i]].remove)
            action_remove = actions[keys[i]].remove

          if (actions[keys[i]].edit)
            action_edit = actions[keys[i]].edit

          if (actions[keys[i]].all)
            action_all = actions[keys[i]].all

          if (actions[keys[i]].view)
            action_view = actions[keys[i]].view

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

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.app_component.setProgress(100);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
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
