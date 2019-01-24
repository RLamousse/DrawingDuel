import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
@Injectable()
export class UNListService {

  private readonly BASE_URL: string = "http://localhost:3000/";
  public constructor(private http: HttpClient) { }

  public sendUserRequest(name: string): Observable<boolean> {
    console.log(this.http.post<boolean>(this.BASE_URL,name));
    return this.http.post<boolean>(this.BASE_URL, name)
      .pipe(catchError(this.handleError<boolean>("sendUserRequest")));
  };

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
