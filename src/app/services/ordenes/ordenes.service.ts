import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService extends ApiService {

  constructor(_HttpClient: HttpClient) {
    super(_HttpClient);
  }

  getNextOrder(): Observable<any> {
    let json = this._api.get("NEXT_ORDER");    
    return this._post(json);
  }

  getAprobers(): Observable<any> {
    let json = this._api.get("GET_APROBERS");    
    return this._post(json);
  }

  getCentersCoste(): Observable<any> {
    let json = this._api.get("GET_CENTERS_COSTE");    
    return this._post(json);
  }
  getCode(code : string ): Observable<any> {
    let json = this._api.get("GET_CODE_WO");    

    if (code) {
      json = this._api.PropData({
        'action': "GET_CODE_WO", 'add': {
          'item': code
        }
      })
    }
    return this._post(json);
  }

  getOrdenes(): Observable<any> {
    let json = this._api.get("GET_ORDERS");    
    return this._post(json);
  }

  getOrdenesPendientes(): Observable<any> {
    let json = this._api.get("GET_ORDERS_PEND");    
    return this._post(json);
  }

  getOrdenesAprobadas(): Observable<any> {
    let json = this._api.get("GET_ORDERS_APROBADAS");    
    return this._post(json);
  }



}
