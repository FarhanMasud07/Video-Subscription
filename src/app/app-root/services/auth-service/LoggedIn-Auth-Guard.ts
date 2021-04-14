import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthService} from './auth-service';
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import decode from "jwt-decode";

@Injectable()
export class LoggedInAuthGuardService implements CanActivate {

  constructor(public authService: AuthService, public router: Router) {
  }

  canActivate() {
    return this.loggedInAuthGuard();
  }

  private loggedInAuthGuard() {
    const jwtToken: string | any = this.authService.getJwtToken()
      ? this.authService.getJwtToken() : null;
    const jwtRefreshToken: string | any = this.authService.getRefreshToken()
      ? this.authService.getRefreshToken() : null;
    if (jwtRefreshToken && jwtToken) {
      const jwtDecodedToken: string | any = decode(jwtToken);
      const jwtDecodedRefreshToken: string | any = decode(jwtRefreshToken);
      let admin: string;
      let customer: string;

      // for node  js
      // const admin = jwtDecodedToken.roles[jwtDecodedToken?.roles?.indexOf('admin')];
      // const customer: string = jwtDecodedToken.roles[jwtDecodedToken?.roles?.indexOf('customer')];


      const roles = jwtDecodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      admin = roles[roles?.indexOf('admin')];
      customer = roles[roles?.indexOf('customer')];

      if (roles && Array.isArray(roles)) {
        if ((Date.now() < Number(jwtDecodedRefreshToken.exp) * 1000)
          && (admin === 'admin')) {
          this.router.navigate(['/admin']);
          return false;
        }
        if ((Date.now() < Number(jwtDecodedRefreshToken.exp) * 1000)
          && (customer === 'customer')) {
          this.router.navigate(['/dashboard']);
          return false;
        }
        return true;
      }else{
        if ((Date.now() < Number(jwtDecodedRefreshToken.exp) * 1000)
          && (roles === 'admin')) {
          this.router.navigate(['/admin']);
          return false;
        }
        if ((Date.now() < Number(jwtDecodedRefreshToken.exp) * 1000)
          && (roles === 'customer')) {
          this.router.navigate(['/dashboard']);
          return false;
        }
        return true;
      }
    }
    return true;
  }
}
