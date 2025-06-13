import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-tab',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './home-tab.page.html',
})
export class HomeTabPage implements OnInit {
  users: any[] = [];
  postId: string | null = '';
  tab: string | null = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // ✅ Get query parameters from URL
    this.route.queryParamMap.subscribe(params => {
      this.postId = params.get('postId');
      this.tab = params.get('tab');

      console.log('Received postId:', this.postId);
      console.log('Received tab:', this.tab);
    });
  }
}
