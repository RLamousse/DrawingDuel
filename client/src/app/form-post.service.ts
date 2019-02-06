import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class FormPostService {

  private readonly BASE_URL: string = "http://localhost:3000/api/game-creator/create-simple-game";
  public constructor(private http: HttpClient) { }

  public basicPost(body: FormData | {}): Observable<Object> {

      return this.http.post<Object>(this.BASE_URL, body).pipe(
          catchError(this.handleError<Object>("basicPost")),
      );
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

      return (): Observable<T> => {
          return of(result as T);
      };
  }
}
