import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { UserValidationMessage } from "../../../common/communication/UserValidationMessage";
import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class UNListService {

  private static readonly BASE_URL: string = "http://localhost:3000/api/usernames";
  public constructor(private http: HttpClient) {}

  public static username: string = "";

  public async sendReleaseRequest(): Promise<UserValidationMessage> {
    return this.http.post<UserValidationMessage>(UNListService.BASE_URL + "/release",
      {
        username: UNListService.username,
        available: false
      }).toPromise<UserValidationMessage>();
  }

  public sendUserRequest(name: string): Observable<UserValidationMessage> {
    return this.http.post<UserValidationMessage>(UNListService.BASE_URL + "/add", { username: name, available: false })
      .pipe(catchError(this.handleError<UserValidationMessage>("sendUserRequest")));
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
