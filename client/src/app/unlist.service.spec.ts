import { TestBed } from '@angular/core/testing';

import { UNListService } from './unlist.service';
describe('UNListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UNListService = TestBed.get(UNListService);
    expect(service).toBeTruthy();
  });
});
