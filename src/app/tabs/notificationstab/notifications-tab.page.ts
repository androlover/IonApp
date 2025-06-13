import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-notifications-tab',
  templateUrl: './notifications-tab.page.html',
  styleUrls: ['./notifications-tab.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class NotificationsTabPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
