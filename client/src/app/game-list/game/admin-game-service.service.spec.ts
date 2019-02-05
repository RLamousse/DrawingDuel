import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from "@angular/common/http";
import { AdminGameServiceService } from './admin-game-service.service';

describe('AdminGameServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientModule],

  }));

  it('should be created', () => {
    const service: AdminGameServiceService = TestBed.get(AdminGameServiceService);
    expect(service).toBeTruthy();
  });
});
