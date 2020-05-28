import React from 'react';
import { render } from '@testing-library/react';
import Home from './Home';
import { wrapRouter, getCurrentRoute } from '../util/testing';

test('redirects to login page', () => {
  const router = wrapRouter(Home, '/home');
  const { getByText } = render(router);
  expect(getCurrentRoute(router)).toEqual('/login');
});