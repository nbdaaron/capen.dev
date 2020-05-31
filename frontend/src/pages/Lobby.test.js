import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Lobby from './Lobby';
import { wrapRouter } from '../util/testing';
import { joinLobby } from '../util/server';
import { mockUser } from '../util/mock';

jest.mock('../util/server', () => {
  return {
    __esModule: true,
    joinLobby: jest.fn(),
    leaveLobby: jest.fn(),
  };
});

test('displays username', () => {
  const props = {
    user: mockUser(),
    match: { params: { id: 123 } },
  };
  const { getByText } = render(wrapRouter(Lobby, '/lobby/123', props));
  expect(getByText(/Users in the lobby/i)).toBeInTheDocument();
});

test('displays username', async () => {
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
  expect(getByText(mockUser(1, 'aaron').name)).toBeInTheDocument();
  expect(getByText(mockUser(2, 'grace').name)).toBeInTheDocument();
});
