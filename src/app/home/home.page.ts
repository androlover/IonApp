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

  colleges: any[] = [];

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
   // const apiUrl = 'https://qaapi.yuvaap.dev/api/Scratchcard/getAllScratchcardEvents';
    //const apiUrl = '/api/Scratchcard/getAllScratchcardEvents'; // ✅ Local proxy path
     const apiUrl = 'https://qaapi.yuvaap.dev/api/Scratchcard/getAllScratchcardEvents';  // ✅ Always same
 
    this.http.get<any>(apiUrl).subscribe({
      next: (res) => {
        console.log('API Success:', res);
        if (res.success == '200' && res.data?.length > 0) {
          this.colleges = res.data;
        } else {
          console.warn('Empty data from API');
          this.colleges = [];
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        this.colleges = [];
      }
    });
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