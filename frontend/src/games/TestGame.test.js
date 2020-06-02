import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TestGame from './TestGame';
import { mockUser, MockElement } from '../util/mock';
import { clickButton } from '../util/server';

jest.mock('../util/server', () => ({
  __esModule: true,
  clickButton: jest.fn(),
}));

test('displays the title', () => {
  const { getByText } = render(<TestGame />);
  expect(getByText(/This is a test game!/i)).toBeInTheDocument();
});

test('returns when button is clicked', () => {
  const { getByText } = render(<TestGame />);
  fireEvent.click(getByText('Click me!'));
  expect(clickButton).toHaveBeenCalled();
});
