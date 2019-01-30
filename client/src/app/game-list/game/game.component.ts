import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  public title: string= "Jeu1";
  public soloScores: Array<number> = [0, 0, 0];
  public duoScores: Array<number> = [0, 0, 0];
  public randomUsername: Array<string> = ["DarkCat", "SilverTommy", "SpongeBob", "Smasher22", "PeterPan", "SpinningTom", "LightSoul"];
  private minimumRandomScore: number = 7;
  private maximumRandomScore: number = 25;
  /*private premier: number = 0;
  private second: number = 1;
  private troisième: number =2;*/

  constructor() { }

  ngOnInit() {
    this.generateRandomScores(this.soloScores);
    this.generateRandomScores(this.duoScores);
  }

  private generateRandom(min: number, max: number):number{
    return Number((min + Math.random() * (max-min)).toFixed(0));
  }

  public generateRandomScores(scoreArray:Array<number>):Array<number>{
    scoreArray[2] = this.generateRandom(this.minimumRandomScore, this.maximumRandomScore) + this.generateRandom(0, 60)/100;
    scoreArray[0] = this.generateRandom(this.minimumRandomScore, scoreArray[2]) + this.generateRandom(0, 60)/100;
    scoreArray[1] = this.generateRandom(scoreArray[2], scoreArray[0]) + this.generateRandom(0, 60)/100;
    return scoreArray;
  }

  public generateRandomName(array: Array<string>):string{
    return array[this.generateRandom(0, array.length-1)];
  }
}
