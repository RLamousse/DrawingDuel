import { Component, Input, OnInit } from "@angular/core";
import { Game } from "../../../../../common/Object/game";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})

export class GameComponent implements OnInit {
  public readonly BASE_URL: string = "localhost:3000/api/data-base/delete-game/";

  public constructor() {/*vide*/}

  @Input() public gameName: string;
  @Input() public bestSoloTimes: Game[];
  @Input() public bestMultiTimes: Game[];
  @Input() public originalImage: string;
  @Input() public rightButton: string;
  @Input() public leftButton: string;
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
    const coefficient: number = 100;
    for (const i in scoreArray) {
      if (scoreArray.hasOwnProperty(i)) {
        scoreArray[i] += (seconds[i] / coefficient);
      }
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

  public ngOnInit(): void {/*void*/}
  public leftButtonClick(): void {
    if (this.leftButton === "supprimer") {
      /* placeholder pour la fonction supprimer */
      // tslint:disable-next-line:no-console
      console.log("Feature supprimer en developpement");
    } else if (this.leftButton === "jouer") {
      /* placeholder pour la fonction jouer */
      // tslint:disable-next-line:no-console
      console.log("Feature jouer en developpement");
    }
  }

  public rightButtonClick(): void {
    if (this.rightButton === "reinitialiser") {
       /* placeholder pour la fonction supprimer */
      // tslint:disable-next-line:no-console
      console.log("Feature reinitialiser en developpement");
    } else if (this.rightButton === "creer") {
      /* placeholder pour la fonction jouer */
      // tslint:disable-next-line:no-console
      console.log("Feature creer en developpement");
    }
  }
}
