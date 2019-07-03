/**
 * @author DineshRachumalla
 * @Date 18-05-2018
 * @desc Home compoent having information about user
 */
import { Component, OnInit } from "@angular/core";
import { AuthService } from "./../../shared/services";
import { Router, ActivatedRoute } from "@angular/router";
import { HandleQrService } from "src/app/shared/services/handle-qr.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  public UserDetails: any;
  private message: string = '';
  private loadedValidateComponent = false;
  public queryStringQrIdIsPresent:boolean = false;
  
  constructor(public authService: AuthService, public router: Router, private activatedRoute: ActivatedRoute) { }
  
  ngOnInit() {
    console.log("Home Component: in ngOnInit()")
    let queryStringQrId = this.activatedRoute.snapshot.queryParams["qrId"];
    if (queryStringQrId != undefined && queryStringQrId != null && queryStringQrId != '') {
      this.queryStringQrIdIsPresent=true;
    }
      
  }
  /**
   * @method getUserDetails Get the logged in user info
   * @return {Object} userdetails
   */
  public getUserDetails(): void {
    this.UserDetails = this.authService.UserDetails;
  }
  /**
   * @method logout Logout user
   *
   */
  public logout(): void {
    // Clear the user details on logout and make userlogged in to false
    //this.authService.userLoggedIn = false;
    this.authService.UserDetails = {};
    //this.authService.accessToken = null;
    // Route to sign
    this.router.navigate([""]);
  }

  

  loadValidateComponent():void {
    this.loadedValidateComponent = true;
  }

  getQueryParams(name):string {
    return this.activatedRoute.snapshot.queryParams[name];
  }
}
