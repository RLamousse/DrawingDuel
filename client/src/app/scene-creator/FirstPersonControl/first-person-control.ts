import { Directive, HostListener } from "@angular/core";
import * as KeyCode from "keycode-js";
import { SceneRendererService } from "../scene-renderer.service";

@Directive({ selector: "[appFPControlEvent]" })
export class FirstPersonControlDirective {
  private rightClickHold: boolean;
  public constructor( private sceneRendererService: SceneRendererService ){
    this.rightClickHold = false;
  }

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
  @HostListener("document:mousedown", ["$event"])
  public mousedown($event: MouseEvent): void {
    if($event.which === 3) {
      this.rightClickHold = true;
      this.sceneRendererService.rightClickHold(true, $event.clientX, $event.clientY);
    }
  }

  @HostListener("document:mouseup", ["$event"])
  public mouseup($event: MouseEvent): void {
    if(this.rightClickHold){
      this.rightClickHold = false;
      this.sceneRendererService.rightClickHold(false, $event.clientX, $event.clientY);
    }
  }
  @HostListener("document:mousemove", ["$event"])
  public mousemove($event: MouseEvent): void {
    if(this.rightClickHold){
      this.sceneRendererService.rotateCamera($event.clientX, $event.clientY);
    }
  }
}
