import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StyleLoaderService
{
  private loadedStyles: Map<string, HTMLLinkElement> = new Map();
  private loadedScripts: Map<string, HTMLScriptElement> = new Map();
  private defaultStylesLoaded = false;
  private defaultScriptsLoaded = false;

  loadDefaultStyles()
  {
    if (!this.defaultStylesLoaded)
    {
      // Load Bootstrap
      this.loadStyle('bootstrap', 'node_modules/bootstrap/scss/bootstrap.scss');
      this.loadStyle('app-styles', 'src/styles.scss');
      this.defaultStylesLoaded = true;
    }
  }

  loadDefaultScripts()
  {
    if (!this.defaultScriptsLoaded)
    {
      // Load default app scripts
      this.loadScript('apexcharts', 'node_modules/apexcharts/dist/apexcharts.min.js');
      this.defaultScriptsLoaded = true;
    }
  }

  loadLandingPageStyles()
  {
    // Remove default styles first
    this.removeDefaultStyles();

    // Load landing page styles
    const landingStyles = [
      { name: 'bootstrap-landing', path: 'assets/home-page-assests/assets/css/bootstrap-5.0.5-alpha.min.css' },
      { name: 'lineicons', path: 'assets/home-page-assests/assets/css/LineIcons.2.0.css' },
      { name: 'animate', path: 'assets/home-page-assests/assets/css/animate.css' },
      { name: 'tiny-slider', path: 'assets/home-page-assests/assets/css/tiny-slider.css' },
      { name: 'main-landing', path: 'assets/home-page-assests/assets/css/main.css' }
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
      { name: 'bootstrap-js', path: 'assets/home-page-assests/assets/js/bootstrap.bundle-5.0.0.alpha-min.js' },
      { name: 'wow', path: 'assets/home-page-assests/assets/js/wow.min.js' },
      { name: 'tiny-slider-js', path: 'assets/home-page-assests/assets/js/tiny-slider.js' },
      { name: 'main-js', path: 'assets/home-page-assests/assets/js/main.js' }
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
    this.defaultStylesLoaded = false;
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
    this.defaultScriptsLoaded = false;
  }

  removeLandingStyles()
  {
    const landingStyleNames = ['bootstrap-landing', 'lineicons', 'animate', 'tiny-slider', 'main-landing'];
    landingStyleNames.forEach(styleName =>
    {
      const style = this.loadedStyles.get(styleName);
      if (style && style.parentNode)
      {
        style.parentNode.removeChild(style);
        this.loadedStyles.delete(styleName);
      }
    });
  }

  removeLandingScripts()
  {
    const landingScriptNames = ['bootstrap-js', 'wow', 'tiny-slider-js', 'main-js'];
    landingScriptNames.forEach(scriptName =>
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

  // Method to clean up landing page assets
  cleanupLandingPageAssets()
  {
    this.removeLandingStyles();
    this.removeLandingScripts();
  }

  // Method to restore default app assets
  restoreDefaultAssets()
  {
    this.loadDefaultStyles();
    this.loadDefaultScripts();
  }
}
