import { Transition, TransitionType } from '../types/transition';

export const getDefaultTransition = (): Transition => ({
  type: 'fade',
  duration: 500,
});

export const applyTransitionStyles = (
  element: HTMLElement,
  transition: Transition,
  isEntering: boolean
) => {
  const styles: Partial<CSSStyleDeclaration> = {
    transition: `all ${transition.duration}ms ease-in-out`,
  };

  switch (transition.type) {
    case 'fade':
      styles.opacity = isEntering ? '1' : '0';
      break;
    case 'slide':
      styles.transform = isEntering ? 'translateX(0)' : 'translateX(100%)';
      break;
    case 'zoom':
      styles.transform = isEntering ? 'scale(1)' : 'scale(0)';
      break;
  }

  Object.assign(element.style, styles);
};