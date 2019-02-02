import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})

export class GameComponent implements OnInit {

  public constructor() {}

  @Input() public title: string;
  @Input() public soloScores: Array<number> = [0, 0, 0];
  @Input() public duoScores: Array<number> = [0, 0, 0];
  @Input() public soloNames: Array<string>;
  @Input() public duoNames: Array<string>;
  @Input() public image: string;

  // Methods to generate scores and usernames
  public static generateRandom(min: number, max: number): number {
    return Number((min + Math.random() * (max - min)).toFixed(0));
  }

  public static generateAscendingOrderRandoms(arraySize: number, min: number, max: number): Array<number> {
    const numArray: number[] = [];
    for (let i: number = 0; i < arraySize; i++) {
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

  public static generateRandomScores(): Array<number> {
    const numberOfScoresToDisplay: number = 3;
    const minimumRandomScore: number = 15;
    const maximumRandomScore: number = 25;
    const maximumSecond: number = 59;
    const scoreArray: Array<number> = this.generateAscendingOrderRandoms(numberOfScoresToDisplay,
                                                                         minimumRandomScore,
                                                                         maximumRandomScore);
    const seconds: number[] =  this.generateAscendingOrderRandoms(scoreArray.length, 0, maximumSecond);
    // tslint:disable-next-line:forin
    const coefficient: number = 100;
    for (const i in scoreArray) {
      scoreArray[i] += (seconds[i] / coefficient);
    }

    return scoreArray;
  }

  public static generateRandomNames(): Array<string> {
    const randomUsername: Array<string> = ["DarkCat", "SilverTommy", "SpongeBob", "Smasher22", "PeterPan", "SpinningTom", "LightSoul"];
    const numberOfScoresToDisplay: number = 3;
    const usernamesArray: string[] = [];
    for (let i: number = 0; i < numberOfScoresToDisplay; i++) {
      usernamesArray.push(randomUsername[this.generateRandom(0, randomUsername.length - 1)]);
    }

    return usernamesArray;
  }

  public ngOnInit() {}
}
