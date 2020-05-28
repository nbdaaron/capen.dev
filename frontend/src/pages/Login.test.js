import React from 'react';
import { render } from '@testing-library/react';
import Login from './Login';
import { wrapRouter } from '../util/testing';

test('renders the description', () => {
  const { getByText } = render(wrapRouter(Login, '/'));
  const logoElement = getByText(/Play multiplayer games online with your friends!/i);
  expect(logoElement).toBeInTheDocument();
});
