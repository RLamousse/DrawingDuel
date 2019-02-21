import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: "app-simple-game-container",
  templateUrl: "./simple-game-container.component.html",
  styleUrls: ["./simple-game-container.component.css"],
})
export class SimpleGameContainerComponent implements OnInit {

  @Input() public originalImage: string;
  @Input() public modifiedImage: string;

  public constructor() { }

  public ngOnInit() {
  }

}
