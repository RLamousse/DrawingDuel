import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError } from 'rxjs/operators';
import { UserValidationMessage } from "../../../common/communication/UserValidationMessage";



@Injectable()
export class UNListService {

  private readonly BASE_URL: string = "http://localhost:3000/api/usernames";
  public constructor(private http: HttpClient) { }

  public sendUserRequest(name: string): Observable<UserValidationMessage> {
    return this.http.post<UserValidationMessage>(this.BASE_URL, { username: name, available: false })
      .pipe(catchError(this.handleError<UserValidationMessage>("sendUserRequest")));
  };
  

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
