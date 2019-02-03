import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class FormPostService {

  private readonly BASE_URL: string = "http://localhost:3000/api/image-diff";
  public constructor(private http: HttpClient) { }

  public basicPost(formdata: FormData | {}): Observable<Object> {

      return this.http.post<Object>(this.BASE_URL, formdata).pipe(
          catchError(this.handleError<Object>("basicPost")),
      );
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

      return (): Observable<T> => {
          return of(result as T);
      };
  }
}
