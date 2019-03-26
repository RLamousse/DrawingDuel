import { Component, Input, OnInit } from "@angular/core";
import {WebsocketMessage} from "../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../common/communication/socket-events";
import { IFreeGame } from "../../../../common/model/game/free-game";
import { ISimpleGame } from "../../../../common/model/game/simple-game";
import { GameService } from "../game.service";
import {SocketService} from "../socket.service";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})

export class GameListComponent implements OnInit {

  @Input() protected readonly rightButton: string = "joindre";
  @Input() protected readonly leftButton: string = "jouer";

  public constructor(private gameService: GameService, private socket: SocketService, ) {
    this.reloadList = this.reloadList.bind(this);
  }

  public ngOnInit(): void {
    this.gameService.getSimpleGames().subscribe((simpleGamesToPush: ISimpleGame[]) => {
      this.gameService.pushSimpleGames(simpleGamesToPush);
    });

    this.gameService.getFreeGames().subscribe((freeGamesToPush: IFreeGame[]) => {
      this.gameService.pushFreeGames(freeGamesToPush);
    });

  }

}
