/**
 * @author DineshRachumalla
 * @Date 18-05-2018
 * @desc login component file contians the angular reactive forms instead of template driven forms
 * and authentication functionality
 */
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
// Injecting services
import { AuthService } from "../../shared/services";



@Component({
  selector: "app-login",
  styleUrls: ["./login.component.scss"],
  templateUrl: "./login.component.html"
})




export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  private errorMessage:string;
  private returnUrl: string;
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    if (this.authService.isUserLoggedIn()) 
      this.router.navigate(['/']);
    this.createLoginForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  /**
   * @method createLogigForm creating an angular reactive form field with validations
   */
  private createLoginForm(): void {
    this.loginForm = this.fb.group({
      username: [
        null,
        Validators.compose([Validators.required, Validators.minLength(5)])
      ],
      password: [null, Validators.required]
    });
  }

  //Implements method of AuthCallback interface 


  public OnSubmit(): void {
    /**
     * @method AuthService.authenticateCongnito calling the cognito authentication 
     * @param {string} username
     * @param {string} password
     * @return {object} With accesstoken and payload
     */

    let cognitoCreds = {
      Username: this.loginForm.value.username,
      Password: this.loginForm.value.password
    }
    this.authService
      .authenticateCongnito(cognitoCreds)
      .subscribe(result => {
        console.log("Login result:",result)
        // verify the result having the accessToken and payload information
        if (result && result.accessToken) {
          // After information is received send it to angular setters in services and can utlised
          //this.authService.accessToken = result.accessToken.jwtToken;
          //this.authService.userLoggedIn = true;
          this.authService.UserDetails = {
            username: result.accessToken.payload.username
          };
          // Route to returnUrl
          this.router.navigateByUrl(this.returnUrl);
        }
      }, err => {
        this.errorMessage = err.message;
        console.log("Login Error:",this.errorMessage)
      });
  }
}
