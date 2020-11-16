import { TestBed } from '@angular/core/testing';

import { ExelFilesService } from './exel-files.service';

describe('ExelFilesService', () => {
  let service: ExelFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExelFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
