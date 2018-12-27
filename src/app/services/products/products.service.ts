import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  Product} from 'src/app/views/product/product';
import {  Producto} from 'src/app/views/product/producto';
import {  ProductData} from 'src/app/views/product/product-data';


@Injectable({
  providedIn: 'root'
})
export class ProductsService extends ApiService {

  constructor(_HttpClient: HttpClient) {
    super(_HttpClient);
  }
  /**
   * this method at get all products temp to current number the purcharse order.
   * @param req 
   */
  getAllProductsTemp(req: string): Observable<ProductData> {
    let json = this._api.get("ALL_PRODUCTS_TEMP");

    if (req) {
      console.log("req : ",req)
      json = this._api.PropData({
        'action': "ALL_PRODUCTS_TEMP", 'add': {
          'purchase_request_id': req
        }
      })
    }
    return this._post(json);
  }
  /**
   * Get Product Temp 
   * @param id 
   * @return Observable<Producto>
   */
  getTemProduct(id: number): Observable<Producto> {
    let json = this._api.get("GET_PRODUCT_TEMP");

    if (id > 0) {
      json = this._api.PropData({
        'action': "GET_PRODUCT_TEMP", 'add': {
          'id': id
        }
      })
    }
    return this._post(json);
  }

  /**
   * This method the send post data for save in database
   * @param product Product
   */ 

  saveTemProduct(product: Product): Observable<any> {
    let json = this._api.get("SAVE_PRODUCT_TEMP");

    if (product) {
      json = this._api.PropData({
        'action': "SAVE_PRODUCT_TEMP", 
        'add': product
      })
    }
    return this._post(json);
  }

  /**
   * this Method is the remove item product the current purcharse order
   * @param id number
   */

  removeTemProduct(id: number): Observable<any> {
    let json = this._api.get("REMOVE_PRODUCT_TEMP");

    if (id) {
      json = this._api.PropData({
        'action': "REMOVE_PRODUCT_TEMP", 
        'add': {
          "ind":id
        }
      }) 
    }
    return this._post(json);
  }

}
