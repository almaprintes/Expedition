# Expedition — v0.3.001

Primera versión jugable. PWA instalable en iPhone y Android, JavaScript ES6
puro sobre Phaser 3, sin frameworks ni build tools adicionales.

## Cómo ejecutar

Los módulos ES6 (`import`/`export`) requieren servirse por HTTP; no
funcionan abriendo `index.html` directamente con `file://`. Desde la
carpeta `expedition/`:

```bash
npx serve .
# o
python3 -m http.server 8080
```

Abre la URL indicada en el navegador del móvil o del escritorio. Para
instalarlo como PWA: "Añadir a pantalla de inicio" en iOS Safari, o el
prompt de instalación nativo en Chrome/Android.

## Arquitectura

```
src/
  engine/     utilidades genéricas sin conocimiento del juego
              (StateMachine, InputManager)
  entities/   Combatant (base), Hero, Enemy, EnemyFactory
  systems/    CombatSystem, EncounterSystem, LootSystem — las reglas
              del juego, desacopladas entre sí vía eventos
  ui/         HUD, HealthBar
  scenes/     ExpeditionScene — cablea todo y expone la máquina de
              estados EXPLORATION → ENCOUNTER → COMBAT → REWARD;
              no contiene reglas de juego propias
```

El estado compartido (monedas, índice de encuentro) vive en
`registry.get('session')`, sembrado por `Game.js`. No hay variables
globales: añadir una escena nueva (menú, tienda) solo requiere leer/escribir
ahí.

## Nota sobre `entities/Combatant.js`

No estaba en el árbol de carpetas original del encargo, pero se añadió como
clase base compartida por `Hero` y `Enemy`: ambos salen de su stance,
corren, atacan, aplican daño y vuelven exactamente igual. Concentrar ese
flujo en un único sitio evita duplicar la lógica de combate entre las dos
clases, en línea con "nada de lógica duplicada".

## Animaciones

Idle / Run / Attack / Hit / Death / Return están implementadas con tweens
sobre texturas generadas por código (sin arte final todavía). Los métodos
viven aislados en `Combatant`, así que sustituir tweens por
`sprite.play('clave')` con spritesheets reales no requiere tocar
`CombatSystem` ni `EncounterSystem`. Ver `assets/sprites/README.md`.

## Extensión futura

- Catálogo de enemigos en `EnemyFactory.js`: añadir un tipo es una entrada
  más en el array.
- `LootSystem` está listo para objetos/rareza además de monedas.
- `assets/audio/README.md` describe cómo añadir un `AudioSystem` sin tocar
  el combate.
- El combate resuelve una acción a la vez (ver comentario en
  `CombatSystem`); relajarlo a acciones concurrentes es un cambio
  localizado en `_runNextAction`/`update`.

## Auditoría v0.3.002

- Evita que un enemigo acumule varios ataques en la cola mientras espera turno.
- Evita que los toques rápidos acumulen acciones ilimitadas del héroe.
- Mantiene como máximo una acción pendiente por combatiente y un próximo objetivo del héroe.
