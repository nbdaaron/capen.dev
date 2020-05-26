import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders the React Logo', () => {
  const { getByAltText } = render(<App />);
  const logoElement = getByAltText(/logo/i);
  expect(logoElement).toBeInTheDocument();
});