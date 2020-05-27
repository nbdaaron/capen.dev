import React from 'react';
import { render } from '@testing-library/react';
import Home from './Home';

test('renders the description', () => {
  const { getByText } = render(<Home />);
  const logoElement = getByText(/Play multiplayer games online with your friends!/i);
  expect(logoElement).toBeInTheDocument();
});