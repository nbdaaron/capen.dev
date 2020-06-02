import React from 'react';
import { clickButton } from '../util/server';

class TestGame extends React.Component {
  render() {
    return (
      <main>
        <h3>This is a test game!</h3>
        <h4>Click on the button below to end the game and be declared the winner!</h4>
        <button className="btn btn-dark mt-3" onClick={clickButton}>
          Click me!
        </button>
      </main>
    );
  }
}

export default TestGame;
