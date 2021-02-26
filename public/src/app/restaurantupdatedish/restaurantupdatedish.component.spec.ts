import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantupdatedishComponent } from './restaurantupdatedish.component';

describe('RestaurantupdatedishComponent', () => {
  let component: RestaurantupdatedishComponent;
  let fixture: ComponentFixture<RestaurantupdatedishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantupdatedishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantupdatedishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
