import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Game from './Game';
import { wrapRouter } from '../util/testing';
import { mockUser, MockElement } from '../util/mock';

jest.mock('../games/Games', () => ({
  __esModule: true,
  default: {
    game123: {
      title: 'GAME TITLE',
      component: props => <p>Mock Fake Element</p>,
    },
  },
}));

test('displays game', () => {
  const { getByText } = render(<Game gameId="game123" />);
  expect(getByText(/Mock Fake Element/i)).toBeInTheDocument();
});

test('displays placeholder game if no game exists', async () => {
  const { getByText } = render(wrapRouter(Game, '/lobby/123'));
  expect(getByText(/the game you're trying to play doesn't exist/i)).toBeInTheDocument();
});
