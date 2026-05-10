import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { StyleLoaderService } from '../helpers/style-loader.service';


@Component({
  selector: 'moji-home-page',
  imports: [CommonModule, SharedModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy
{
  constructor(private styleLoader: StyleLoaderService) { }

  async ngOnInit()
  {
    // Load all landing page assets (CSS + JS)
    await this.styleLoader.loadLandingPageAssets();

    // Initialize any landing page specific functionality
    this.initializeLandingPage();
  }

  private initializeLandingPage()
  {
    // Initialize WOW.js for animations
    if (typeof (window as any).WOW !== 'undefined')
    {
      new (window as any).WOW().init();
    }

    // Initialize tiny slider if needed
    if (typeof (window as any).tns !== 'undefined')
    {
      // Initialize sliders
      const sliders = document.querySelectorAll('.slider-active');
      if (sliders.length > 0)
      {
        (window as any).tns({
          container: '.slider-active',
          items: 1,
          slideBy: 'page',
          autoplay: true,
          autoplayButtonOutput: false,
          nav: false,
          controls: true
        });
      }
    }
  }

  ngOnDestroy()
  {
    // Clean up landing page assets when leaving
    this.styleLoader.cleanupLandingPageAssets();
    // Restore default app assets
    this.styleLoader.restoreDefaultAssets();
  }
}
