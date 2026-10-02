// High-Performance Audio Engine for Custom User Audio Assets

class SoundEngine {
  private hoverAudio: HTMLAudioElement | null = null;
  private bgAudio: HTMLAudioElement | null = null;
  private lastHoverTime: number = 0;

  public init() {
    if (typeof window !== "undefined") {
      if (!this.hoverAudio) {
        this.hoverAudio = new Audio("/sounds/data-1.wav");
        this.hoverAudio.volume = 0.06;
      }
    }
  }

  // 1. SMOOTH LOW-VOLUME HOVER SOUND (RETAINED FOR ELEGANT UI HOVER FEEDBACK)
  public playHoverSound() {
    try {
      this.init();
      if (!this.hoverAudio) return;

      const now = Date.now();
      if (now - this.lastHoverTime < 250) return;
      this.lastHoverTime = now;

      this.hoverAudio.pause();
      this.hoverAudio.currentTime = 0;
      this.hoverAudio.volume = 0.06;
      
      const playPromise = this.hoverAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch {
      // Graceful fallback
    }
  }

  // 2. PLAY CLICK / SWITCH SOUND
  public playClickSound() {
    try {
      this.playHoverSound();
    } catch {
      // Graceful fallback
    }
  }

  // 3. PLAY TECH WHOOSH SOUND
  public playWhooshSound() {
    try {
      this.playHoverSound();
    } catch {
      // Graceful fallback
    }
  }

  // 4. AMBIENT BACKGROUND MUSIC DISABLED
  public startAmbientSpaceMusic() {
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio.currentTime = 0;
    }
  }

  public isMusicPlaying(): boolean {
    return false;
  }

  public setAmbientVolume(val: number) {
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio.volume = 0;
    }
  }

  public getAmbientVolume(): number {
    return 0;
  }

  public fadeAmbientMusic(targetVolumeRatio: number, durationSeconds: number = 0.6) {
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio.volume = 0;
    }
  }

  public toggleMute(): boolean {
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
    return false;
  }

  public isMuted(): boolean {
    return true;
  }
}

export const soundEngine = new SoundEngine();
