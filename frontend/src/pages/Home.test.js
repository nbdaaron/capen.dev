import React from 'react';
import { render } from '@testing-library/react';
import Home from './Home';
import { wrapRouter } from '../util/testing';

test('renders the description', () => {
  const { getByText } = render(wrapRouter(Home, '/'));
  const logoElement = getByText(/Play multiplayer games online with your friends!/i);
  expect(logoElement).toBeInTheDocument();
});