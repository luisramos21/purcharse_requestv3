import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Api } from 'src/app/views/api-purcharse/api';

@Injectable({
  providedIn: 'root'
})
/*
  add in file .htaccess
  and temporal seesion in dao.php
  //temp sesion
		$_SESSION["login_requisiciones"] = json_encode(array("data"=>array(array("id"=>1,"user_type_id"=>6,"User"=>"User Session"))));
        
  <IfModule mod_headers.c>		
		Header add Access-Control-Allow-Origin "*"
		Header add Access-Control-Allow-Methods: "GET,POST,OPTIONS,DELETE,PUT"
	</IfModule>
   */

export class ApiService {
  _api: Api;

  constructor(private http: HttpClient) {
    this._api = new Api();
  }

  public _post(options: { data, method?, url?}): Observable<any> {
    let data = JSON.stringify(options.data);

    let _url = "";
    if (options.method) {
      _url = this._api.URL + options.method;
    }
    if (options.url) {
      _url = options.url;
    }

    return this.http.post(_url, data)
      .pipe(
        retry(10),
        catchError(this.handleError)
      );

  }

  public _postFile(file: File, options: { data, method?, url?}): Observable<any> {
    const data: FormData = new FormData();
    data.append('file', file, file.name);
    
    for (let i in options['data']) {
      data.append(i, options['data'][i]);
    }

    let _url = "";
    if (options.method) {
      _url = this._api.URL + options.method;
    }
    if (options.url) {
      _url = options.url;
    }

    return this.http.post(_url, data)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );

  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
