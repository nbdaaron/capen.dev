import React from 'react';

export const mockSuccessResponse = payload => ({
  success: true,
  data: payload,
});

export const mockErrorResponse = msg => ({
  success: false,
  error: msg,
});

export const mockUser = (id = 1, name = 'aaron123') => {
  return {
    id: id,
    name: name,
  };
};

export class MockFakeElement extends React.Component {
  render() {
    return <p>Mock Fake Element</p>;
  }
}
