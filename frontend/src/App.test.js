import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { wrapRouter } from './util/testing';

test('renders the React Logo', () => {
  const { getByAltText } = render(wrapRouter(App, '/'));
  const logoElement = getByAltText(/logo/i);
  expect(logoElement).toBeInTheDocument();
});