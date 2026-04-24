class Media {
  readonly mobileMql = window.matchMedia('(width < 800px)')
  private readonly hoverableMql = window.matchMedia('(hover: hover) and (pointer: fine)')

  private _os: 'windows' | 'android' | 'ios' | 'macos' | 'other' | null = null
  private _browser: 'explorer' | 'edge' | 'chrome' | 'safari' | 'firefox' | 'opera' | 'other' | null = null

  get isSp() {
    return this.mobileMql.matches
  }

  get isPc() {
    return !this.mobileMql.matches
  }

  get isTouch() {
    return !this.hoverableMql.matches
  }

  get layout() {
    return this.isPc ? 'pc' : 'sp'
  }

  get os() {
    if (!this._os) {
      const ua = window.navigator.userAgent.toLowerCase()

      if (ua.indexOf('windows nt') !== -1) {
        this._os = 'windows'
      } else if (ua.indexOf('android') !== -1) {
        this._os = 'android'
      } else if (ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1) {
        this._os = 'ios'
      } else if (ua.indexOf('mac os x') !== -1) {
        this._os = 'macos'
      } else {
        this._os = 'other'
      }
    }
    return this._os
  }

  get browser() {
    if (!this._browser) {
      const ua = window.navigator.userAgent.toLowerCase()

      if (ua.indexOf('msie') != -1 || ua.indexOf('trident') != -1) {
        this._browser = 'explorer'
      } else if (ua.indexOf('edge') != -1) {
        this._browser = 'edge'
      } else if (ua.indexOf('chrome') != -1) {
        this._browser = 'chrome'
      } else if (ua.indexOf('safari') != -1) {
        this._browser = 'safari'
      } else if (ua.indexOf('firefox') != -1) {
        this._browser = 'firefox'
      } else if (ua.indexOf('opera') != -1) {
        this._browser = 'opera'
      } else {
        this._browser = 'other'
      }
    }
    return this._browser
  }
}

export const media = new Media()
