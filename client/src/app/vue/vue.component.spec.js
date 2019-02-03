"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var vue_component_1 = require("./vue.component");
var forms_1 = require("@angular/forms");
describe('VueComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [vue_component_1.VueComponent],
            imports: [forms_1.FormsModule]
        });
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(vue_component_1.VueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    // test isAlphanumeric()
    it('check if numbers and letters are alphanumeric', function () {
        expect(component.isAlphanumeric('AA55ss')).toBe(true);
    });
    it('checks if an non-alphanumeric chain makes it return false', function () {
        expect(component.isAlphanumeric('er-%:')).toBe(false);
    });
    // test validateName
    it('checks if the emtpy string is rejected', function () {
        expect(component.validateName('')).toBe(false);
    });
    it('checks if a too short string is rejected', function () {
        expect(component.validateName('Jo')).toBe(false);
        expect(component.validateName('TOM')).toBe(false);
        expect(component.validateName('eva')).toBe(false);
        expect(component.validateName('1v3')).toBe(false);
        expect(component.validateName('123')).toBe(false);
    });
    it('checks if a too long string is rejected', function () {
        expect(component.validateName('JonathanSmith33')).toBe(false);
        expect(component.validateName('1234567891322')).toBe(false);
        expect(component.validateName('123JohnSnow123')).toBe(false);
    });
    it('checks if an alphanumeric string from 4 to 11 caracters is accepted', function () {
        expect(component.validateName('JohnSnow')).toBe(true);
        expect(component.validateName('123321')).toBe(true);
        expect(component.validateName('Tom121')).toBe(true);
    });
    it('checks if a chain from 4 to 11 caracters but not alphanumeric is rejected', function () {
        expect(component.validateName('/!v:!;!')).toBe(false);
        expect(component.validateName('tom-boy')).toBe(false);
        expect(component.validateName('JO*78*')).toBe(false);
    });
    // test updateUsername
    it('checks if it overwrites username when a new valid one is entered', function () {
        component.username = 'oldUsername';
        component.newUsername = 'newUsername';
        component.updateUsername();
        expect(component.username).toBe('newUsername');
    });
    it('checks if it does not overwrites a userName when a new non-valid one is entered', function () {
        component.username = 'oldUsername2';
        component.newUsername = 'notValidUsername';
        component.updateUsername();
        expect(component.username).not.toBe('notValidUsername');
        expect(component.username).toBe('oldUsername2');
    });
    //Test isAvailable
    it('checks if the entry username is available or already taken', function () {
        expect(component.isAvailable('patate')).toBe(true);
        expect(component.isAvailable('patate')).toBe(false);
        expect(component.isAvailable('patate')).toBe(false);
    });
    it('multiple username with different alphanumeric should pass', function () {
        expect(component.isAvailable('boi48')).toBe(true);
        expect(component.isAvailable('boi49')).toBe(true);
        expect(component.isAvailable('48boi')).toBe(true);
    });
});
//# sourceMappingURL=vue.component.spec.js.map
