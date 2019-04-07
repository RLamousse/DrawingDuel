import {Component, Input, ViewChild} from "@angular/core";
import {
  createWebsocketMessage,
  ChatMessage,
  ChatMessagePosition,
  ChatMessageType, WebsocketMessage
} from "../../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../../common/communication/socket-events";
import {AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../../common/errors/services.errors";
import {OnlineType} from "../../../../../common/model/game/game";
import {DifferenceCluster, DIFFERENCE_CLUSTER_POINTS_INDEX} from "../../../../../common/model/game/simple-game";
import {tansformOrigin, IPoint} from "../../../../../common/model/point";
import {SocketService} from "../../socket.service";
import {UNListService} from "../../username.service";
import {playRandomSound, NO_DIFFERENCE_SOUNDS} from "../game-sounds";
import {PixelData, SimpleGameCanvasComponent, TextType} from "../simple-game-canvas/simple-game-canvas.component";
import {SimpleGameService} from "../simple-game.service";

export const IDENTIFICATION_ERROR_TIMOUT_MS: number = 1000;
export const IDENTIFICATION_ERROR_TEXT: string = "Erreur";

@Component({
             selector: "app-simple-game-container",
             templateUrl: "./simple-game-container.component.html",
             styleUrls: ["./simple-game-container.component.css"],
           })
export class SimpleGameContainerComponent {

  @Input() public originalImage: string;
  @Input() public modifiedImage: string;

  @ViewChild("originalImageComponent") private originalImageComponent: SimpleGameCanvasComponent;
  @ViewChild("modifiedImageComponent") private modifiedImageComponent: SimpleGameCanvasComponent;

  protected clickEnabled: boolean = true;

  public constructor(private simpleGameService: SimpleGameService,
                     private socket: SocketService) {
  }

  protected async onOriginalCanvasClick(clickEvent: IPoint): Promise<void> {
    return this.onCanvasClick(clickEvent, this.originalImageComponent);
  }

  protected async onModifiedCanvasClick(clickEvent: IPoint): Promise<void> {
    return this.onCanvasClick(clickEvent, this.modifiedImageComponent);
  }

  private async onCanvasClick(clickEvent: IPoint, clickedComponent: SimpleGameCanvasComponent): Promise<void> {
    if (!this.clickEnabled) {
      return;
    }
    this.clickEnabled = false;

    return this.simpleGameService.validateDifferenceAtPoint(clickEvent)
      .then((differenceCluster: DifferenceCluster) => {
        this.notifyClickToWebsocket(true);
        const differencePoints: IPoint[] = differenceCluster[DIFFERENCE_CLUSTER_POINTS_INDEX]
          .map((point: IPoint) => tansformOrigin(point, this.originalImageComponent.height));
        const pixels: PixelData[] = this.originalImageComponent.getPixels(differencePoints);
        this.modifiedImageComponent.drawPixels(pixels);
        this.clickEnabled = true;
      })
      .catch((reason: Error) => {
        if (reason.message === AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE ||
          reason.message === NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE) {
          playRandomSound(NO_DIFFERENCE_SOUNDS);
          this.handleIdentificationError(clickEvent, clickedComponent);
        }
        this.notifyClickToWebsocket(false);
      });
  }

  private notifyClickToWebsocket(good: boolean): void {
    const message: WebsocketMessage<ChatMessage> = createWebsocketMessage<ChatMessage>(
      {
        gameName: "",
        playerCount: OnlineType.SOLO,
        playerName: UNListService.username,
        position: ChatMessagePosition.NA,
        timestamp: new Date(),
        type: good ? ChatMessageType.DIFF_FOUND : ChatMessageType.DIFF_ERROR,
      });
    this.socket.send(SocketEvent.CHAT, message);
  }

  private handleIdentificationError(clickEvent: IPoint, clickedComponent: SimpleGameCanvasComponent): void {
    const pixelsBackup: Uint8ClampedArray = clickedComponent.getRawPixelData();
    clickedComponent.drawText(
      IDENTIFICATION_ERROR_TEXT,
      tansformOrigin(clickEvent, clickedComponent.height),
      TextType.ERROR);

    setTimeout(
      () => {
        clickedComponent.setRawPixelData(pixelsBackup);
        this.clickEnabled = true;
      },
      IDENTIFICATION_ERROR_TIMOUT_MS,
    );
  }
}
