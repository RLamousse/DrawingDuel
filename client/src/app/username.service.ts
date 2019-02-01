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
  private minLenght: number = 4;
  public message: string;
  public username: string = "";
  private response: UserValidationMessage;

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
    return testString.match(/^[a-zA-Z0-9]+$/i) !== null;
  }

  private async isAvailable(username: string): Promise<UserValidationMessage> {
    return this.sendUserRequest(username).toPromise();
  }
  public async validateName(name: string): Promise<boolean> {
    if (name.length < this.minLenght) {
      this.message = "Ton identifiant est trop court!";

      return false;
    }
    if (!this.isAlphanumeric(name)) {
      this.message = "Tu dois utiliser seulement des caractères alphanumériques!";

      return false;
    }

    await this.isAvailable(name).then((response: UserValidationMessage) => {
      this.response = response;
    });
    if (!this.response.available) {
      this.message = "Cet identifiant est deja pris! Essaie un nouvel identifiant";

      return false;
    }
    this.message = "Ton identifiant est valide!!!";

    return (true);
  }
}
