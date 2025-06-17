import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('scratchCanvas') scratchCanvas!: ElementRef<HTMLCanvasElement>;

  name: string | null = '';
  mobile: string | null = '';
  userid: string | null = '';
  date: string | null = '';
  appid: string | null = '';
  eventtype: string | null = '';

  url: string = 'https://localhost:8100/dashboard/home?name=roshan&mobile=1234567890&userid=user12345&date=13-06-2025&appid=yuvaap&eventtype=scratch';
  colleges: string[] = ['Hi Tech', 'IMS Engineering', 'ABES Engineering', 'Jaypee Institute'];
  selectedCityIndex: number | null = null;

  isScratched: boolean = false;
  rewardScenario: number = 0; // 1 or 2
  couponCode: string = 'TREHI15';
  couponUrl: string = 'https://trehiorganics.com/discount';

  constructor() {}

  ngOnInit() {
    const params = new URL(this.url).searchParams;
    this.name = params.get('name');
    this.mobile = params.get('mobile');
    this.userid = params.get('userid');
    this.date = params.get('date');
    this.appid = params.get('appid');
    this.eventtype = params.get('eventtype');
  }

  ngAfterViewInit() {
    if (this.selectedCityIndex !== null) {
      setTimeout(() => this.setupScratchCard(), 100);
    }
  }

  selectCity(index: number) {
    this.selectedCityIndex = index;
    this.isScratched = false;
    this.rewardScenario = 0;
    setTimeout(() => this.setupScratchCard(), 300);
  }

  claimNow() {
    navigator.clipboard.writeText(this.couponCode).then(() => {
      window.open(this.couponUrl, '_blank');
    });
  }

  setupScratchCard() {
    const canvas = this.scratchCanvas?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#999';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-out';

    let isDrawing = false;

    const scratch = (x: number, y: number) => {
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    };

    const getPos = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      if (e.touches) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    };

    const checkScratchPercentage = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let total = imageData.data.length / 4;
      let cleared = 0;

      for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] === 0) cleared++;
      }

      const percentage = (cleared / total) * 100;

      if (percentage > 50 && !this.isScratched) {
        this.isScratched = true;
        this.rewardScenario = Math.random() < 0.5 ? 1 : 2; // 50-50 chance
      }
    };

    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
      checkScratchPercentage();
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
      checkScratchPercentage();
    });

    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseleave', () => isDrawing = false);

    canvas.addEventListener('touchstart', (e) => {
      isDrawing = true;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
      checkScratchPercentage();
    });

    canvas.addEventListener('touchmove', (e) => {
      if (!isDrawing) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
      checkScratchPercentage();
    });

    canvas.addEventListener('touchend', () => isDrawing = false);
  }
}
