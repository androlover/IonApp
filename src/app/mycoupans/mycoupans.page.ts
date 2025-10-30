import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-coupons',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './mycoupans.page.html',
  styleUrls: ['./mycoupans.page.scss'],
})
export class MyCouponsPage {

  coupons: any[] = [];

  constructor(private router: Router) {}

  ionViewWillEnter() {
    this.coupons = [
      { id: 1, title: '10% Off', code: 'SAVE10' },
      { id: 2, title: 'Free Entry Pass', code: 'FREEPASS' }
    ];
  }
}
