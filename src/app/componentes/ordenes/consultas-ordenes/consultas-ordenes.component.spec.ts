import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultasOrdenesComponent } from './consultas-ordenes.component';

describe('ConsultasOrdenesComponent', () => {
  let component: ConsultasOrdenesComponent;
  let fixture: ComponentFixture<ConsultasOrdenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultasOrdenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultasOrdenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
