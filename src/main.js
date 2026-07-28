import Game from './Game.js';

window.addEventListener('load', () => {
  new Game();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.warn('[Expedition] No se pudo registrar el Service Worker:', error);
    });
  }
});
