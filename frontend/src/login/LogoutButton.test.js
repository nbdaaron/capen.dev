import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LogoutButton from './LogoutButton';
import { wrapRouter, getCurrentRoute } from '../util/testing';
import Cookies from 'js-cookie';
import { AUTH_TOKEN_COOKIE } from '../util/server';

jest.mock('js-cookie', () => {
  return {
    __esModule: true,
    default: {
      get: jest.fn(),
      remove: jest.fn(),
    },
  };
});

test('displays logout button', () => {
  const { getByText } = render(<LogoutButton />);
  expect(getByText(/Log Out/i)).toBeInTheDocument();
});

test('unsets authentication token from cookies', () => {
  const { getByText } = render(<LogoutButton updateUser={jest.fn()} />);

  const button = getByText(/Log Out/i);
  fireEvent.click(button);

  expect(Cookies.remove).toHaveBeenCalledWith(AUTH_TOKEN_COOKIE);
});
