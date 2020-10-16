import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestauranthomeComponent } from './restauranthome.component';

describe('RestauranthomeComponent', () => {
  let component: RestauranthomeComponent;
  let fixture: ComponentFixture<RestauranthomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestauranthomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestauranthomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
