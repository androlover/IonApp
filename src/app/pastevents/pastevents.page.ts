import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pastevents',
  standalone: true,
  imports: [IonicModule, CommonModule], // ✅ Yeh zaroor hona chahiye
  templateUrl: './pastevents.page.html',
  styleUrls: ['./pastevents.page.scss'],
})
export class PasteventsPage {
  constructor() {}
}
