import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  eventId=0;
  userId = '';
  selectedCity = '';
  winnersList: any[] = [];
  prizeData: any;

  scratchCount = 0;
  scratchReady = false;
  isWinner = false;
  isScratched = false;

  rewardScenario = 0; // 1 = winner, 2 = loser
  couponCode = '';
  couponUrl = '';
  description='';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.name = params['name'] || '';
      this.eventtype = params['eventtype'] || '';
      this.userId = params['userid'] || '';
      this.selectedCity = params['eventName'] || '';
      this.winnersList = params['winners'] ? JSON.parse(params['winners']) : [];
      this.eventId=params['eventId'];
      console.log("✅ UserId:", this.userId);
      console.log("👑 Winners List:", this.winnersList);

      if (this.userId) this.addScratchcardClick();
    });
  }
  // ✅ Hit API to get scratch count
  addScratchcardClick() {
    const apiUrl = `https://qaapi.yuvaap.dev/api/Scratchcard/AddScratchcardClick?userId=${this.userId}`;
    console.log("📡 Sending Scratch Count Request...");

    this.http.post(apiUrl, {}).subscribe({
      next: (response: any) => {
        console.log("✅ Scratch Count Response:", response);

        if (response?.data?.count !== undefined) {
          this.scratchCount = response.data.count;
          console.log("🎯 Scratch Count =", this.scratchCount);
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
    if (!this.winnersList || !Array.isArray(this.winnersList)) return;
    this.isWinner = this.winnersList.some(
      (w: any) => Number(w?.scratchCount) === Number(this.scratchCount)
    );
    if(this.isWinner) {
this.getPrizeDetails(this.eventId,this.scratchCount)
    }
    else {
      this.getPrizeDetails(this.eventId,this.scratchCount)
    }
    this.decideScratchStart();

    console.log("🏆 Is Winner:", this.isWinner);

  }

 getPrizeDetails(eventId: number, winnerId: number) {
  const url = `https://qaapi.yuvaap.dev/api/Scratchcard/GetPrizeDetailOfUser?eventId=eventId&winnerId=winnerId`;
console.log("✅ Prize API Response:", eventId , winnerId);
  this.http.get(url).subscribe({
    next: (res: any) => {
      console.log("✅ Prize API Response:", res);
      this.prizeData = res; // store response
      this.couponCode=res.couponCode;
      this.description=res.prizeDescription;
      this.couponUrl=res.ecomerceUrl
    },
    error: (err) => {
      console.error("❌ API Error:", err);
    }
  });
}
copyCoupon() {
  if (!this.couponCode) return;

  navigator.clipboard.writeText(this.couponCode).then(() => {
    alert("✅ Coupon Copied!");
  });
}


saveWinnerDetails(userId: string, winnerId: number, eventId: number) {
  const url = 'https://qaapi.yuvaap.dev/api/Scratchcard/saveWinnerDetails';

  const body = {
    userId: userId,
    winnerId: 9,
    eventId: 18
  };

  console.log("📤 API Request: ", body);

  return this.http.post(url, body).subscribe({
    next: (res) => {
      console.log("✅ API Response: ", res);
    },
    error: (err) => {
      console.log("❌ API Error: ", err);
    }
  });
}




  decideScratchStart() {
    // if (this.scratchCount >= 3) {
    //   alert("Scratch limit reached for today!");
    //   this.scratchReady = false;
    //   return;
    // }

    this.rewardScenario = this.isWinner ? 1 : 2;
    console.log("🎁 rewardScenario:", this.rewardScenario);

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

    this.copyCoupon;

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

    const checkScratchPercentage = () => {
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const total = img.data.length / 4;
      let cleared = 0;

      for (let i = 0; i < img.data.length; i += 4) {
        if (img.data[i + 3] === 0) cleared++;
      }

      if ((cleared / total) * 100 > 50 && !this.isScratched) {
        this.isScratched = true;
        this.saveWinnerDetails(this.userId,this.scratchCount,this.eventId)
      }
    };

    const draw = (e: any) => {
      if (!isDrawing) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
      checkScratchPercentage();
    };

    canvas.addEventListener('mousedown', e => {
      isDrawing = true;
      scratch(getPos(e).x, getPos(e).y);
    });

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => (isDrawing = false));
    canvas.addEventListener('mouseleave', () => (isDrawing = false));

    canvas.addEventListener('touchstart', e => {
      isDrawing = true;
      scratch(getPos(e).x, getPos(e).y);
    });

    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', () => (isDrawing = false));
  }
}
