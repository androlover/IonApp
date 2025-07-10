import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss'],
})
export class AboutPage implements OnInit, AfterViewInit {
  @ViewChild('scratchCanvas') scratchCanvas!: ElementRef<HTMLCanvasElement>;

  name = '';
  eventtype = '';
  selectedCity = '';

  isScratched = false;
  rewardScenario = 0;
  couponCode = 'TREHI15';
  couponUrl = 'https://trehiorganics.com/discount';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.name = params['name'] || '';
      this.eventtype = params['eventtype'] || '';
      this.selectedCity = params['city'] || '';
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.setupScratchCard(), 300);
  }

  claimNow() {
    navigator.clipboard.writeText(this.couponCode).finally(() => {
      window.open(this.couponUrl, '_blank');
    });
  }

  setupScratchCard() {
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
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    };

    const getPos = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches ? e.touches[0] : e;
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    };

    const checkScratchPercentage = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const total = imageData.data.length / 4;
      let cleared = 0;

      for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] === 0) cleared++;
      }

      const percentage = (cleared / total) * 100;
      if (percentage > 50 && !this.isScratched) {
        this.isScratched = true;
        this.rewardScenario = Math.random() < 0.5 ? 1 : 2;
      }
    };

    const drawHandler = (e: any) => {
      if (!isDrawing) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
      checkScratchPercentage();
    };

    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
      checkScratchPercentage();
    });

    canvas.addEventListener('mousemove', drawHandler);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseleave', () => isDrawing = false);

    canvas.addEventListener('touchstart', (e) => {
      isDrawing = true;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
      checkScratchPercentage();
    });

    canvas.addEventListener('touchmove', drawHandler);
    canvas.addEventListener('touchend', () => isDrawing = false);
  }
}
