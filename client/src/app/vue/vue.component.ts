import { Component, OnInit, Input} from '@angular/core';

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

  constructor() { }

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
  
  validateName(name : string){
    if (name.length < 4) {
      this.message = 'Ton identifiant est trop court!';
      return false;
    }
    if (name.length > 12){
      this.message = 'Ton nom est trop long!';
      return false;
    }
    else {
      if (!this.isAlphanumeric(name))
        this.message= 'Tu dois utiliser seulement des caractères alphanumériques!'
      return (this.isAlphanumeric(name));   
    }
  }
}
