import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {AuthService} from "../../../app-root/services/auth-service/auth-service";
import {ErrorResponse} from "apollo-link-error";
import jwt_decode from "jwt-decode";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatSlideToggle, MatSlideToggleChange} from "@angular/material/slide-toggle";
import {HttpErrorResponse} from "@angular/common/http";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss']
})
export class AppLoginComponent implements OnInit {

  email: string | any;
  password: string | any;
  ErrorMessage: string | any;
  loading: boolean | any;

  loginForm = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', [Validators.required]),
  });


  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
  }

  hasError(controlName: string, type: string) {
    let formControl = this.loginForm.get(controlName);
    return formControl && formControl.hasError(type) && formControl.touched;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.tryToLogin();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private tryToLogin() {

    this.ErrorMessage = null;
    this.loading = true;
    this.authService.login(
      {
        email: this.loginForm.value.Email,
        password: this.loginForm.value.Password,
      }
    )
      .subscribe((response: any) => {
        if (response) {
          console.log(response);
          this.goToDesireLocation(response.jwt)
        } else {
          this.loading = false;
          this._snackBar.open('Credential is wrong', 'End now', {
            duration: 5000,
            horizontalPosition: 'end',
          });
        }
      }, (error) => {
        this.loading = false;
        this._snackBar.open(error.error, 'End now', {
          duration: 5000,
          horizontalPosition: 'end',
        });
      });
  }

  private goToDesireLocation(jwt: string) {
    const token: string | any = jwt;
    const jwtDecodedToken: string | any = jwt_decode(token);
    let admin: string;
    let customer: string;
    // for node js
    // const admin: string = jwtDecodedToken.roles[jwtDecodedToken?.roles?.indexOf('admin')];
    // const customer: string = jwtDecodedToken.roles[jwtDecodedToken?.roles?.indexOf('customer')];


    const roles = jwtDecodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (roles && Array.isArray(roles)) {
      admin = roles[roles?.indexOf('admin')];
      customer = roles[roles?.indexOf('customer')];
      if (admin === 'admin') {
        this.router.navigate(['/admin']);
        return;
      }
      if (customer === 'customer') {
        this.router.navigate(['/dashboard']);
        return
      }
    } else {
      if (roles === 'admin') {
        this.router.navigate(['/admin']);
        return;
      }
      if (roles === 'customer') {
        this.router.navigate(['/dashboard']);
        return
      }
    }
  }

}
