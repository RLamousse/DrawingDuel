import { Directive, HostListener } from "@angular/core";
import { UNListService } from "./username.service";

@Directive({ selector: "[appUnloadEvent]" })
export class WindowEventHandlerDirective {

  public constructor(
    private userService: UNListService) { }

  public static beforeUnloadMessage: string = "";

  @HostListener("window:beforeunload", ["$event"])
  public beforeUnload($event: Event): void {
    if (UNListService.username.length !== 0) {
      $event.returnValue = true;
    }
  }

  @HostListener("window:unload", ["$event"])
  public unload($event: Event): void {
    this.userService.sendReleaseRequest().then().catch();
  }
}
