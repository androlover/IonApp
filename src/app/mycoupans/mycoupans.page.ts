import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-coupans',
  templateUrl: './mycoupans.page.html',
  styleUrls: ['./mycoupans.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule] 

})
export class MyCouponsPage implements OnInit {

  winningsList: any[] = [];
  isLoading: boolean = true;
  userId: string = "user12345"; // later dynamic

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getWinnings();
  }

  getWinnings() {
    const url = `https://qaapi.yuvaap.dev/api/Scratchcard/getMyWinningsByUserId?userId=${this.userId}`;

    console.log("📤 API Call:", url);

    this.http.get(url).subscribe({
      next: (res: any) => {
        console.log("✅ API Response:", res);
        this.winningsList = res?.data || [];
        this.isLoading = false;
      },
      error: err => {
        console.log("❌ API Error:", err);
        this.isLoading = false;
      }
    });
  }

  claimPrize(url: string) {
    window.open(url, "_blank");
  }
}
