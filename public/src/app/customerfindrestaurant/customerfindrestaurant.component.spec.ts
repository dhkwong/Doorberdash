import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerfindrestaurantComponent } from './customerfindrestaurant.component';

describe('CustomerfindrestaurantComponent', () => {
  let component: CustomerfindrestaurantComponent;
  let fixture: ComponentFixture<CustomerfindrestaurantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerfindrestaurantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerfindrestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
