import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { throwError, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class FormPostService {
  public constructor(private http: HttpClient) { }
  public static readonly NETWORK_ERROR_MESSAGE: string = "La requête n'a pas pu être acheminée depuis le client";
  public static readonly BACKEND_ERROR_MESSAGE: string = "La requête n'a pas pu être acheminée depuis le client";

  // Since we are in dev we can't use the base URL of the document, hence the hardcode
  private readonly BASE_URL: string = environment.production ? document.baseURI : "http://localhost:3000/";

  public submitForm(route: string, body: FormData | {}): Observable<Object> {

    return this.http.post<Object>(this.BASE_URL + route, body).pipe(
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let err: Error;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
      err = {
        name: "Network Error",
        message: FormPostService.NETWORK_ERROR_MESSAGE,
      };
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      err = {
        name: "Backend Error",
        message: error.error.message ? error.error.message : FormPostService.BACKEND_ERROR_MESSAGE,
      };
    }
    // return an observable with a user-facing error message

    return throwError(err);
  }
}
