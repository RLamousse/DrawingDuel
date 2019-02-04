import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { UserValidationMessage } from "../../../common/communication/UserValidationMessage";

@Injectable()
export class UNListService {

  private static readonly BASE_URL: string = "http://localhost:3000/api/usernames";
  public constructor(private http: HttpClient) {}

  public static username: string = "";
  private minLength: number = 4;
  public message: string;
  public username: string = "";
  public response: UserValidationMessage = {
    username: "", available: true,
  };

  public async sendReleaseRequest(): Promise<UserValidationMessage> {
    return this.http.post<UserValidationMessage>(UNListService.BASE_URL + "/release", {
                                                  username: UNListService.username,
                                                  available: false,
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

  public isAlphanumeric(testString: string): boolean {
    if (testString.match(/^[a-zA-Z0-9]+$/i) !== null) {

      return true;
    } else {
      this.message = "Tu dois utiliser seulement des caractères alphanumériques!";

      return false;
    }
  }

  public isTooShort(name: string): boolean {
    if (name.length < this.minLength) {
      this.message = "Ton identifiant est trop court!";

      return true;
    }

    return false;
  }
  public async validateName(name: string): Promise<boolean> {
    if (!this.isTooShort(name) && this.isAlphanumeric(name)) {
      await this.sendUserRequest(name).toPromise().then((response: UserValidationMessage) => {
        this.response = response;
      }).catch();
      if (!this.response.available) {
        this.message = "Cet identifiant est deja pris! Essaie un nouvel identifiant";

        return false;
      }

    } else { return false; }

    return true;
  }
}
