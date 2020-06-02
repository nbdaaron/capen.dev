import React from 'react';

import { Link } from 'react-router-dom';
import Games from '../games/Games';

class Game extends React.Component {
  render() {
    const GameComponent = Games[this.props.game].component;
    if (Game) {
      return <GameComponent />;
    } else {
      return (
        <main>
          <h2>It looks like the game you're trying to play doesn't exist! :~(</h2>
          <Link to="/home">
            <button className="btn btn-dark mt-3" onClick={this.returnHome}>
              Click me to return home
            </button>
          </Link>
        </main>
      );
    }
  }
}

export default Game;
