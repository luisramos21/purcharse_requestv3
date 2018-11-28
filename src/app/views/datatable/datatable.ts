import { MatTableDataSource } from "@angular/material";
import { ExcelService } from "src/app/services/excel/excel.service";

export interface Datatable {
    title:string;
    column?:string;
    data: [{}];
    columns:string[];
    dataSource: MatTableDataSource<any>;
    excelService: ExcelService;

    

    //METHODS 
    _setData(_data: [{}]): void;

    options__setDataKey?:{
        data:any,
        columns_header?:string[],
        error:boolean,
        RemoveIndexs?:number[],
        actions?:{}};
   
    _setDataKey(options:Datatable["options__setDataKey"]): void;
}
