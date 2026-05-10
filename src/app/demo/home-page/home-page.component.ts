import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'moji-home-page',
  imports: [CommonModule, SharedModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  encapsulation: ViewEncapsulation.None // Allow styles to leak to children but not affect parent
})
export class HomePageComponent implements OnInit
{
  ngOnInit()
  {
    // Remove any existing global styles that might interfere
    this.removeGlobalStyles();
    this.loadPageStyles();
  }

  private removeGlobalStyles()
  {
    // Remove existing theme styles if needed
    const themeStyles = document.querySelectorAll('link[href*="theme"], style[data-theme]');
    themeStyles.forEach(style => style.remove());
  }

  private loadPageStyles()
  {
    // Your landing page specific styles
    const cssFiles = [
      'assets/home-page-assests/assets/css/bootstrap-5.0.5-alpha.min.css',
      'assets/home-page-assests/assets/css/LineIcons.2.0.css',
      'assets/home-page-assests/assets/css/animate.css',
      'assets/home-page-assests/assets/css/tiny-slider.css',
      'assets/home-page-assests/assets/css/main.css'
    ];

    cssFiles.forEach(file =>
    {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = file;
      link.setAttribute('data-landing-page', 'true'); // Mark for identification
      document.head.appendChild(link);
    });
  }

  ngOnDestroy()
  {
    // Clean up when leaving the page
    this.cleanupStyles();
  }

  private cleanupStyles()
  {
    const landingStyles = document.querySelectorAll('link[data-landing-page="true"]');
    landingStyles.forEach(style => style.remove());
  }
}
