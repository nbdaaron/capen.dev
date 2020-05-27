import React from 'react';
import { render } from '@testing-library/react';
import MainLoginForm from './MainLoginForm';

test('renders the username field', () => {
  const { getByText } = render(<MainLoginForm />);
  const usernameLabel = getByText(/Username/i);
  expect(usernameLabel).toBeInTheDocument();
});

test('renders the password field', () => {
  const { getByText } = render(<MainLoginForm />);
  const passwordLabel = getByText(/Password/i);
  expect(passwordLabel).toBeInTheDocument();
});

test('renders the submit buttons', () => {
  const { getByText } = render(<MainLoginForm />);

  const loginButton = getByText(/Login/i);
  const guestButton = getByText(/Guest/i);
  const registerButton = getByText(/Register/i);

  expect(loginButton).toBeInTheDocument();
  expect(guestButton).toBeInTheDocument();
  expect(registerButton).toBeInTheDocument();
});