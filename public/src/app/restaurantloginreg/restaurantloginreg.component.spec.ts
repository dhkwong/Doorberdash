import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantloginregComponent } from './restaurantloginreg.component';

describe('RestaurantloginregComponent', () => {
  let component: RestaurantloginregComponent;
  let fixture: ComponentFixture<RestaurantloginregComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantloginregComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantloginregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
