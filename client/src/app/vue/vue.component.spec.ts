import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VueComponent } from './vue.component';
import { FormsModule } from '@angular/forms';

 
describe('VueComponent', () => {
  let component: VueComponent;
  let fixture: ComponentFixture<VueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VueComponent ],
      imports : [FormsModule]
      
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  // test isAlphanumeric()
  it('check if numbers and letters are alphanumeric', ()=> {
    expect(component.isAlphanumeric('AA55ss')).toBe(true);
  });

  it('checks if an non-alphanumeric chain makes it return false', ()=> {
    expect(component.isAlphanumeric('er-%:')).toBe(false);
  });

  // test validateName
  it('checks if the emtpy string is rejected', ()=> {
    expect(component.validateName('')).toBe(false);
  });

  it('checks if a too short string is rejected', ()=> {
    expect(component.validateName('Jo')).toBe(false);
    expect(component.validateName('TOM')).toBe(false);
    expect(component.validateName('eva')).toBe(false);
    expect(component.validateName('1v3')).toBe(false);
    expect(component.validateName('123')).toBe(false);
  });

  it('checks if a too long string is rejected', ()=> {
    expect(component.validateName('JonathanSmith33')).toBe(false);
    expect(component.validateName('1234567891322')).toBe(false);
    expect(component.validateName('123JohnSnow123')).toBe(false);
  });

  it('checks if an alphanumeric string from 4 to 11 caracters is accepted', ()=> {
    expect(component.validateName('JohnSnow')).toBe(true);
    expect(component.validateName('123321')).toBe(true);
    expect(component.validateName('Tom121')).toBe(true);
  });

  it('checks if a chain from 4 to 11 caracters but not alphanumeric is rejected', ()=> {
    expect(component.validateName('/!v:!;!')).toBe(false);
    expect(component.validateName('tom-boy')).toBe(false);
    expect(component.validateName('JO*78*')).toBe(false);
  })

  // test updateUsername
  it('checks if it overwrites a password when a new valid one is entered', ()=> {
    component.username = 'oldUsername';
    component.newUsername = 'newUsername';
    component.updateUsername();
    expect(component.username).toBe('newUsername');
  })
  
  it('checks if it does not overwrites a password when a new non-valid one is entered', ()=> {
    component.username = 'oldUsername';
    component.newUsername = 'notValidUsername';
    component.updateUsername();
    expect(component.username).not.toBe('notValidUsername');
    expect(component.username).toBe('oldUsername');
  })
});
