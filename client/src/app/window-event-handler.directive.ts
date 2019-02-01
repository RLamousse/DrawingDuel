import { Directive, HostListener } from "@angular/core";
import { UNListService } from "./username.service";
import { UserValidationMessage } from "../../../common/communication/UserValidationMessage";

@Directive({ selector: "[appUnloadEvent]" })
export class WindowEventHandlerDirective {

  public constructor(private userService: UNListService) { }

  public static beforeUnloadMessage: string = "";
  private noUsername: string = "empty username passed";
  private usernameLoggedIn: string = "username released";

  @HostListener("window:beforeunload", ["$event"])
  public beforeUnload($event: Event): void {
    if (UNListService.username.length !== 0) {
      this.userService.sendReleaseRequest().then((response: UserValidationMessage) => {
        if (response.available) {
          WindowEventHandlerDirective.beforeUnloadMessage = this.usernameLoggedIn;
        }
      });
    } else {
      WindowEventHandlerDirective.beforeUnloadMessage = this.noUsername;
    }
    $event.returnValue = true;
  }
}
