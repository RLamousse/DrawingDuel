import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {

  public title: string = "Jeu1";
  public soloScores: Array<number> = [0, 0, 0];
  public duoScores: Array<number> = [0, 0, 0];
  public soloNames: Array<string>;
  public duoNames: Array<string>;
  public image: string = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/LutraCanadensis_fullres.jpg/290px-LutraCanadensis_fullres.jpg";
  public games: Array<GameComponent> = [];
  public randomUsername: Array<string> = ["DarkCat", "SilverTommy", "SpongeBob", "Smasher22", "PeterPan", "SpinningTom", "LightSoul"];
  private minimumRandomScore: number = 15;
  private maximumRandomScore: number = 25;
  private maximumSecond: number = 59;
  private numberOfScoresToDisplay: number = 3;

  constructor() {}

  ngOnInit() {
    this.soloScores = this.generateRandomScores();
    this.soloNames = this.generateRandomNames();
    this.duoScores = this.generateRandomScores();
    this.duoNames = this.generateRandomNames();
    /*this.addGame(this.title, this.generateRandomScores(), this.generateRandomScores(), this.generateRandomNames(), this.generateRandomNames(), this.title);
    console.log(this.games);*/
  }
  
  /*private createGame(title: string, soloScores: Array<number>, duoScores: Array<number>, soloNames: Array<string>, duoNames: Array<string>, image: string): GameComponent{
    let game: GameComponent = new GameComponent;
    game.title = title;
    game.soloScores = soloScores;
    game.duoScores = duoScores;
    game.soloNames = soloNames;
    game.duoNames = duoNames;
    game.image = image;
    return game;
  }*/

  /*private addGame(game : GameComponent) {
    this.games.push(game);
  }*/

  // Methods to generate scores and usernames
  private generateRandom(min: number, max: number): number {
    return Number((min + Math.random() * (max - min)).toFixed(0));
  }

  private generateAscendingOrderRandoms(arraySize: number, min: number, max: number): Array<number>{
    const numArray: number[] = [];
    for (let i: number = 0; i < arraySize; i++){
      numArray.push(this.generateRandom(min, max));
    }
    numArray.sort((a, b) => {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      } else {
        return 0;
      }
    });

    return numArray;
  }

  public generateRandomScores(): Array<number> {
    const scoreArray: Array<number> = this.generateAscendingOrderRandoms(this.numberOfScoresToDisplay,
                                                                         this.minimumRandomScore,
                                                                         this.maximumRandomScore);
    const seconds: number[] =  this.generateAscendingOrderRandoms(scoreArray.length, 0, this.maximumSecond);
    for (let i in scoreArray){
      scoreArray[i] += (seconds[i] / 100);
    }

    return scoreArray;
  }

  public generateRandomNames(): Array<string> {
    const usernamesArray: string[] = [];
    for (let i: number = 0; i < this.numberOfScoresToDisplay; i++) {
      usernamesArray.push(this.randomUsername[this.generateRandom(0, this.randomUsername.length - 1)]);
    }

    return usernamesArray;
  }
}
