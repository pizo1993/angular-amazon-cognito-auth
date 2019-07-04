import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services';
import { HandleQrService } from 'src/app/shared/services/handle-qr.service';
import { routerNgProbeToken } from '@angular/router/src/router_module';



@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.css']
})
export class ValidateComponent implements OnInit {
  message = {
    type: '',
    text: ''
  };
  
  constructor(private activatedRoute: ActivatedRoute, private authService : AuthService, private hanldeQr: HandleQrService, private router: Router) { }

  ngOnInit() {
    if (!this.authService.isUserLoggedIn) {
      this.router.navigate(['/login']);
      return
    }
    this.message.text = '';
    this.message.type = '';
    this.validateQr();
  }

  validateQr(): void {
    console.log("Home Component: validateQr()")
    let queryStringQrId = this.activatedRoute.snapshot.queryParams["qrId"];
    if (queryStringQrId == undefined || queryStringQrId == null) {
      this.message.type = 'warning'
      this.message.text = "Non è possibile recuperare l'identificativo del Qr! Esegui una nuova scansione!"
      return
    }
    console.log(queryStringQrId);
    let currentUser = this.authService.getUsername(); 
    this.hanldeQr.validateQr(queryStringQrId,currentUser).subscribe(val => {
      console.log(val);
      this.message.type = "success";
      this.message.text = "Qr Code verificato correttamente!";
    }, err => {
      console.log(err);
      this.message.type = "danger"
      if (err.error.message.indexOf('ExpressionAttributeValues contains invalid value') > -1) {
        
        this.message.text  = "Non è possibile recuperare l'identificativo del Qr! Esegui una nuova scansione!";
      } else {
        this.message.text = err.error.message;
      }
    })
  }

  getMessageText():string {
    return this.message.text;
  }

  getMessageType():string {
    return this.message.type;
  }

  

}
