import { HttpClient } from "@angular/common/http";
import { Injectable, Directive, HostListener } from "@angular/core";

import { UserValidationMessage } from "../../../common/communication/UserValidationMessage";
import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable() @Directive({ selector: "[unloadevent]" })
export class UNListService {

  static readonly BASE_URL: string = "http://localhost:3000/api/usernames";
  public constructor(private http: HttpClient) { }

  static username: string = "";

  @HostListener ("window:beforeunload")
  static sendReleaseRequest(): void {
    console.log("sendrelease is called");
    let xhr = new XMLHttpRequest();
    //XML used to make sync post request
    xhr.open("POST", UNListService.BASE_URL + "/release", false);
    xhr.send(UNListService.username);
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
