import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StyleLoaderService
{
  private loadedStyles: Map<string, HTMLLinkElement> = new Map();
  private loadedScripts: Map<string, HTMLScriptElement> = new Map();

  loadLandingPageStyles()
  {
    // Remove default styles first
    this.removeDefaultStyles();

    // Load landing page styles
    const landingStyles = [

      { name: 'bootstrap-landing-css', path: 'assets/parallex-assets/css/bootstrap.min.css' },
      { name: 'fontawesome-css', path: 'assets/parallex-assets/css/font-awesome.min.css' },
      { name: 'lineicons-css', path: 'assets/parallex-assets/css/line-icons.css' },
      { name: 'carousel-css', path: 'assets/parallex-assets/css/owl.carousel.css' },
      { name: 'owltheme-css', path: 'assets/parallex-assets/css/owl.theme.css' },
      { name: 'nivo-css', path: 'assets/parallex-assets/css/nivo-lightbox.css' },
      { name: 'magnific-css', path: 'assets/parallex-assets/css/magnific-popup.css' },
      { name: 'slicknav-css', path: 'assets/parallex-assets/css/slicknav.css' },
      { name: 'animate-css', path: 'assets/parallex-assets/css/animate.css' },
      { name: 'main-css', path: 'assets/parallex-assets/css/main.css' },
      { name: 'responsive-css', path: 'assets/parallex-assets/css/responsive.css' }
    ];

    landingStyles.forEach(style =>
    {
      this.loadStyle(style.name, style.path);
    });
  }

  loadLandingPageScripts()
  {
    // Remove default scripts first
    this.removeDefaultScripts();

    // Load landing page JavaScript files
    const landingScripts = [
      { name: 'jquery-js', path: 'assets/parallex-assets/js/jquery-min.js' },
      { name: 'popper-js', path: 'assets/parallex-assets/js/popper.min.js' },
      { name: 'bootstrap-js', path: 'assets/parallex-assets/js/bootstrap.min.js' },
      { name: 'jquery-mixitup-js', path: 'assets/parallex-assets/js/jquery.mixitup.js' },
      { name: 'nivo-lightbox-js', path: 'assets/parallex-assets/js/nivo-lightbox.js' },
      { name: 'owl-carousel-js', path: 'assets/parallex-assets/js/owl.carousel.js' },
      { name: 'jquery-stellar-js', path: 'assets/parallex-assets/js/jquery.stellar.min.js' },
      { name: 'jquery-nav-js', path: 'assets/parallex-assets/js/jquery.nav.js' },
      { name: 'scrolling-nav-js', path: 'assets/parallex-assets/js/scrolling-nav.js' },
      { name: 'jquery-easing-js', path: 'assets/parallex-assets/js/jquery.easing.min.js' },
      { name: 'jquery-slicknav-js', path: 'assets/parallex-assets/js/jquery.slicknav.js' },
      { name: 'wow-js', path: 'assets/parallex-assets/js/wow.js' },
      { name: 'jquery-vide-js', path: 'assets/parallex-assets/js/jquery.vide.js' },
      { name: 'jquery-counterup-js', path: 'assets/parallex-assets/js/jquery.counterup.min.js' },
      { name: 'jquery-magnific-popup-js', path: 'assets/parallex-assets/js/jquery.magnific-popup.min.js' },
      { name: 'waypoints-js', path: 'assets/parallex-assets/js/waypoints.min.js' },
      { name: 'form-validator-js', path: 'assets/parallex-assets/js/form-validator.min.js' },
      { name: 'contact-form-js', path: 'assets/parallex-assets/js/contact-form-script.js' },
      { name: 'main-js', path: 'assets/parallex-assets/js/main.js' }
    ];

    landingScripts.forEach(script =>
    {
      this.loadScript(script.name, script.path);
    });
  }

  private loadStyle(name: string, path: string): Promise<void>
  {
    return new Promise((resolve, reject) =>
    {
      if (!this.loadedStyles.has(name))
      {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = path;
        link.id = `style-${ name }`;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load style: ${ path }`));
        document.head.appendChild(link);
        this.loadedStyles.set(name, link);
      } else
      {
        resolve();
      }
    });
  }

  private loadScript(name: string, path: string): Promise<void>
  {
    return new Promise((resolve, reject) =>
    {
      if (!this.loadedScripts.has(name))
      {
        const script = document.createElement('script');
        script.src = path;
        script.id = `script-${ name }`;
        script.async = false; // Load in order
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${ path }`));
        document.body.appendChild(script);
        this.loadedScripts.set(name, script);
      } else
      {
        resolve();
      }
    });
  }

  private removeDefaultStyles()
  {
    const defaultStyles = ['bootstrap', 'app-styles'];
    defaultStyles.forEach(styleName =>
    {
      const style = this.loadedStyles.get(styleName);
      if (style && style.parentNode)
      {
        style.parentNode.removeChild(style);
        this.loadedStyles.delete(styleName);
      }
    });

  }

  private removeDefaultScripts()
  {
    const defaultScripts = ['apexcharts'];
    defaultScripts.forEach(scriptName =>
    {
      const script = this.loadedScripts.get(scriptName);
      if (script && script.parentNode)
      {
        script.parentNode.removeChild(script);
        this.loadedScripts.delete(scriptName);
      }
    });

  }

  // Method to load everything for landing page
  async loadLandingPageAssets()
  {
    await this.loadLandingPageStyles();
    await this.loadLandingPageScripts();
  }

}
