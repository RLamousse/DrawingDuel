import {GameType} from "../model/game/game";

export interface IDialogData {
  gameName: string;
  gameType: GameType;
  minutes: number;
  seconds: number;
  userName: string;
}
