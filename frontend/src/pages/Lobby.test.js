import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Lobby from './Lobby';
import { wrapRouter } from '../util/testing';

test('displays username', async () => {
  const router = wrapRouter(Lobby, '/lobby/123', {
    user: { id: 1, name: 'bob123' },
    match: { params: { id: 123 } },
  });
  const { getByText } = render(router);
  expect(getByText(/Users in the lobby/i)).toBeInTheDocument();
});
