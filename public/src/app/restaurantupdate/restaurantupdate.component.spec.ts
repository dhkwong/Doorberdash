import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantupdateComponent } from './restaurantupdate.component';

describe('RestaurantupdateComponent', () => {
  let component: RestaurantupdateComponent;
  let fixture: ComponentFixture<RestaurantupdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantupdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
