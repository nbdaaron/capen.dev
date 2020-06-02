import React from 'react';

class WinnerWindow extends React.Component {
  render() {
    return (
      <main>
        <h2>Game Winner: {this.props.winner.name}</h2>
        <button className="btn btn-dark mt-3" onClick={this.props.return}>
          Return to lobby
        </button>
      </main>
    );
  }
}

export default WinnerWindow;
