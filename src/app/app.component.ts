import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true })

  canvas: any;
  ctx: any;
  // CUSTOM OPTION
  title = 'my-app';
  options = [
    "Lose",
    "Lose",
    "Lose",
    "Lose",
    "Lose",
    "$1000000",
    "Lose",
    " 1 Glace",
  ];

  colors = [
    ["#fff", "#44201f"],
    ["#44201f", "#fff"],
    ["black", "#fff"],
  ];

  startAngle = 0;
  arc = Math.PI / (this.options.length / 2);
  spinTimeout: any;
  spinArcStart = 10;
  spinTime = 0;
  spinTimeTotal = 0;
  spinAngleStart = 0
  loading = true;

  ngOnInit(): void {
    this.ctx = CanvasRenderingContext2D
  }

  ngAfterViewInit(): void {
    this.drawRouletteWheel();
  }

  // Drawing Wheel

  drawRouletteWheel() {
    this.ctx = this.canvas.nativeElement.getContext('2d')
    if (this.canvas.nativeElement.getContext('2d')) {
      const outsideRadius = 200;
      const textRadius = 160;
      const insideRadius = 0;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (var i = 0; i < this.options.length; i++) {
        //     // Drawing piece of wheel
        const angle = this.startAngle + i * this.arc;
        const currentColor = i % this.colors.length;
        this.ctx.fillStyle = this.colors[currentColor][0];
        this.ctx.strokeStyle = "#44201f";
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.arc(250, 250, outsideRadius, angle, angle + this.arc, false);
        this.ctx.arc(250, 250, insideRadius, angle + this.arc, angle, true);
        this.ctx.fill();
        this.ctx.save();
        this.ctx.translate(
          255 + Math.cos(angle + this.arc / 2) * textRadius,
          255 + Math.sin(angle + this.arc / 2) * textRadius
        );
        this.ctx.rotate(angle + this.arc / 2 - 0.1);
        const item = this.options[i];

        //     // Adding wheel content
        this.ctx.beginPath();
        this.ctx.font = "20px custom";
        this.ctx.lineWidth = 1;
        const text = this.options[i];
        this.ctx.textAlign = "center";
        this.ctx.strokeStyle = this.colors[currentColor][1];
        this.ctx.fillStyle = this.colors[currentColor][1];
        this.ctx.fillText(text, -this.ctx.measureText(item).width / 2, 0);
        this.ctx.restore();
      }
      this.ctx.restore();
    }
  }

  // // Spin the wheel

  spin() {
    this.spinAngleStart = Math.random() * 10 + 10;
    this.spinTime = 0;
    this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
    this.rotateWheel();
  }

  // // // Rotate wheel
  private rotateWheel=()=> {
    this.spinTime += 7;
    if (this.spinTime >= this.spinTimeTotal) {
      this.stopRotateWheel();
      return;
    }
    let spinAngle =
      this.spinAngleStart - this.easeOut({ t: this.spinTime, b: 0, c: this.spinAngleStart, d: this.spinTimeTotal });
    this.startAngle += (spinAngle * Math.PI) / 180;

    const degrees = ((this.startAngle * 180) / Math.PI) % 360;

    this.options.map((el, index) => {
      const avrg = 360 / this.options.length;
      const marker = document.querySelector('.marker')
      if (Math.abs(avrg * (index + 1) - Math.round(degrees)) < 10) {
        marker?.classList.add("bounce");
        setTimeout(() => {
          marker?.classList.remove("bounce");
        }, 200);
      }
    });
    this.drawRouletteWheel();
    this.spinTimeout = setTimeout(this.rotateWheel, 10);
  }

  // // // Stop Wheel
  stopRotateWheel() {
    clearTimeout(this.spinTimeout);
    const degrees = (this.startAngle * 180) / Math.PI + 90;
    const arcd = (this.arc * 180) / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd);
    this.ctx.save();
    const text = this.options[index];
    alert(`🏆🏆🏆 ${text}.  🏆🏆🏆`);
    this.ctx.restore();
  }

  // // // Animation
  easeOut({ t, b, c, d }: { t: any; b: any; c: any; d: any; }) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  }
}
