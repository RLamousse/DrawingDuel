import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VueComponent } from './vue.component';

 
describe('VueComponent', () => {
  let component: VueComponent;
  let fixture: ComponentFixture<VueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VueComponent ]
    })
    .compileComponents();
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
  it('check if numbers and letters are alphanumeric', function(){
    expect(component.isAlphanumeric('AA55ss')).toBe(true);
  });

  it('checks if an non-alphanumeric chain makes it return false', function(){
    expect(component.isAlphanumeric('er-%:')).toBe(false);
  });

  it('checks if the emtpy string is rejected', function(){
    expect(component.validateName('')).toBe(false);
  });

  it('checks if a too short string is rejected', function(){
    expect(component.validateName('Jo')).toBe(false);
    expect(component.validateName('TOM')).toBe(false);
    expect(component.validateName('eva')).toBe(false);
    expect(component.validateName('1v3')).toBe(false);
    expect(component.validateName('123')).toBe(false);
  });

  it('checks if a too long string is rejected', function(){
    expect(component.validateName('JonathanSmith33')).toBe(false);
    expect(component.validateName('1234567891322')).toBe(false);
    expect(component.validateName('123JohnSnow123')).toBe(false);
  });

  it('checks if an alphanumeric string from 4 to 11 caracters is accepted', function(){
    expect(component.validateName('JohnSnow')).toBe(true);
    expect(component.validateName('123321')).toBe(true);
    expect(component.validateName('Tom121')).toBe(true);
  });

  it('checks if a chain from 4 to 11 caracters but not alphanumeric is rejected', function(){
    expect(component.validateName('/!v:!;!')).toBe(false);
    expect(component.validateName('tom-boy')).toBe(false);
    expect(component.validateName('JO*78*')).toBe(false);
  })

  // test validateName

});
