import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-marketing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-marketing-page.component.html',
  styleUrls: ['./video-marketing-page.component.css']
})
export class VideoMarketingPageComponent {
  videos = Array.from({ length: 3 }, (_, index) => index + 1);
}
