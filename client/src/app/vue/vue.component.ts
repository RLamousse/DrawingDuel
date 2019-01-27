import { Component, Input, OnInit } from "@angular/core";
import { UserValidationMessage } from "../../../../common/communication/UserValidationMessage";
import { UNListService } from "../username.service";

@Component({
  selector: "app-vue",
  templateUrl: "./vue.component.html",
  styleUrls: ["./vue.component.css"],
})
export class VueComponent implements OnInit {

  @Input() private newUsername: string;
  private message: string;
  private username: string = "inconnu";
  private errorMessage: string = "";
  private minLenght: number = 4;
  private response: UserValidationMessage;

  public constructor(
    private userService: UNListService,
  ) { }

  ngOnInit() { }

  public async updateUsername() {
    if (await this.validateName(this.newUsername)) {
      this.username = this.newUsername;
    }
    this.errorMessage = this.message;
  }

  public isAlphanumeric(testString: string): boolean{
    return testString.match(/^[a-zA-Z0-9]+$/i) !== null;
  }

  public async isAvailable(username: string): Promise<UserValidationMessage> {
    return  this.userService.sendUserRequest(username).toPromise();
  }
  public async validateName(name: string) {
    if (name.length < this.minLenght) {
      this.message = "Ton identifiant est trop court!";

      return false;
    }
    if (!this.isAlphanumeric(name)) {
      this.message = "Tu dois utiliser seulement des caractères alphanumériques!";

      return false;
    }

    await this.isAvailable(name).then((response: UserValidationMessage) => this.response = response);
    if (!this.response.available) {
      this.message = "Cet identifiant est deja pris! Essaie un nouvel identifiant";

      return false;
    }
    this.message = "Ton identifiant est valide!!!";

    return (true);
  }
}
