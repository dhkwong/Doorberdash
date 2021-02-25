import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerplaceorderComponent } from './customerplaceorder.component';

describe('CustomerplaceorderComponent', () => {
  let component: CustomerplaceorderComponent;
  let fixture: ComponentFixture<CustomerplaceorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerplaceorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerplaceorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
