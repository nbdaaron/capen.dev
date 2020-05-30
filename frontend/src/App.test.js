import React from 'react';
import { render, waitFor } from '@testing-library/react';
import App from './App';
import { wrapRouter } from './util/testing';
import { getUserInfo } from './util/server';
import { mockErrorResponse } from './util/mock';

jest.mock('./util/server', () => {
  return {
    __esModule: true,
    getUserInfo: jest.fn(),
  };
});

test('renders the React Logo from the teaser page', async () => {
  getUserInfo.mockRejectedValue(mockErrorResponse('not logged in'));
  const { getByAltText } = render(wrapRouter(App, '/'));
  await waitFor(() => expect(getByAltText(/logo/i)).toBeInTheDocument());
});
