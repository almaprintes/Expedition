import ExpeditionScene from './scenes/ExpeditionScene.js';

const GAME_WIDTH = 720;
const GAME_HEIGHT = 1280;

/**
 * Punto de arranque de Phaser. No contiene reglas de juego: solo configura
 * el motor y siembra el estado de sesión compartido (registry), que las
 * escenas leen/escriben en lugar de depender de variables globales.
 */
export default class Game {
  constructor() {
    this.instance = new Phaser.Game(this._buildConfig());
    this.instance.registry.set('session', this._createInitialSession());
  }

  _buildConfig() {
    return {
      type: Phaser.AUTO,
      parent: 'game-root',
      backgroundColor: '#12151f',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
      },
      scene: [ExpeditionScene],
      // Sin motor de physics: todo el movimiento de combate se resuelve con
      // tweens deterministas, suficiente para el modelo de "stance + acción".
    };
  }

  _createInitialSession() {
    return {
      coins: 0,
      encounterIndex: 0,
    };
  }
}
