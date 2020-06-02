import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Lobby from './Lobby';
import { wrapRouter } from '../util/testing';
import { joinLobby } from '../server/lobby';
import { mockUser } from '../util/mock';

jest.mock('../server/lobby', () => {
  return {
    __esModule: true,
    joinLobby: jest.fn(),
    leaveLobby: jest.fn(),
  };
});

test('displays title', () => {
  const props = {
    user: mockUser(),
    match: { params: { id: 123 } },
  };
  const { getByText } = render(wrapRouter(Lobby, '/lobby/123', props));
  expect(getByText(/Users in the lobby/i)).toBeInTheDocument();
});

test('displays users in the lobby', async () => {
  joinLobby.mockImplementation((id, lobbyStateCallback, lobbyChatCallback) => {
    lobbyStateCallback({
      users: [mockUser(1, 'aaron'), mockUser(2, 'grace')],
    });
  });
  const props = {
    user: mockUser(),
    match: { params: { id: 123 } },
  };
  const { getByText } = render(wrapRouter(Lobby, '/lobby/123', props));
  expect(getByText(/aaron, grace/i)).toBeInTheDocument();
});
