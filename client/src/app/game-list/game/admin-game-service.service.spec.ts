import { TestBed } from '@angular/core/testing';

import { AdminGameServiceService } from './admin-game-service.service';

describe('AdminGameServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminGameServiceService = TestBed.get(AdminGameServiceService);
    expect(service).toBeTruthy();
  });
});
