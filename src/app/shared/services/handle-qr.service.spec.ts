import { TestBed, inject } from '@angular/core/testing';

import { HandleQrService } from './handle-qr.service';

describe('HandleQrService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HandleQrService]
    });
  });

  it('should be created', inject([HandleQrService], (service: HandleQrService) => {
    expect(service).toBeTruthy();
  }));
});
