import { Directive, HostListener } from "@angular/core";
import { UNListService } from "./username.service";

@Directive({ selector: "[unloadevent]" })
export class WindowEventHandler {

  @HostListener("window:unload", ["$event"])
  beforeUnload($event: EventTarget): void {
    console.log(performance.navigation.type);
    if (UNListService.username.length != 0 && window.closed == true) {
      console.log(window.closed == true);
      console.log(UNListService.username);
      UNListService.sendReleaseRequest();
      UNListService.username = "";
    }
  }
}
