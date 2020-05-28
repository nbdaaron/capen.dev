import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MainLoginForm from './MainLoginForm';
import { wrapRouter, getCurrentRoute } from '../util/testing';

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
