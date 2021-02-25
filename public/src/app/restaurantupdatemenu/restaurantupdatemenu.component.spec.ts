import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantupdatemenuComponent } from './restaurantupdatemenu.component';

describe('RestaurantupdatemenuComponent', () => {
  let component: RestaurantupdatemenuComponent;
  let fixture: ComponentFixture<RestaurantupdatemenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantupdatemenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantupdatemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
