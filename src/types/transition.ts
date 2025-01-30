export type TransitionType = 'fade' | 'slide' | 'zoom' | 'none';

export interface Transition {
  type: TransitionType;
  duration: number; // en millisecondes
}

// Mise à jour du type MediaItem pour inclure la transition
export interface MediaTransition {
  transition: Transition;
  delay: number; // délai avant la transition en millisecondes
}