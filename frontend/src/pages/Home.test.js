import React from 'react';
import { render } from '@testing-library/react';
import Home from './Home';

test('renders the site name', () => {
  const { getByText } = render(<Home />);
  const logoElement = getByText(/capen\.dev/i);
  expect(logoElement).toBeInTheDocument();
});