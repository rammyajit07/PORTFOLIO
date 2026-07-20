import type LenisClass from 'lenis';

let _instance: LenisClass | null = null;

export function setLenis(lenis: LenisClass | null): void {
  _instance = lenis;
}

export function getLenis(): LenisClass | null {
  return _instance;
}
