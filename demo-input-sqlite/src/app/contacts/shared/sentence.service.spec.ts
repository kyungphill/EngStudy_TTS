import { TestBed } from '@angular/core/testing';

import { SentenceService } from './sentence.service';

describe('SentenceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SentenceService = TestBed.get(SentenceService);
    expect(service).toBeTruthy();
  });
});
