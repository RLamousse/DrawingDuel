import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {of, Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {DB_FREE_GAME, DB_SIMPLE_GAME, SERVER_BASE_URL} from "../../../common/communication/routes";
import {IJson3DObject} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IExtendedFreeGame} from "../../../common/model/game/extended-free-game";
import {IFreeGame} from "../../../common/model/game/free-game";
import {IGame} from "../../../common/model/game/game";
import {ISimpleGame} from "../../../common/model/game/simple-game";
import {FreeGameCreatorService} from "./scene-creator/FreeGameCreator/free-game-creator.service";
import {FreeGamePhotoService} from "./scene-creator/free-game-photo-service/free-game-photo.service";
import {IScene} from "./scene-interface";

@Injectable({
              providedIn: "root",
            })
export class GameService {
  public simpleGames: ISimpleGame[] = [];
  public freeGames: IFreeGame[] = [];
  public extendedFreeGames: IExtendedFreeGame[] = [];
  public readonly SIMPLE_GAME_BASE_URL: string = SERVER_BASE_URL + DB_SIMPLE_GAME;
  public readonly FREE_GAME_BASE_URL: string = SERVER_BASE_URL + DB_FREE_GAME;

  private readonly GET_SIMPLEGAME_ERROR: string = "get simple game from server error";
  private readonly GET_FREEGAME_ERROR: string = "get free game from server error";
  private readonly GET_FREEGAME_BY_NAME_ERROR: string = "get free game by name from server error";
  private readonly DELETE_GAME_BY_NAME: string = "delete game by name server error";

  public constructor(
    private http: HttpClient,
    private photoService: FreeGamePhotoService,
    private freeGameCreatorService: FreeGameCreatorService,
  ) {
  }

  private convertTimeScores(seconds: number): number {
    const COEFFICIENT: number = 0.6;
    const MINUTE: number = 60;
    const DECIMALS: number = 2;
    seconds /= MINUTE;

    return Number((Math.floor(seconds) + ((seconds - Math.floor(seconds)) * COEFFICIENT)).toFixed(DECIMALS));
  }

  public convertScoresObject(game: IGame[]): IGame[] {
    for (const i in game) {
      if (game.hasOwnProperty(i)) {
        for (const j in game[i].bestSoloTimes) {
          if (game[i].bestSoloTimes.hasOwnProperty(j)) {
            game[i].bestSoloTimes[j].time = this.convertTimeScores(game[i].bestSoloTimes[j].time);
            game[i].bestMultiTimes[j].time = this.convertTimeScores(game[i].bestMultiTimes[j].time);
          }
        }
      }
    }

    return game;
  }

  public pushSimpleGames(simpleGamesToModify: ISimpleGame[]): void {
    this.simpleGames = [];
    this.convertScoresObject(simpleGamesToModify);
    for (const game of simpleGamesToModify) {
      this.simpleGames.push(game);
    }
  }

  public pushFreeGames(freeGamesToModify: IFreeGame[]): void {
    this.freeGames = [];
    this.extendedFreeGames = [];
    this.convertScoresObject(freeGamesToModify);
    for (const game of freeGamesToModify) {
      this.freeGames.push(game);
    }
    for (const game of this.freeGames) {
      const scenes: IScene = this.freeGameCreatorService.createScenes(game.scenes);
      const extendedFreeGame: IExtendedFreeGame = {
        thumbnail: this.photoService.takePhoto(scenes.scene),
        scenes: game.scenes,
        gameName: game.gameName,
        bestSoloTimes: game.bestSoloTimes,
        bestMultiTimes: game.bestMultiTimes,
      };
      this.extendedFreeGames.push(extendedFreeGame);
    }
  }

  public getSimpleGames(): Observable<ISimpleGame[]> {
    return this.http.get<ISimpleGame[]>(this.SIMPLE_GAME_BASE_URL).pipe(
      catchError(this.handleError<ISimpleGame[]>(this.GET_SIMPLEGAME_ERROR)),
    );
  }

  public getFreeGames(): Observable<IFreeGame[]> {
    return this.http.get<IFreeGame[]>(this.FREE_GAME_BASE_URL).pipe(
      catchError(this.handleError<IFreeGame[]>(this.GET_FREEGAME_ERROR)),
    );
  }

  public getFreeGameByName(gameName: string): Observable<IFreeGame> {
    return this.http.get<IFreeGame>(this.FREE_GAME_BASE_URL + gameName + "/").pipe(
      catchError(this.handleError<IFreeGame>(this.GET_FREEGAME_BY_NAME_ERROR)),
    );
  }

  public deleteSimpleGameByName(gameName: string): void {
   this.http.delete(this.SIMPLE_GAME_BASE_URL + gameName).pipe(
      catchError(this.handleError<IFreeGame>(this.DELETE_GAME_BY_NAME)),
    ).subscribe();

  }

  public deleteFreeGameByName(gameName: string): void {
    this.http.delete(this.FREE_GAME_BASE_URL + gameName).pipe(
       catchError(this.handleError<IFreeGame>(this.DELETE_GAME_BY_NAME)),
     ).subscribe();

   }

  public async loadCheatData(gameName: string): Promise<IJson3DObject[]> {
    return new Promise<IJson3DObject[]>((resolve) => {

      this.http.get<IFreeGame>(
        SERVER_BASE_URL + DB_FREE_GAME + gameName).subscribe((value: IFreeGame) => {
        // @ts-ignore //TODO remove the ignore after anthony merge
        resolve(value.scenes.differentObjects);
      });
    });
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
