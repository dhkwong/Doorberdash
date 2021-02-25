import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestauranteditdishComponent } from './restauranteditdish.component';

describe('RestauranteditdishComponent', () => {
  let component: RestauranteditdishComponent;
  let fixture: ComponentFixture<RestauranteditdishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestauranteditdishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestauranteditdishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
