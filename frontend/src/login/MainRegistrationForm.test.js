import React from 'react';
import { render } from '@testing-library/react';
import MainRegistrationForm from './MainRegistrationForm';
import { wrapRouter } from '../util/testing';

test('renders the username field', () => {
  const { getByText } = render(wrapRouter(MainRegistrationForm, '/register'));
  const usernameLabel = getByText(/Username/i);
  expect(usernameLabel).toBeInTheDocument();
});

test('renders the password field', () => {
  const { getByText } = render(wrapRouter(MainRegistrationForm, '/register'));
  const passwordLabel = getByText(/Confirm Password/i);
  expect(passwordLabel).toBeInTheDocument();
});

test('renders the email fields', () => {
  const { getByText } = render(wrapRouter(MainRegistrationForm, '/register'));
  const emailLabel = getByText(/E-mail Address/i);
  expect(emailLabel).toBeInTheDocument();
});

test('renders the submit button', () => {
  const { getByText } = render(wrapRouter(MainRegistrationForm, '/register'));
  const registerButton = getByText(/Create Account/i);
  expect(registerButton).toBeInTheDocument();
});
