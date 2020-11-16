import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { RegistryYear } from '../../classes/register.class';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExelFilesService {

  constructor() { }

  exportRegisterYearAsXLSX( selectedYearRecords : RegistryYear[],year : number): void {
    let data = [];

    for (let index = 0; index < selectedYearRecords.length; index++) {
      const element = selectedYearRecords[index];
      let newRows = {
        idRegistry : element.idRegistry,
        idBeneficiary : element.idBeneficiary,
        fullName : element.fullName,
        haveImage : element.haveImage,
      }
      data.push(newRows);
    }
    

    this.exportAsExcelFile(data, 'Registros_' + year );
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    let dateFix = "" + new Date().getDate() + "_" + new Date().getMonth() + "_" + new Date().getFullYear() + "_"
    FileSaver.saveAs(data, fileName + '_fecha_' + dateFix + EXCEL_EXTENSION);
  }

  //Fin de las funciones para exportar a exel
}
