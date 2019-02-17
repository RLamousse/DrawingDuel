import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { throwError, Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class FormPostService {

  // Since we are in dev we can't use the base URL of the document, hence the hardcode
  private readonly BASE_URL: string = "http://localhost:3000/api/game-creator/create-simple-game";
  public constructor(private http: HttpClient) { }

  public basicPost(body: FormData | {}): Observable<Object> {

    return this.http.post<Object>(this.BASE_URL, body).pipe(
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
        message: "La requête n'a pas pu être acheminée depuis le client",
      };
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      err = {
        name: "Backend Error",
        message: error.error.message ? error.error.message : "La requête n'a pas pu être traitée par le serveur",
      };
    }
    // return an observable with a user-facing error message

    return throwError(err);
  }
}
