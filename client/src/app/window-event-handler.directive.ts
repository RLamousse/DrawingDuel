import { Directive, HostListener } from "@angular/core";
import { UNListService } from "./username.service";

@Directive({ selector: "[unloadevent]" })
export class WindowEventHandler {

  private userService: UNListService;

  @HostListener("window:beforeunload", ["$event"])
  beforeUnload($event: EventTarget): void {
    console.log(performance.navigation.type);
    if (UNListService.username.length != 0 && window.closed == true) {
      console.log(window.closed == true);
      console.log(UNListService.username);
      this.userService.sendReleaseRequest();
      UNListService.username = "";
    }
  }
}
