import { Component, OnInit, Input } from '@angular/core';
import { UNListService } from '../unlist.service';
import { UserValidationMessage } from "../../../../common/communication/UserValidationMessage";

@Component({
  selector: 'app-vue',
  templateUrl: './vue.component.html',
  styleUrls: ['./vue.component.css']
})
export class VueComponent implements OnInit {

  @Input() newUsername: string;
  message : string;
  username: string = 'inconnu';
  errorMessage: string = '';

  response: UserValidationMessage;

  constructor(
    private userService: UNListService
  ) { }

  ngOnInit() {

  }
  
  updateUsername(){
    if (this.validateName(this.newUsername)) {
      this.username = this.newUsername;
    }
    this.errorMessage = this.message;
  }

  isAlphanumeric(testString : string){
    return testString.match(/^[a-zA-Z0-9]+$/i) !== null;
  }

  async isAvailable(username: string): Promise<UserValidationMessage> {
    return  this.userService.sendUserRequest(username).toPromise();
  }
  async validateName(name : string){
    if (name.length < 4) {
      this.message = 'Ton identifiant est trop court!';
      return false;
    }
    if (name.length > 12){
      this.message = 'Ton identifiant est trop long!';
      return false;
    }
    if (!this.isAlphanumeric(name)) {
      this.message = 'Tu dois utiliser seulement des caractères alphanumériques!';
      return false;
    }
    else {

      this.isAvailable(name).then((response: UserValidationMessage) => this.response = response);
      if (!this.response.available) {
        this.message = 'Cet identifiant est deja pris! Essaie un nouvel identifiant';
        return false;
      }
      this.message = 'Ton identifiant est valide!!!';
      return (true);   
    }
  }
}
