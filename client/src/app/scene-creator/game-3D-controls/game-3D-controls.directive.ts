import {Directive, HostListener} from "@angular/core";
import {RenderUpdateService} from "../render-update.service";

@Directive({ selector: "[appFPControlEvent]" })
export class Game3DControlsDirective {
  private readonly keyW: string = "KeyW";
  private readonly keyS: string = "KeyS";
  private readonly keyA: string = "KeyA";
  private readonly keyD: string = "KeyD";
  public constructor( private renderUpdateService: RenderUpdateService ) {}

  @HostListener("document:keydown", ["$event"])
  public keyPressed($event: KeyboardEvent): void {
    if ( $event.code === this.keyW ) {
      this.renderUpdateService.moveForward(true);
    }
    if ( $event.code === this.keyS ) {
      this.renderUpdateService.moveBackward(true);
    }
    if ( $event.code === this.keyA) {
      this.renderUpdateService.moveLeft(true);
    }
    if ( $event.code === this.keyD ) {
      this.renderUpdateService.moveRight(true);
    }
  }
  @HostListener("document:keyup", ["$event"])
  public keyReleased($event: KeyboardEvent): void {
    if ($event.code === this.keyW) {
      this.renderUpdateService.moveForward(false);
    }
    if ($event.code === this.keyS) {
      this.renderUpdateService.moveBackward(false);
    }
    if ($event.code === this.keyA) {
      this.renderUpdateService.moveLeft(false);
    }
    if ($event.code === this.keyD) {
      this.renderUpdateService.moveRight(false);
    }
  }
  @HostListener("document:mousedown", ["$event"])
  public mousedown($event: MouseEvent): void {
    const RIGHT_BUTTON: number = 2;
    if ($event.button === RIGHT_BUTTON) {
      this.renderUpdateService.rightClick = true;
      this.renderUpdateService.rightClickHold($event.clientX, $event.clientY);
    }
  }

  @HostListener("document:mouseup", ["$event"])
  public mouseup($event: MouseEvent): void {
    if (this.renderUpdateService.rightClick) {
      this.renderUpdateService.rightClick = false;
    }
  }

  @HostListener("document:mousemove", ["$event"])
  public mousemove($event: MouseEvent): void {
    if (this.renderUpdateService.rightClick) {
      this.renderUpdateService.rotationCamera($event.clientX, $event.clientY);
    }
  }
}
