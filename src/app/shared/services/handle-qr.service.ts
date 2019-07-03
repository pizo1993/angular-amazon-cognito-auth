import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HandleQrService {
  API_ID = environment.API_ID;
  API_STAGE = environment.API_STAGE;
  apiGatewayEndpoint:string = `https://${this.API_ID}.execute-api.eu-central-1.amazonaws.com/${this.API_STAGE}/validateCode`;

  constructor(private http: HttpClient, private authService: AuthService, private activatedRoute: ActivatedRoute) {

  }

  validateQr(queryStringQrId): Observable<any> {
    console.log("Before Calling this.authService()");
    let token = this.authService.getIdToken();
    
    let HttpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token     
      }, 
      params: {
        "qrId": queryStringQrId
      }
    } 
    return this.http.get(this.apiGatewayEndpoint,HttpOptions);
  }
}
