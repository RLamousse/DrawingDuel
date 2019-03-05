import { Directive, HostListener } from "@angular/core";
import * as KeyCode from "keycode-js";
import { SceneRendererService } from "../scene-renderer.service";

@Directive({ selector: "[appFPControlEvent]" })
export class FirstPersonControlDirective {
  public constructor( private sceneRendererService: SceneRendererService ){}

  @HostListener("document:keydown", ["$event"])
  public keyPressed($event: KeyboardEvent): void {
    if ( $event.keyCode === KeyCode.KEY_W ) {
      // call scene-renderer-service to avancer
      this.sceneRendererService.moveForward();
    }
  }
}
