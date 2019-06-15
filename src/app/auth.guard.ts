import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private router: Router) {

    }
    // 访问路由前调用
    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return true;
    }
    // 访问子路前调用
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!window.sessionStorage.getItem('yk_login_usr')) {
            this.router.navigate(['/login']);
            return false;
        }
        if (window.sessionStorage.getItem('yk_login_usr')) {
            return true;
        }
        return false;
    }
}
