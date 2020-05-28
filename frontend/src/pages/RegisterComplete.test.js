import React from 'react';
import { render } from '@testing-library/react';
import RegisterComplete from './RegisterComplete';
import { wrapRouter } from '../util/testing';

test('renders the description', () => {
  const { getByText } = render(wrapRouter(RegisterComplete, '/registerComplete'));
  const logoElement = getByText(/Registration Complete!/i);
  expect(logoElement).toBeInTheDocument();
});
