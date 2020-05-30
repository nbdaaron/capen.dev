import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Home from './Home';
import { wrapRouter, getCurrentRoute } from '../util/testing';
import { mockErrorResponse, mockSuccessResponse } from '../util/mock';
import { getUserInfo } from '../util/server';

jest.mock('../util/server', () => {
  return {
    __esModule: true,
    getUserInfo: jest.fn(),
  };
});

test('displays username', async () => {
  const router = wrapRouter(Home, '/home', { user: { id: 1, name: 'bob123' } });
  const { getByText } = render(router);
  await waitFor(() => expect(getByText(/bob123/i)).toBeInTheDocument());
});
