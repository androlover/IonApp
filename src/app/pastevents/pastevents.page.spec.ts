import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasteventsPage } from './pastevents.page';

describe('PasteventsPage', () => {
  let component: PasteventsPage;
  let fixture: ComponentFixture<PasteventsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PasteventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
