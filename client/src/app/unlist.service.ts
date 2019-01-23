import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { UNList } from '../../../common/communication/message';
import { catchError} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
@Injectable()
export class UNListService {

  private readonly BASE_URL: string = "http://localhost:3000/";
  public constructor(private http: HttpClient) { }

  public getUserList(): Observable<UNList> {
    return this.http.get<UNList>(this.BASE_URL)
      .pipe(catchError(this.handleError<UNList>("getUserList")));
  };

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
