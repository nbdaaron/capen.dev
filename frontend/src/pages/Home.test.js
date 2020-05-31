import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Home from './Home';
import { wrapRouter, getCurrentRoute } from '../util/testing';
import { mockErrorResponse, mockSuccessResponse, mockUser } from '../util/mock';
import { getEmptyLobbyId } from '../util/server';

jest.mock('../util/server', () => {
  return {
    __esModule: true,
    getEmptyLobbyId: jest.fn(),
  };
});

test('displays username', async () => {
  getEmptyLobbyId.mockResolvedValue(mockSuccessResponse(12345));
  const router = wrapRouter(Home, '/home', { user: mockUser() });
  const { getByText } = render(router);
  await waitFor(() =>
    expect(getByText(new RegExp(mockUser().name, 'i'))).toBeInTheDocument()
  );
});
