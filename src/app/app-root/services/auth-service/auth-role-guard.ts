import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from './auth-service';
import decode from 'jwt-decode';
import {map} from "rxjs/operators";

@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.authRoleGuard(route);
  }

  private authRoleGuard(route: any) {
    const expectedRole = route.data.expectedRole;
    const jwtToken: string | any = this.authService.getJwtToken()
      ? this.authService.getJwtToken() : null;
    const jwtRefreshToken: string | any = this.authService.getRefreshToken()
      ? this.authService.getRefreshToken() : null;
    if (jwtRefreshToken && jwtToken) {
      const jwtDecodedToken: string | any = decode(jwtToken);
      const jwtDecodedRefreshToken: string | any = decode(jwtRefreshToken);
      let admin: string;
      let customer: string;

      // const admin = jwtDecodedToken?.roles[jwtDecodedToken?.roles?.indexOf('admin')];
      // const customer: string = jwtDecodedToken?.roles[jwtDecodedToken?.roles?.indexOf('customer')];

      const roles = jwtDecodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      if (roles && Array.isArray(roles)) {
        admin = roles[roles?.indexOf('admin')];
        customer = roles[roles?.indexOf('customer')];

        // (Date.now() < Number(jwtDecodedRefreshToken.exp) * 1000)
        //           &&

        if ((admin === expectedRole)) {
          return true;
        }
        //(Date.now() < Number(jwtDecodedRefreshToken.exp) * 1000)
        //           &&
        if ((customer === expectedRole)) {
          return true;
        }
      //  (Date.now() < Number(jwtDecodedRefreshToken.exp) * 1000)
        //           &&
      } else {
        if ( (roles === expectedRole)) {
          return true;
        }
        //(Date.now() < Number(jwtDecodedRefreshToken.exp) * 1000)
        //           &&
        if ((roles === expectedRole)) {
          return true;
        }
      }
    }
    this.authService.removeTokens();
    this.router.navigate(['/']);
    return false;
  }
}
