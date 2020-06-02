import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import CreateLobbyButton from './CreateLobbyButton';
import { wrapRouter, getCurrentRoute } from '../util/testing';
import { getEmptyLobbyId } from '../server/lobby';
import { mockSuccessResponse, mockErrorResponse } from '../util/mock';

jest.mock('../server/lobby', () => {
  return {
    __esModule: true,
    getEmptyLobbyId: jest.fn(),
  };
});

test('displays create lobby button', () => {
  getEmptyLobbyId.mockResolvedValue(mockSuccessResponse(12345));
  const router = wrapRouter(CreateLobbyButton, '/home');
  const { getByText } = render(router);
  expect(getByText(/Create Lobby/i)).toBeInTheDocument();
});

test('redirects to the correct Lobby ID on click', async () => {
  getEmptyLobbyId.mockResolvedValue(mockSuccessResponse(12345));
  const router = wrapRouter(CreateLobbyButton, '/home');
  const { getByTestId } = render(router);

  await waitFor(() => expect(getByTestId('createLobby')).toBeInTheDocument());
  const button = getByTestId('createLobby');
  fireEvent.click(button);

  expect(getCurrentRoute(router)).toEqual('/lobby/12345');
});

test('button is disabled until lobby ID is ready', async () => {
  getEmptyLobbyId.mockRejectedValue(mockErrorResponse());
  const router = wrapRouter(CreateLobbyButton, '/home');
  const { getByText } = render(router);
  expect(getByText(/Create Lobby/i)).toBeDisabled();
});
