import { Directive, HostListener } from "@angular/core";
import * as KeyCode from "keycode-js";
import { SceneRendererService } from "../scene-renderer.service";

@Directive({ selector: "[appFPControlEvent]" })
export class FirstPersonControlDirective {
  public constructor( private sceneRendererService: SceneRendererService ){}

  @HostListener("document:keydown", ["$event"])
  public keyPressed($event: KeyboardEvent): void {
    if ( $event.keyCode === KeyCode.KEY_W ) {
      this.sceneRendererService.moveForward(true);
    }
    if ( $event.keyCode === KeyCode.KEY_S ) {
      this.sceneRendererService.moveBackward(true);
    }
    if ( $event.keyCode === KeyCode.KEY_A ) {
      this.sceneRendererService.moveLeft(true);
    }
    if ( $event.keyCode === KeyCode.KEY_D ) {
      this.sceneRendererService.moveRight(true);
    }
  }
  @HostListener("document:keyup", ["$event"])
  public keyReleased($event: KeyboardEvent): void {
    if ($event.keyCode === KeyCode.KEY_W) {
      this.sceneRendererService.moveForward(false);
    }
    if ($event.keyCode === KeyCode.KEY_S) {
      this.sceneRendererService.moveBackward(false);
    }
    if ($event.keyCode === KeyCode.KEY_A) {
      this.sceneRendererService.moveLeft(false);
    }
    if ($event.keyCode === KeyCode.KEY_D) {
      this.sceneRendererService.moveRight(false);
    }
  }
}
