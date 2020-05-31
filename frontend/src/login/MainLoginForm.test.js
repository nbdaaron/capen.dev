import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MainLoginForm from './MainLoginForm';
import { wrapRouter, getCurrentRoute } from '../util/testing';
import { tryLogin, loginAsGuest, AUTH_TOKEN_COOKIE } from '../util/server';
import Cookies from 'js-cookie';
import { mockSuccessResponse, mockErrorResponse } from '../util/mock';

jest.mock('../util/server', () => {
  return {
    __esModule: true,
    tryLogin: jest.fn(),
    loginAsGuest: jest.fn(),
  };
});

jest.mock('js-cookie', () => {
  return {
    __esModule: true,
    default: {
      get: jest.fn(),
      set: jest.fn(),
    },
  };
});

test('renders the username field', () => {
  const { getByText } = render(wrapRouter(MainLoginForm, '/home'));
  const usernameLabel = getByText(/Username/i);
  expect(usernameLabel).toBeInTheDocument();
});

test('renders the password field', () => {
  const { getByText } = render(wrapRouter(MainLoginForm, '/home'));
  const passwordLabel = getByText(/Password/i);
  expect(passwordLabel).toBeInTheDocument();
});

test('renders the submit buttons', () => {
  const { getByText } = render(wrapRouter(MainLoginForm, '/home'));

  const loginButton = getByText(/Login/i);
  const guestButton = getByText(/Guest/i);
  const registerButton = getByText(/Register/i);

  expect(loginButton).toBeInTheDocument();
  expect(guestButton).toBeInTheDocument();
  expect(registerButton).toBeInTheDocument();
});

test('sends user to registration page if Register button is clicked', () => {
  const router = wrapRouter(MainLoginForm, '/home');
  const { getByTestId, queryByText, container } = render(router);

  const registerButton = getByTestId('register');
  fireEvent.click(registerButton);

  expect(getCurrentRoute(router)).toEqual('/register');
});

test('logs in on correct credentials', async () => {
  tryLogin.mockResolvedValue(mockSuccessResponse({ authToken: 15421 }));

  const router = wrapRouter(MainLoginForm, '/home');
  const { getByTestId, queryByText, container } = render(router);

  const loginButton = getByTestId('login');
  loginButton.click(loginButton);

  await waitFor(() => expect(Cookies.set).toHaveBeenCalledWith(AUTH_TOKEN_COOKIE, 15421));
});

test('fails login on incorrect credentials', async () => {
  tryLogin.mockRejectedValue(mockErrorResponse('incorrect credentials 123'));

  const router = wrapRouter(MainLoginForm, '/home');
  const { getByTestId, getByText } = render(router);

  const loginButton = getByTestId('login');
  loginButton.click(loginButton);

  await waitFor(() =>
    expect(getByText(/incorrect credentials 123/i)).toBeInTheDocument()
  );
});

test('logs in as guest when the corresponding button is clicked', async () => {
  loginAsGuest.mockResolvedValue(mockSuccessResponse({ authToken: 13579 }));

  const router = wrapRouter(MainLoginForm, '/home');
  const { getByTestId, queryByText, container } = render(router);

  const loginGuestButton = getByTestId('loginGuest');
  loginGuestButton.click(loginGuestButton);

  await waitFor(() => expect(Cookies.set).toHaveBeenCalledWith(AUTH_TOKEN_COOKIE, 13579));
});
