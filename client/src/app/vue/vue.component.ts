import { Component, OnInit, Input } from '@angular/core';
import { UNListService } from '../unlist.service';

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
  available: boolean;
  

  constructor(
    private userService: UNListService
  ) { }

  ngOnInit() {

  }
  
  updateUsername(){
    if (this.validateName(this.newUsername))
      this.username = this.newUsername;
    this.errorMessage = this.message;
  }

  isAlphanumeric(testString : string){
    return testString.match(/^[a-zA-Z0-9]+$/i) !== null;
  }

  isAvailable(username: string): boolean {
    this.userService.sendUserRequest(this.newUsername).subscribe((avail: boolean) => this.available = avail);
    if (!this.available) {
        this.message = 'Cette identifiant est deja pris! Essaie un nouvel identifiant'
        return false;
      }
    //this.userNameList.usernameList.push(username);
    this.message = 'Ton identifiant est valide!!!'
    return true;
  }
  validateName(name : string){
    if (name.length < 4) {
      this.message = 'Ton identifiant est trop court!';
      return false;
    }
    if (name.length > 12){
      this.message = 'Ton nom est trop long!';
      return false;
    }
    if (!this.isAlphanumeric(name)) {
      this.message = 'Tu dois utiliser seulement des caractères alphanumériques!';
      return false;
    }
    else {
      if (!this.isAvailable(name)) {
        this.message = 'Ce nom est deja pris! Essai un nouveau nom';
        return false;
      }
      return (true);   
    }
  }
}
