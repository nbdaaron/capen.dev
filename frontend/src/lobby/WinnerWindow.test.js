import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import WinnerWindow from './WinnerWindow';
import { wrapRouter } from '../util/testing';
import { mockUser, MockElement } from '../util/mock';

test('displays winner name', () => {
  const { getByText } = render(<WinnerWindow winner={{ name: 'bob123' }} />);
  expect(getByText(/bob123/i)).toBeInTheDocument();
});

test('returns when button is clicked', () => {
  const fakeCb = jest.fn();
  const { getByText } = render(
    <WinnerWindow winner={{ name: 'bob123' }} return={fakeCb} />
  );

  fireEvent.click(getByText('Return to lobby'));
  expect(fakeCb).toHaveBeenCalled();
});
