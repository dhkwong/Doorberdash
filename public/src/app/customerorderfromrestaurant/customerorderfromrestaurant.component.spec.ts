import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerorderfromrestaurantComponent } from './customerorderfromrestaurant.component';

describe('CustomerorderfromrestaurantComponent', () => {
  let component: CustomerorderfromrestaurantComponent;
  let fixture: ComponentFixture<CustomerorderfromrestaurantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerorderfromrestaurantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerorderfromrestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
