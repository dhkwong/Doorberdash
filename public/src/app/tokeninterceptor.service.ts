import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

// import 'rxjs/add/operator/do';
import { Observable} from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokeninterceptorService implements HttpInterceptor {
  constructor(
    private cookieService: CookieService
  ) { }
  //intercepts and HttpRequest and modifies the req.header to add the jwt token
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtcookie = this.cookieService.get('JWT')
    console.log("token interceptor injecting cookie jwt to res header: "+jwtcookie)
    request = request.clone({
      setHeaders: {
        //sets header of Authorization: 'JWT jwttokenvalue' for backend to handle
        'Authorization': `JWT ${jwtcookie}`
      }
    });
    //passes modified req
    return next.handle(request);

  }
  //I dont need to intercept the response since I'll be creating a token once, setting the cookie, and then forgetting about it.
  // possible intercept method in case we choose to modify each api response not very likely as only login/reg returns a cookie
  // interceptResponse(response:HttpResponse<any>, next: HttpHandler): Observable <HttpEvent<any>>{
  //   return null
  // }
}
