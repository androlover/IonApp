import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pastevents',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './pastevents.page.html',
  styleUrls: ['./pastevents.page.scss'],
})
export class PasteventsPage {

  winningsList: any[] = [];

  constructor() {
    this.getWinnings();
  }

  getWinnings() {
    const eventId = 18;

    fetch(`https://qaapi.yuvaap.dev/api/Scratchcard/getMyWinningsByEventId?eventId=${eventId}`)
      .then(res => res.json())
      .then(response => {
        console.log("API Response:", response);
        this.winningsList = (response.success && response.data) ? response.data : [];
      })
      .catch(err => {
        console.error("API Error:", err);
        this.winningsList = [];
      });
  }

}
