import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
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

  colleges: any[] = [];
  upcomingEvents: any[] = [];
  pastEvents: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // ✅ Fetch query params dynamically (works for any domain)
    this.route.queryParams.subscribe(params => {
      this.name = params['name'] || '';
      this.mobile = params['mobile'] || '';
      this.userid = params['userid'] || '';
      this.date = params['date'] || '';
      this.appid = params['appid'] || '';
      this.eventtype = params['eventtype'] || '';

      console.log('✅ Query Params:', params);

      this.fetchCollegesFromAPI();
    });
  }

  fetchCollegesFromAPI() {
    const apiUrl = 'https://qaapi.yuvaap.dev/api/Scratchcard/getAllScratchcardEvents';

    this.http.get<any>(apiUrl).subscribe({
      next: (res) => {
        console.log('API Success:', res);

        if (res.success == '200' && res.data?.length > 0) {
          const today = new Date();
          const events = JSON.parse(JSON.stringify(res.data));
          events.sort((a: any, b: any) =>
            new Date(b.eventScheduleDate).getTime() - new Date(a.eventScheduleDate).getTime()
          );

          this.colleges = [];
          this.upcomingEvents = [];
          this.pastEvents = [];

          events.forEach((event: any) => {
            const scheduleDate = new Date(event.eventScheduleDate);
            const expireDate = new Date(event.eventExpireDate);

            if (scheduleDate > today) {
              this.upcomingEvents.push(event);
            } else if (expireDate < today) {
              this.pastEvents.push(event);
            } else {
              this.colleges.push(event);
            }
          });
        } else {
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
    this.router.navigate(['/mycoupans']);
  }

  goToPostEvents() {
    this.router.navigate(['/pastevents']);
  }

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
