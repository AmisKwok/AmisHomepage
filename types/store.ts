export interface SiteContent {
  isCachePem?: boolean;
  showProjects?: boolean;
  showSkills?: boolean;
  showLocalTime?: boolean;
  showGreetings?: boolean;
  showCustomCursor?: boolean;
  customCursorPath?: string;
  typeWriterEffects?: {
    glitchEffect?: boolean;
    colorGradient?: boolean;
    glitchProbability?: number;
    glitchInterval?: number;
    speedPreset?: 'fast' | 'medium' | 'slow' | 'custom';
    typeSpeed?: number;
    deleteSpeed?: number;
    pauseTime?: number;
  };
  heroTitleEffects?: {
    hoverPreset?: 'scale' | 'bounce' | 'wobble' | 'strokeFlow' | 'colorFade' | 'none';
  };
  greetings?: {
    morning?: {
      zh?: string;
      en?: string;
    };
    afternoon?: {
      zh?: string;
      en?: string;
    };
    evening?: {
      zh?: string;
      en?: string;
    };
  };
  site?: {
    backgroundImage?: {
      dark?: string;
      light?: string;
    };
    textColor?: {
      dark?: string;
      light?: string;
    };
    textSecondaryColor?: {
      dark?: string;
      light?: string;
    };
  };
}

export interface Music {
  id: string;
  name: string;
  path: string;
  order: number;
}

export type LoopMode = "list-loop" | "list-no-loop" | "single-loop" | "single-no-loop";
