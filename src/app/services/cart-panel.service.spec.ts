import { TestBed } from '@angular/core/testing';

import { CartPanelService } from './cart-panel.service';

describe('CartPanelService', () => {
  let service: CartPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
