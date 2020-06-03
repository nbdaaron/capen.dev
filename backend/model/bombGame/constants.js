// KEEP IN SYNC WITH frontend/src/games/BombGame
const WIDTH_IN_BLOCKS = 19;
const HEIGHT_IN_BLOCKS = 19;

const OBJECTS = {
  EMPTY: 0, // Nothing on space
  WALL: 1, // Unbreakable wall
  BOX: 2, // Breakable wall (with bombs)
  BOMB: 3, // Bomb
  EXTRA_BOMB_POWERUP: 11, // +1 Bomb Powerup
  EXTRA_POWER_POWERUP: 12, // +1 Explosion Radius Powerup
  EXTRA_SPEED_POWERUP: 13, // +1 Movement Speed Powerup
  EXPLOSION_PARTICLE: 99, // Explosion Particle
};

const KEY = {
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

// Spaces that are always empty.
// We keep these empty so players
// can spawn there.
const ALWAYS_EMPTY_SPACES = [
  // Empty spaces for player 1
  [1, 1],
  [1, 2],
  [2, 1],
  // Empty spaces for player 2
  [WIDTH_IN_BLOCKS - 2, HEIGHT_IN_BLOCKS - 2],
  [WIDTH_IN_BLOCKS - 3, HEIGHT_IN_BLOCKS - 2],
  [WIDTH_IN_BLOCKS - 2, HEIGHT_IN_BLOCKS - 3],
  // Empty spaces for player 3
  [1, HEIGHT_IN_BLOCKS - 2],
  [2, HEIGHT_IN_BLOCKS - 2],
  [1, HEIGHT_IN_BLOCKS - 3],
  // Empty spaces for player 4
  [WIDTH_IN_BLOCKS - 2, 1],
  [WIDTH_IN_BLOCKS - 3, 1],
  [WIDTH_IN_BLOCKS - 2, 2],
];

// Chance of a blank space becoming a box
const BOX_CHANCE = 0.5;

// Update clients with my state every 300ms.
const REFRESH_RATE = 300;

module.exports = {
  WIDTH_IN_BLOCKS,
  HEIGHT_IN_BLOCKS,
  OBJECTS,
  KEY,
  ALWAYS_EMPTY_SPACES,
  BOX_CHANCE,
  REFRESH_RATE,
};
