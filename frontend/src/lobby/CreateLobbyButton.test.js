import React from 'react';
import { render } from '@testing-library/react';
import CreateLobbyButton from './CreateLobbyButton';
import { wrapRouter, getCurrentRoute } from '../util/testing';

test('displays create lobby button', () => {
  const router = wrapRouter(CreateLobbyButton, '/home');
  const { getByText } = render(router);
  expect(getByText(/Create Lobby/i)).toBeInTheDocument();
});
