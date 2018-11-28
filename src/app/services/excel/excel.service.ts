import { Injectable } from '@angular/core';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { element } from '@angular/core/src/render3';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const EXCEL_EXTENSION = '.xlsx';
@Injectable()
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string, custom_columns?: string[]): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    let i = 0;
    /**
     * llenar archivo dependiendo numero de las columnas 
     */
    let _Columns = ["A", "B", "C", "D", "E", "F", "G", "I", "J", "K", "L", "M"]
    if (custom_columns.length > 0) {
      custom_columns.forEach(element => {
        if (element !== 'Acciones') { 
          worksheet[`${_Columns[i]}1`]["v"] = element;
          i++;
        }
      });
    }

    const workbook: XLSX.WorkBook = { Sheets: { 'Datos': worksheet }, SheetNames: ['Datos'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
