import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Chatbox from './Chatbox';
import { wrapRouter, getCurrentRoute } from '../util/testing';
import { mockErrorResponse, mockSuccessResponse } from '../util/mock';
import { getEmptyLobbyId } from '../util/server';

test('displays correctly', async () => {
  const messages = [{ id: 1, sender: { name: 'aaron' }, message: 'hello' }];
  const sendMessage = () => {};
  const { getByText } = render(<Chatbox messages={messages} sendMessage={sendMessage} />);
  expect(getByText(/hello/i)).toBeInTheDocument();
  expect(getByText(/aaron/i)).toBeInTheDocument();
});
