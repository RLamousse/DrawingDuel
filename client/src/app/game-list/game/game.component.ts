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
  public randomUsername: Array<string> = ["DarkCat", "SilverTommy", "SpongeBob", "Smasher22", "PeterPan", "SpinningTom", "LightSoul"];
  private minimumRandomScore: number = 15;
  private maximumRandomScore: number = 25;
  private maximumSecond: number = 59;
  private numberOfScoresToDisplay: number = 3;

  constructor() {}

  ngOnInit() {
    this.soloScores = this.generateRandomScores();
    this.duoScores = this.generateRandomScores();
  }

  private generateRandom(min: number, max: number): number {
    return Number((min + Math.random() * (max - min)).toFixed(0));
  }

  private generateAscendingOrderRandoms(arraySize: number, min: number, max: number):Array<number>{
    let numArray: number[] = [];
    for(let i: number = 0; i < arraySize; i++){
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

  public generateRandomScores():Array<number>{
    const scoreArray: Array<number> = this.generateAscendingOrderRandoms(this.numberOfScoresToDisplay, this.minimumRandomScore, this.maximumRandomScore);
    const seconds: number[] =  this.generateAscendingOrderRandoms(scoreArray.length, 0, this.maximumSecond);
    for (let i in scoreArray){
      scoreArray[i] += (seconds[i] / 100);
    }

    return scoreArray;
  }

  public generateRandomName(array: Array<string>): string {
    return array[this.generateRandom(0, array.length - 1)];
  }
}
