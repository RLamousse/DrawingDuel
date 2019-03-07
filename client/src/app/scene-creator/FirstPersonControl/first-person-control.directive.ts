import { Directive, HostListener } from "@angular/core";
import { SceneRendererService } from "../scene-renderer.service";

@Directive({ selector: "[appFPControlEvent]" })
export class FirstPersonControlDirective {
  private readonly keyW: string = "KeyW";
  private readonly keyS: string = "KeyS";
  private readonly keyA: string = "KeyA";
  private readonly keyD: string = "KeyD";
  private rightClickHold: boolean;
  public constructor( private sceneRendererService: SceneRendererService ) {
    this.rightClickHold = false;
  }

  @HostListener("document:keydown", ["$event"])
  public keyPressed($event: KeyboardEvent): void {
    if ( $event.code === this.keyW ) {
      this.sceneRendererService.moveForward(true);
    }
    if ( $event.code === this.keyS ) {
      this.sceneRendererService.moveBackward(true);
    }
    if ( $event.code === this.keyA) {
      this.sceneRendererService.moveLeft(true);
    }
    if ( $event.code === this.keyD ) {
      this.sceneRendererService.moveRight(true);
    }
  }
  @HostListener("document:keyup", ["$event"])
  public keyReleased($event: KeyboardEvent): void {
    if ($event.code === this.keyW) {
      this.sceneRendererService.moveForward(false);
    }
    if ($event.code === this.keyS) {
      this.sceneRendererService.moveBackward(false);
    }
    if ($event.code === this.keyA) {
      this.sceneRendererService.moveLeft(false);
    }
    if ($event.code === this.keyD) {
      this.sceneRendererService.moveRight(false);
    }
  }
  @HostListener("document:mousedown", ["$event"])
  public mousedown($event: MouseEvent): void {
    const RIGHT_BUTTON: number = 2;
    const LEFT_BUTTON: number = 0;
    const CANVAS_TAG: string = "CANVAS";
    if ($event.button === RIGHT_BUTTON) {
      this.rightClickHold = true;
      this.sceneRendererService.rightClickHold(true, $event.clientX, $event.clientY);
    } else if ($event.button === LEFT_BUTTON && $event.srcElement.tagName === CANVAS_TAG) {
      $event.preventDefault(); // No more textHighlight when hold click + mouseMove
      console.log($event.clientX - $event.srcElement.getBoundingClientRect().left);

      this.sceneRendererService.getClickedObject(
        $event.clientX - $event.srcElement.getBoundingClientRect().left,
        evt.clientY - $event.srcElement.getBoundingClientRect().top
      );
    }
  }

  @HostListener("document:mouseup", ["$event"])
  public mouseup($event: MouseEvent): void {
    if (this.rightClickHold) {
      this.rightClickHold = false;
      this.sceneRendererService.rightClickHold(false, $event.clientX, $event.clientY);
    }
  }

  @HostListener("document:mousemove", ["$event"])
  public mousemove($event: MouseEvent): void {
    if (this.rightClickHold) {
      this.sceneRendererService.rotateCamera($event.clientX, $event.clientY);
    }
  }
}
