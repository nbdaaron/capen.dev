import TestGame from './TestGame';
import BombGame from './BombGame';
import DrawingGame from './DrawingGame';

const GAMES = {
  test: {
    title: 'Test Game',
    component: TestGame,
  },
  bomb: {
    title: 'Bomb Game',
    component: BombGame,
  },
  draw: {
    title: 'Drawing Game',
    component: DrawingGame,
  },
};

export default GAMES;
