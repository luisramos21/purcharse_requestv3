import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends ApiService {

  constructor(_HttpClient: HttpClient) {
    super(_HttpClient);
  }

  /*
  <pre>
    @param 
      user:number optional
    @descrition
      get Users to database , for post data
    return Observable<any>
   </pre>
   */
  getUsers(user?: number): Observable<any> {
    let json = this._api.get("GET_USERS");
    if (user) {
      json = this._api.PropData({
        'action': "GET_USERS", 'add': {
          'id': user
        }
      })
    }
    return this._post(json);
  }
  /*
  <pre>
    @param 
      none
    @descrition
      get Tipe of the Users to database , for post data
    return Observable<any>
   </pre>
   */
  getUserTypes(type?: number): Observable<any> {
    let json = this._api.get("GET_USER_TYPE");
    if (type) {
      json = this._api.PropData({
        'action': "GET_USER_TYPE", 'add': {
          'id': type
        }
      });
    }

    return this._post(json);
  }
}
