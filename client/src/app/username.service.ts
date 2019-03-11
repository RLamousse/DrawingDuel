import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, Observable, Subscription } from "rxjs";
import { catchError } from "rxjs/operators";
import { WebsocketMessage } from "../../../common/communication/messages/message";
import { UserValidationMessage } from "../../../common/communication/messages/user-validation-message";
import { SERVER_BASE_URL, USERNAME_BASE } from "../../../common/communication/routes";
import { SocketEvent } from "../../../common/communication/socket-events";
import { SocketService } from "./socket.service";

@Injectable()
export class UNListService {

  public static username: string = "";
  private static readonly BASE_URL: string = SERVER_BASE_URL + USERNAME_BASE;
  private readonly NON_ALPHANUMERIC_MESSAGE: string = "Tu dois utiliser seulement des caractères alphanumériques!";
  private readonly USERNAME_TOO_SHORT_MESSAGE: string = "Ton identifiant est trop court!";
  private readonly USERNAME_TAKEN_MESSAGE: string = "Cet identifiant est deja pris! Essaie un nouvel identifiant";
  private readonly USERNAME_MIN_LENGTH: number = 4;
  private readonly regex: RegExp = /^[a-zA-Z0-9]+$/i;

  private minLength: number;
  public message: string;
  public username: string;
  public response: UserValidationMessage;

  public constructor(private http: HttpClient,
                     private websocket: SocketService) {

    this.minLength = this.USERNAME_MIN_LENGTH;
    this.message = "";
    this.username = "";
    this.response = {
    username: "", available: true,
  };
  }

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
    if (testString.match(this.regex) !== null) {

      return true;
    } else {
      this.message = this.NON_ALPHANUMERIC_MESSAGE;

      return false;
    }
  }

  public isTooShort(name: string): boolean {
    if (name.length < this.minLength) {
      this.message = this.USERNAME_TOO_SHORT_MESSAGE;

      return true;
    }

    return false;
  }

  public async validateName(name: string): Promise<boolean> {
    if (this.isTooShort(name) || !this.isAlphanumeric(name)) {
      return false;
    }

    return this.sendUserRequest(name).toPromise().then((response: UserValidationMessage) => {
        this.response = response;
        if (typeof this.response !== "undefined" && !this.response.available) {
        this.message = this.USERNAME_TAKEN_MESSAGE;

          return false;
        }

        return typeof this.response !== "undefined";
      });
  }
}
