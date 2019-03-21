import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { WebsocketMessage } from "../../../common/communication/messages/message";
import { UserValidationMessage } from "../../../common/communication/messages/user-validation-message";
import { SocketEvent } from "../../../common/communication/socket-events";
import { SocketService } from "./socket.service";

@Injectable()
export class UNListService {

  public static username: string = "";
  private readonly NON_ALPHANUMERIC_MESSAGE: string = "Tu dois utiliser seulement des caractères alphanumériques!";
  private readonly USERNAME_TOO_SHORT_MESSAGE: string = "Ton identifiant est trop court!";
  private readonly USERNAME_TAKEN_MESSAGE: string = "Cet identifiant est deja pris! Essaie un nouvel identifiant";
  private readonly USERNAME_MIN_LENGTH: number = 4;
  private readonly regex: RegExp = /^[a-zA-Z0-9]+$/i;

  private minLength: number;
  public message: string;
  public username: string;
  public response: UserValidationMessage;

  public constructor(private websocket: SocketService) {
    this.minLength = this.USERNAME_MIN_LENGTH;
    this.message = "";
    this.username = "";
    this.response = {
      username: "", available: true,
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

  public checkAvailability(username: string, callback: (answer: boolean) => void): boolean {
    if (this.isTooShort(username) || !this.isAlphanumeric(username)) {
      callback(false);

      return false;
    }

    const message: WebsocketMessage<string> = {
      title: SocketEvent.USERNAME_CHECK,
      body: username,
    };
    this.websocket.send(SocketEvent.USERNAME_CHECK, message);
    const sub: Subscription = this.websocket.onEvent<boolean>(SocketEvent.USERNAME_CHECK).subscribe((answer: WebsocketMessage<boolean>) => {
      if (!answer.body) {
        this.message = this.USERNAME_TAKEN_MESSAGE;
      }
      callback(answer.body);
      sub.unsubscribe();
    });

    return true;
  }
}
