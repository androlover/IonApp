import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pastevents',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './pastevents.page.html',
  styleUrls: ['./pastevents.page.scss'],
})
export class PasteventsPage {

  winningsList: any[] = [];
  eventId: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.eventId = Number(params['eventId'] || 0);
      console.log("Event ID:", this.eventId);

      if (this.eventId > 0) {
        this.getWinnings(this.eventId);
      }
    });
  }

  getWinnings(eventId: number) {
    fetch(`https://yuvaap.dev/api/Scratchcard/getMyWinningsByEventId?eventId=${eventId}`)
      .then(res => res.json())
      .then(response => {
        console.log("API Response:", response);

        this.winningsList =
          response.success && response.data ? response.data : [];
      })
      .catch(err => {
        console.error("API Error:", err);
        this.winningsList = [];
      });
  }
}
