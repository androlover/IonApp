import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Add this line

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule], // ✅ Include CommonModule here
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  name: string | null = '';
  mobile: string | null = '';
  userid: string | null = '';
  date: string | null = '';
  appid: string | null = '';
  eventtype: string | null = '';

  url: string = 'https://localhost:8100/dashboard/home?name=roshan&mobile=1234567890&userid=user12345&date=13-06-2025&appid=yuvaap&eventtype=scratch';
  colleges: string[] = ['Hi Tech','IMS Engeneering','ABES Engineering','Jaypee Institure'];
selectedCityIndex: number | null = null;
  constructor(private router: Router) {}

    selectCity(index: number) {
    this.selectedCityIndex = index;
  }

  ngOnInit() {
    const params = new URL(this.url).searchParams;
    this.name = params.get('name');
    this.mobile = params.get('mobile');
    this.userid = params.get('userid');
    this.date = params.get('date');
    this.appid = params.get('appid');
    this.eventtype = params.get('eventtype');

    console.log('Name:', this.name);
    console.log('Mobile:', this.mobile);
    console.log('UserID:', this.userid);
    console.log('Date:', this.date);
    console.log('AppID:', this.appid);
    console.log('Event Type:', this.eventtype);
  }
}
