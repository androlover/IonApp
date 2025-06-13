import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsTabPage } from './notifications-tab.page';

describe('NotificationsTabPage', () => {
  let component: NotificationsTabPage;
  let fixture: ComponentFixture<NotificationsTabPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
