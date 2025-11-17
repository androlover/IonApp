import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss'],
})
export class AboutPage implements OnInit, AfterViewInit {
  @ViewChild('scratchCanvas') scratchCanvas!: ElementRef<HTMLCanvasElement>;

  name = '';
  eventtype = '';
  eventId = 0;
  userId = '';
  selectedCity = '';
  winnersList: any[] = [];
  prizeData: any;

  scratchCount = 0;
  scratchReady = false;
  isWinner = false;
  isScratched = false;

  rewardScenario = 0;
  couponCode = '';
  couponUrl = '';
  description = '';

  constructor(private route: ActivatedRoute, private http: HttpClient,private toastCtrl: ToastController, private navCtrl: NavController ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.name = params['name'] || '';
      this.eventtype = params['eventtype'] || '';
      this.userId = params['userid'] || '';
      this.selectedCity = params['eventName'] || '';
      this.winnersList = params['winners'] ? JSON.parse(params['winners']) : [];
      this.eventId = Number(params['eventId']);

      console.log("✅ UserId:", this.userId);

      console.log("✅ eventId:", this.eventId);
      console.log("👑 Winners List:", this.winnersList);

      //this.userId='user12345'
      if (this.userId) this.addScratchcardClick();
    });
  }

  // ✅ Hit API to get scratch count
  addScratchcardClick() {
    const apiUrl = `https://yuvaap.dev/api/Scratchcard/AddScratchcardClick?userId=${this.userId}&eventId=${this.eventId}`;
    

    console.log("✅ apiUrl eventId:", this.eventId);
    //console.log("✅ apiUrl", apiUrl);

    this.http.post(apiUrl, {}).subscribe({
      next: (response: any) => {
        if (response?.data?.count !== undefined) {
          this.scratchCount = response.data.count;

          console.error("GOT THE COUNT NUMBER", this.scratchCount);
        }
        this.checkWinner();
      },
      error: err => {
        console.error("❌ Scratch API Error:", err);
        this.decideScratchStart();
      }
    });
  }

  checkWinner() {
    this.isWinner = this.winnersList.some(
      (w: any) => Number(w?.scratchCount) === Number(this.scratchCount)
    );

    this.getPrizeDetails(this.eventId, this.scratchCount);

    this.decideScratchStart();
  }

  // ✅ FIXED API URL
  getPrizeDetails(eventId: number, winnerId: number) {
    const url = `https://yuvaap.dev/api/Scratchcard/GetPrizeDetailOfUser?eventId=${eventId}&winnerId=${winnerId}`;

    this.http.get(url).subscribe({
      next: (res: any) => {
        this.prizeData = res;
        this.couponCode = res.couponCode;
        this.description = res.prizeDescription;
        this.couponUrl = res.ecomerceUrl;
      },
      error: (err) => {
        console.error("❌ Prize API Error:", err);
      }
    });
  }

async copyCoupon() {
  console.log("coupy coupan pressed");
//  if (!this.couponCode) return;

  await navigator.clipboard.writeText(this.couponCode);

  const toast = await this.toastCtrl.create({
    message: 'Coupon Copied!',
    duration: 1500,
    color: 'success',
    position: 'top'
  });

  toast.present();
}

  // ✅ Dynamic IDs send hone chahiye
  saveWinnerDetails(userId: string, winnerId: number, eventId: number) {
    const url = 'https://yuvaap.dev/api/Scratchcard/saveWinnerDetails';
    const body = {
      userId,
      winnerId,
      eventId
    };

    return this.http.post(url, body).subscribe({
      next: (res) => console.log("✅ Saved Winner Details:", res),
      error: (err) => console.log("❌ API Error:", err)
    });
  }

  decideScratchStart() {
    this.rewardScenario = this.isWinner ? 1 : 2;
    this.scratchReady = true;

    setTimeout(() => this.setupScratchCard(), 300);
  }

  ngAfterViewInit() {}

  claimNow() {
    if (!this.couponUrl || this.couponUrl.trim() === '') {
      alert("⚠️ Coupon URL not found!");
      return;
    }

    let url = this.couponUrl.startsWith("http")
      ? this.couponUrl
      : "https://" + this.couponUrl;

    navigator.clipboard.writeText(this.couponCode).finally(() => {
      window.open(url, "_blank");
    });
  }

  setupScratchCard() {
    if (!this.scratchReady) return;

    const canvas = this.scratchCanvas?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#999';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-out';

    let isDrawing = false;

    const scratch = (x: number, y: number) => {
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
    };

    const getPos = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };

    // ✅ FIXED → Reveal only after 50% scratch
    const checkScratchPercentage = () => {
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const total = img.data.length / 4;
      let cleared = 0;

      for (let i = 0; i < img.data.length; i += 4) {
        if (img.data[i + 3] === 0) cleared++;
      }

      const percent = (cleared / total) * 100;

      if (percent > 50 && !this.isScratched) {
        this.isScratched = true;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.saveWinnerDetails(this.userId, this.scratchCount, this.eventId);
      }
    };

    const draw = (e: any) => {
      if (!isDrawing) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
      checkScratchPercentage();
    };

    // Mouse Events
    canvas.addEventListener('mousedown', e => {
      isDrawing = true;
      scratch(getPos(e).x, getPos(e).y);
    });

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseleave', () => isDrawing = false);

    // Touch Events with preventDefault()
    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      isDrawing = true;
      scratch(getPos(e).x, getPos(e).y);
    });

    canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      draw(e);
    });

    canvas.addEventListener('touchend', () => isDrawing = false);
  }

  goBack() {
  this.navCtrl.back();   // Ionic Navigation back
}

}
