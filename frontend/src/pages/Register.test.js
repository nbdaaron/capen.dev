import React from 'react';
import { render } from '@testing-library/react';
import Register from './Register';
import { wrapRouter } from '../util/testing';

test('renders the description', () => {
  const { getByText } = render(wrapRouter(Register, '/register'));
  const logoElement = getByText(/Registration/i);
  expect(logoElement).toBeInTheDocument();
});
