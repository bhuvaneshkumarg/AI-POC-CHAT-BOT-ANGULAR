import { TestBed } from '@angular/core/testing';

import { ConversionReportService } from './conversion-report.service';

describe('ConversionReportService', () => {
  let service: ConversionReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversionReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
