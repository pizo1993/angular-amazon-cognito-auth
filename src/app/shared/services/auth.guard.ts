import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
/**
 * @author DineshRachumalla
 * @Date 18-05-2018
 * @desc Router guard, where it prevents user not reaching to any other navigation without login
 * It can be written with the help of anuglar router guards
 */
import { AuthService } from "./auth.service";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";
import { Location, LocationStrategy } from "@angular/common";
import { first } from "rxjs/operators";
import { merge } from "rxjs-compat/operator/merge";
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, public router: Router, private locationStrategy: LocationStrategy) { }
  /**
   * @method canActivate Angular router guard
   * @param next  Router snapshot
   * @param state router state snapshot
   * @return {boolean}
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // get the value from auth service whether user is logged or not,
    // If not logged in then route him towards sign in
    // If logged pass the value so that i execute the further functinoality
    console.log("Can Activate..")
    this.authService.setQrGuuid();
    console.log()
    if (!this.authService.isUserLoggedIn()) {
      console.log("Redirect to login");
      //this.router.navigate(['/login'], {queryParams: {"qrId": this.authService.qrGuuid},queryParamsHandling: "merge"});
      console.log(state.url)
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }})
    }
    console.log("After Auth Service Logged in in Can Activate")
    return true;
  }
}
