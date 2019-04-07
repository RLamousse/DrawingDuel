import { Injectable } from "@angular/core";
import Axios, {AxiosError} from "axios";
import {from, Observable} from "rxjs";
import {Message} from "../../../common/communication/messages/message";
import {SERVER_BASE_URL} from "../../../common/communication/routes";

@Injectable({
  providedIn: "root",
})
export class FormPostService {
  public static readonly NETWORK_ERROR_MESSAGE: string = "La requête n'a pas pu être acheminée depuis le client";
  public static readonly BACKEND_ERROR_MESSAGE: string = "La requête n'a pas pu être acheminée depuis le client";
  public submitForm(route: string, body: FormData | {}): Observable<Object> {

    return from(new Promise((resolve, reject) => {
      Axios.post<Message>(SERVER_BASE_URL + route, body)
        .then((value) => resolve(value.data))
        .catch((e: AxiosError) => reject(this.handleError(e)));
    }));
  }

  private handleError(error: AxiosError): Error {
    // @ts-ignore
    let err: Error;
    if (!error.response) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.message);
      err = {
        name: "Network Error",
        message: FormPostService.NETWORK_ERROR_MESSAGE,
      };
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.response.status}, ` +
        `body was: ${error.response.data.message}`);
      err = {
        name: "Backend Error",
        message: error.response ? error.response.data.message : FormPostService.BACKEND_ERROR_MESSAGE,
      };
    }
    // return an observable with a user-facing error message

    return err;
  }
}
