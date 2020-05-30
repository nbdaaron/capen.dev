import React from 'react';
import { render } from '@testing-library/react';
import LogoutButton from './LogoutButton';
import { wrapRouter, getCurrentRoute } from '../util/testing';

test('displays logout button', () => {
  const router = wrapRouter(LogoutButton, '/home');
  const { getByText } = render(router);
  expect(getByText(/Log Out/i)).toBeInTheDocument();
});
