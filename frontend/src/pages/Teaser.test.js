import React from 'react';
import { render } from '@testing-library/react';
import Teaser from './Teaser';

test('renders the site name', () => {
  const { getByText } = render(<Teaser />);
  const logoElement = getByText(/capen\.dev/i);
  expect(logoElement).toBeInTheDocument();
});