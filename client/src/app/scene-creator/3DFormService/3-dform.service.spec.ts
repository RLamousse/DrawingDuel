import { TestBed } from '@angular/core/testing';

import { Form3DService } from './3-dform.service';

describe('3DFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Form3DService = TestBed.get(Form3DService);
    expect(service).toBeTruthy();
  });
});
