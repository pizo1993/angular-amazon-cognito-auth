/**
 * @author DineshRachumalla
 * @date 18-05-2018
 * @desc Angular service where authentication functionality is executed
 */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "./../../../environments/environment";
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { LocationStrategy } from '@angular/common';
import "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
// Importing Cognito SDK features
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession
} from "amazon-cognito-identity-js";
import { ActivatedRoute } from "@angular/router";


@Injectable()
export class AuthService {
  private _accessToken: string = "";
  private _userloggedIn: boolean = false;
  private _userDetails: any = {};


  constructor(public http: HttpClient, private route: ActivatedRoute, private locationStrategy: LocationStrategy) { }
  /**
   * @method authenticationCognito Login to Amanzon Cognito with provided parameters
   * @param {object} data
   * @return {Object} Observable
   * @desc Converted the general call backs with the help of Observable so that the response will
   * be notified
   */

  qrGuuid: string;



  get qrGuuidIsPresent(): Boolean {
    console.log(localStorage.getItem('QR_GUUID'))
    if (localStorage.getItem('QR_GUUID')) {
      console.log("Local storage")
      return true
    }
    return false;
  }
/*
  getFragment(): Observable<any> {
    console.log("Getting url fragment..");
    return this.route.fragment
      .pipe(
        filter(data => data != ''),
        map(fragment => {
          console.log("Fragment:",fragment);
          return new URLSearchParams(fragment)
        }),
        map(params => {
          if (params.get('state') != undefined) {
            return "/#state=" + params.get('state')
          } else {
            return ''
          }
        })
      )
  }
*/
  setQrGuuid() {
    console.log("In setQrGuuid...")
    let path = this.locationStrategy.path(true);
    console.log(this.route.snapshot.queryParamMap.get('qrId'));
    console.log(new URLSearchParams(path))
    console.log(path);
    if (path=='' || path == undefined || path == null) {
      return
    }
    let qrId = path.match(new RegExp(/[\\?&]qrId=\K([^&#]*)/));
    if (qrId != null) {
      this.qrGuuid = qrId[0];
      localStorage.setItem("QR_GUUID", this.qrGuuid);
      console.log("QR Guuid:", this.qrGuuid);
      return
    }
    console.log("Qr Guuid not present..");
  }




  getUserPool() {
    return new CognitoUserPool(environment.cognitoPool);
  };

  getCurrentUser() {
    return this.getUserPool().getCurrentUser();
  }

  authenticateCongnito(data): Observable<any> {
    // Defining an rxjs subject so as to emit after recieving the response
    let authResult = new Subject<any>();
    // Add the User details to amazon cognito sdk
    const CogAuthData = new AuthenticationDetails(data);
    const CogUser = new CognitoUser({
      Username: CogAuthData.getUsername(),
      Pool: this.getUserPool()
    });
    console.log(CogUser);
    // Authenticate the cognito user with information
    CogUser.authenticateUser(CogAuthData, {
      onSuccess: result => {
        // on success send it to subject so that it will emit the success
        authResult.next(result);
      },
      onFailure: err => {
        // on failure send it to suvject so that will emit the error
        console.log(err)
        authResult.error(err);
      }
    });
    // Handling the final Observable 
    return authResult.asObservable();
  }
  /*// Set accesstoken data
  set accessToken(value: string) {
    this._accessToken = value;
  }
  // set Logged in user data
  set userLoggedIn(value: boolean) {
    this._userloggedIn = this.getUserSession();
  }
  */


  isUserLoggedIn(): boolean {
    let userLoggedSubject = new BehaviorSubject<boolean>(false);
    if (this.getCurrentUser() != null) {
      this.getCurrentUser().getSession((err, session) => {
        if (err) {
          console.log("Auth Service: Couldn't get the session", err.stack);
          userLoggedSubject.next(false);
        } else {
          console.log("Auth Service: Session is " + session.isValid());
          userLoggedSubject.next(true);
        }
      })
    } else {
      console.log("Auth Service: can't retrieve the current user");
      userLoggedSubject.next(false);
    }
    console.log("Pre return")
    return userLoggedSubject.getValue();
  }



  // get user Logged in data


  // set user details
  set UserDetails(value: any) {
    this._userDetails = value;
  }
  // set user Details
  get UserDetails(): any {
    return this._userDetails;
  }




  getUserSession(): Observable<CognitoUserSession> {
    let userSession = new Subject<CognitoUserSession>();
    let cognitoUser = this.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          console.log("Auth Service: Couldn't get the session", err.stack);
          userSession.error(err);
        } else {
          console.log("Auth Service: Session is " + session.isValid());
          return userSession.next(session);
        }
      })
    } else {
      console.log("Auth Service: can't retrieve the current user");
      userSession.next(null);
    }
    return userSession.asObservable();
  }


}
