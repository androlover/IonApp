import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // ✅ Also import

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule], // ✅ Fix here
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  name: string = '';
  mobile: string = '';
  userid: string = '';
  date: string = '';
  appid: string = '';
  eventtype: string = '';

  url: string = 'https://localhost:8100/dashboard/home?name=roshan&mobile=1234567890&userid=user12345&date=13-06-2025&appid=yuvaap&eventtype=scratch';
 colleges: any[] = [];        // Running events
upcomingEvents: any[] = [];  // Upcoming events
pastEvents: any[] = [];      // Past events

  constructor(private router: Router, private http: HttpClient) {
     try {
    console.log('✅ HomePage constructor reached!');
  } catch (e) {
    console.error('😡 Error in HomePage constructor:', e);
  }
  }

  ngOnInit() {
    const params = new URL(this.url).searchParams;
    this.name = params.get('name') || '';
    this.mobile = params.get('mobile') || '';
    this.userid = params.get('userid') || '';
    this.date = params.get('date') || '';
    this.appid = params.get('appid') || '';
    this.eventtype = params.get('eventtype') || '';

    this.fetchCollegesFromAPI();
  }

 fetchCollegesFromAPI() {
  const apiUrl = 'https://qaapi.yuvaap.dev/api/Scratchcard/getAllScratchcardEvents';

  this.http.get<any>(apiUrl).subscribe({
    next: (res) => {
      console.log('API Success:', res);

      if (res.success == '200' && res.data?.length > 0) {

        const today = new Date();

        const running: any[] = [];
        const upcoming: any[] = [];
        const past: any[] = [];

        // ✅ Always clone array before using
        const events = JSON.parse(JSON.stringify(res.data));

        events.forEach((event: any) => {
          const scheduleDate = new Date(event.eventScheduleDate);
          const expireDate = new Date(event.eventExpireDate);

          if (scheduleDate > today) {
            upcoming.push(event);
          } else if (expireDate < today) {
            past.push(event);
          } else {
            running.push(event);
          }
        });

        // ✅ Assign new array (NO .push)
        this.colleges = [...running];
        this.upcomingEvents = [...upcoming];
        this.pastEvents = [...past];
      } else {
        console.warn('Empty data from API');
        this.colleges = [];
        this.upcomingEvents = [];
        this.pastEvents = [];
      }
    },
    error: (err) => {
      console.error('API Error:', err);
      this.colleges = [];
      this.upcomingEvents = [];
      this.pastEvents = [];
    }
  });
}


  goToMyCoupons() {
  // Navigate to Coupons Page
  this.router.navigate(['/mycoupans']);}


  goToPostEvents() {
  // Navigate to Coupons Page
  this.router.navigate(['/pastevents']);}


  goToCityPage(event: any) {
    this.router.navigate(['/about'], {
      queryParams: {
        name: this.name,
        mobile: this.mobile,
        userid: this.userid,
        date: this.date,
        appid: this.appid,
        eventtype: this.eventtype,
        eventId: event.eventId,
        eventName: event.eventName,
        maximumPerson: event.maximumPerson,
        numberOfWinners: event.numberOfWinners,
        createdBy: event.createdBy,
        createdOn: event.createdOn,
        scheduleDate: event.eventScheduleDate,
        winners: JSON.stringify(event.winners),
      }
    });
  }
}