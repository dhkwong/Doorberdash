import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerloginregComponent } from './customerloginreg.component';

describe('CustomerloginregComponent', () => {
  let component: CustomerloginregComponent;
  let fixture: ComponentFixture<CustomerloginregComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerloginregComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerloginregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
