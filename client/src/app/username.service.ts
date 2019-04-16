import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { WebsocketMessage } from "../../../common/communication/messages/message";
import { UserValidationMessage } from "../../../common/communication/messages/user-validation-message";
import { SocketEvent } from "../../../common/communication/socket-events";
import {ComponentNavigationError} from "../../../common/errors/component.errors";
import { SocketService } from "./socket.service";

@Injectable()
export class UNListService implements CanActivate {

  public static username: string = "";
  private readonly NON_ALPHANUMERIC_MESSAGE: string = "Caractères alphanumériques seulement!";
  private readonly USERNAME_TOO_SHORT_MESSAGE: string = "Ton identifiant est trop court!";
  private readonly USERNAME_TAKEN_MESSAGE: string = "Cet identifiant est deja pris! Essaie un nouvel identifiant";
  private readonly USERNAME_MIN_LENGTH: number = 4;
  private readonly usernameValidationRegex: RegExp = /^[a-zA-Z0-9]+$/i;

  private readonly minLength: number;
  public message: string;
  public username: string;
  public response: UserValidationMessage;
  private readonly NAVIGATION_MESSAGE: string = "Un comportement de navigation suspect a été détecté," +
    "vous avez été ramené à la page d'acceuil pour des raisons de sécurité!";

  public constructor(private websocket: SocketService, private router: Router) {
    this.minLength = this.USERNAME_MIN_LENGTH;
    this.message = "";
    this.username = "";
    this.response = {
      username: "", available: true,
    };
  }

  public isAlphanumeric(testString: string): boolean {
    if (testString.match(this.usernameValidationRegex) !== null) {

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
      this.handleUserNameCheck(answer, callback);
      sub.unsubscribe();
    });

    return true;
  }

  private handleUserNameCheck(answer: WebsocketMessage<boolean>, callback: (answer: boolean) => void): boolean {
    if (!answer.body) {
      this.message = this.USERNAME_TAKEN_MESSAGE;
    }
    callback(answer.body);

    return answer.body;
  }

  public canActivate(): boolean  {
    if (UNListService.username) {
      return true;
    } else {
      this.router.navigate([""])
        .then(() => {
          alert(this.NAVIGATION_MESSAGE);
        })
        .catch(() => {
          throw new ComponentNavigationError();
        });

      return false;
    }
  }
}
