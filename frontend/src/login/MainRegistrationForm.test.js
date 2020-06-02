import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import MainRegistrationForm from './MainRegistrationForm';
import { getCurrentRoute, wrapRouter } from '../util/testing';
import { mockErrorResponse, mockSuccessResponse } from '../util/mock';
import { registerAccount } from '../server/login';

jest.mock('../server/login', () => {
  return {
    __esModule: true,
    registerAccount: jest.fn(),
  };
});

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

test('fails if username is too short', () => {
  const router = wrapRouter(MainRegistrationForm, '/register');
  const { getByText, getByLabelText, getByTestId } = render(router);
  const usernameField = getByLabelText(/Username/i);
  fireEvent.change(usernameField, { target: { value: 'a' } });

  const submitButton = getByTestId('submit');
  fireEvent.click(submitButton);

  // Should still be on register page
  expect(getCurrentRoute(router)).toEqual('/register');
  expect(getByText(/Your username must be atleast/i)).toBeInTheDocument();
});

test('fails if password is too short', () => {
  const router = wrapRouter(MainRegistrationForm, '/register');
  const { getByText, getByLabelText, getByTestId } = render(router);
  const usernameField = getByLabelText(/Username/i);
  fireEvent.change(usernameField, { target: { value: 'abcdefg' } });
  const passwordField = getByLabelText('Password');
  fireEvent.change(passwordField, { target: { value: 'a' } });
  const confirmField = getByLabelText('Confirm Password');
  fireEvent.change(confirmField, { target: { value: 'a' } });

  const submitButton = getByTestId('submit');
  fireEvent.click(submitButton);

  // Should still be on register page
  expect(getCurrentRoute(router)).toEqual('/register');
  expect(getByText(/Your password must be atleast/i)).toBeInTheDocument();
});

test('fails if passwords mismatch', () => {
  const router = wrapRouter(MainRegistrationForm, '/register');
  const { getByText, getByLabelText, getByTestId } = render(router);
  const passwordField = getByLabelText('Password');
  fireEvent.change(passwordField, { target: { value: 'abcdefg' } });
  const confirmField = getByLabelText('Confirm Password');
  fireEvent.change(confirmField, { target: { value: '123123123' } });

  const submitButton = getByTestId('submit');
  fireEvent.click(submitButton);

  // Should still be on register page
  expect(getCurrentRoute(router)).toEqual('/register');
  expect(getByText(/Your passwords must match/i)).toBeInTheDocument();
});

test('should display server side errors', async () => {
  registerAccount.mockRejectedValue(mockErrorResponse('Username Taken 123'));

  const router = wrapRouter(MainRegistrationForm, '/register');
  const { getByText, getByLabelText, getByTestId } = render(router);
  const usernameField = getByLabelText('Username');
  fireEvent.change(usernameField, { target: { value: 'mock_username' } });
  const passwordField = getByLabelText('Password');
  fireEvent.change(passwordField, { target: { value: 'mock_password' } });
  const confirmField = getByLabelText('Confirm Password');
  fireEvent.change(confirmField, { target: { value: 'mock_password' } });
  const emailField = getByLabelText('E-mail Address');
  fireEvent.change(emailField, { target: { value: 'test@example.com' } });

  const submitButton = getByTestId('submit');
  fireEvent.click(submitButton);

  // Should still be on register page
  await waitFor(() => expect(getByText('Username Taken 123')).toBeInTheDocument());
  expect(getCurrentRoute(router)).toEqual('/register');
});

test('should redirect on successful form submission', async () => {
  registerAccount.mockResolvedValue(mockSuccessResponse());

  const router = wrapRouter(MainRegistrationForm, '/register');
  const { getByText, getByLabelText, getByTestId } = render(router);
  const usernameField = getByLabelText('Username');
  fireEvent.change(usernameField, { target: { value: 'mock_username' } });
  const passwordField = getByLabelText('Password');
  fireEvent.change(passwordField, { target: { value: 'mock_password' } });
  const confirmField = getByLabelText('Confirm Password');
  fireEvent.change(confirmField, { target: { value: 'mock_password' } });
  const emailField = getByLabelText('E-mail Address');
  fireEvent.change(emailField, { target: { value: 'test@example.com' } });

  const submitButton = getByTestId('submit');
  fireEvent.click(submitButton);

  // Should redirect to Register Complete page
  await waitFor(() => expect(getCurrentRoute(router)).toEqual('/registerComplete'));
});
