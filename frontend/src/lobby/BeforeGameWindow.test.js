import React from 'react';
import { render, waitFor } from '@testing-library/react';
import BeforeGameWindow from './BeforeGameWindow';
import { wrapRouter } from '../util/testing';
import { mockUser } from '../util/mock';

test('displays title', () => {
  const user = mockUser();
  const props = {
    user: user,
    match: { params: { id: 123 } },
    game: 'test',
    chatMessages: [],
    users: [user],
  };
  const { getByText } = render(wrapRouter(BeforeGameWindow, '/lobby/123', props));
  expect(getByText(/Users in the lobby/i)).toBeInTheDocument();
});

test('displays users in the lobby', async () => {
  const aaron = mockUser(1, 'aaron');
  const grace = mockUser(2, 'grace');
  const props = {
    user: aaron,
    match: { params: { id: 123 } },
    game: 'test',
    chatMessages: [],
    users: [aaron, grace],
  };
  const { getByText } = render(wrapRouter(BeforeGameWindow, '/lobby/123', props));
  expect(getByText(/aaron, grace/i)).toBeInTheDocument();
});
