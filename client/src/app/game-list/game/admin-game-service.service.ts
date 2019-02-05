import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { of, Observable } from "rxjs";
import { catchError } from 'rxjs/operators';
import {Message} from '../../../../../common/communication/message';

@Injectable({
  providedIn: 'root'
})
export class AdminGameServiceService {

  public readonly BASE_URL: string = "https://localhost:3000/api/data-base/get-games";

  constructor(private http: HttpClient) { }


  public deleteGames(gameName : string) : Observable<Message>{
    return this.http.delete<Message>(`${this.BASE_URL}/${gameName}`, ).pipe(
      catchError(this.handleError<Message>("wrong ID"))
    );

  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    console.log("error");
  
    return (error: Error): Observable<T> => {
        return of(result as T);
    };
  }
}
