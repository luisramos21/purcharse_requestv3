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

  getOrdenes(): Observable<any> {
    let json = this._api.get("GET_ORDERS");    
    return this._post(json);
  }

  getOrdenesPendientes(): Observable<any> {
    let json = this._api.get("GET_ORDERS_PEND");    
    return this._post(json);
  }



}
