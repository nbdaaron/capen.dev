import React from 'react';
import './DrawingGame.css';
import {
  listenForGameUpdates,
  stopListenForGameUpdates,
  drawLine,
  makeGuess,
} from '../server/drawingGame';

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 1000;
const LINE_DRAWING_DELAY = 50;

class DrawingGame extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.drawing = false;
    this.state = {
      guesses: [],
      draftGuess: '',
    };

    this.guessesRef = React.createRef();

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitGuess = this.submitGuess.bind(this);
    this.drawLine = this.drawLine.bind(this);
    this.getCanvasPosition = this.getCanvasPosition.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.lineDrawn = this.lineDrawn.bind(this);
    this.showGuess = this.showGuess.bind(this);
  }

  componentDidMount() {
    this.listeners = listenForGameUpdates(
      this.updateGame,
      this.lineDrawn,
      this.showGuess
    );
    const context = this.canvas.current.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, 1600, 1000);
  }

  componentWillUnmount() {
    stopListenForGameUpdates(this.listeners);
    delete this.listeners;
  }

  componentDidUpdate(prevProps, prevState) {
    // Scroll to bottom of guesses list if new guess received
    if (prevState.guesses.length !== this.state.guesses.length) {
      const scrollHeight = this.guessesRef.current.scrollHeight;
      this.guessesRef.current.scrollTop = scrollHeight;
    }
  }

  updateGame(state) {
    // List of players with id, scores, if they've currently guessed the word or not
    // If I am drawing, what the current word is.
    // The player that is drawing.
    console.log(state);
  }

  lineDrawn({ fromPos, toPos }) {
    this.drawLine(fromPos, toPos, false);
  }

  showGuess(guess) {
    this.setState({
      guesses: this.state.guesses.concat(guess),
    });
  }

  handleMouseDown(event) {
    this.drawing = true;
    this.position = this.getCanvasPosition(event);
  }

  handleMouseUp(event) {
    if (!this.drawing) {
      return;
    }
    this.drawing = false;
    this.drawLine(this.position, this.getCanvasPosition(event), true);
  }

  handleMouseMove(event) {
    if (!this.drawing) {
      return;
    }
    // Throttle lines drawn to prevent too many network requests
    if (Date.now() - this.lastDrawTime < LINE_DRAWING_DELAY) {
      return;
    }
    const newPosition = this.getCanvasPosition(event);
    this.drawLine(this.position, newPosition, true);
    this.position = newPosition;
  }

  handleChange(event) {
    this.setState({ draftGuess: event.target.value });
  }

  submitGuess(event) {
    event.preventDefault();
    if (this.state.draftGuess) {
      makeGuess(this.state.draftGuess);
    }
    this.setState({ draftGuess: '' });
  }

  drawLine(oldPosition, newPosition, emit = false) {
    if (emit) {
      drawLine(oldPosition, newPosition);
    }

    this.lastDrawTime = Date.now();

    const context = this.canvas.current.getContext('2d');

    const [oldX, oldY] = oldPosition;
    const [newX, newY] = newPosition;

    context.beginPath();
    context.moveTo(oldX, oldY);
    context.lineTo(newX, newY);

    context.strokeStyle = 'black';
    context.lineWidth = 3;

    context.stroke();
    context.closePath();
  }

  getCanvasPosition(event) {
    const canvas = this.canvas.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    return [x, y];
  }

  render() {
    return (
      <main>
        <div className="row">
          <div className="col-xl-2 pr-0">
            <div className="drawingGameGuesses" ref={this.guessesRef}>
              {this.state.guesses.map(guess => (
                <p key={guess.id} className="drawingGameGuess">
                  <span className="drawingGameGuesser">{guess.user.name}</span>:{' '}
                  {guess.guess}
                </p>
              ))}
            </div>
            <form onSubmit={this.submitGuess}>
              <input
                type="text"
                className="drawingGameInputBox"
                value={this.state.draftGuess}
                onChange={this.handleChange}
              />
              <input
                type="submit"
                className="chatSendButton btn-dark"
                value="send"
              ></input>
            </form>
          </div>
          <div className="col-xl-10">
            <canvas
              className="drawingGameCanvas col-xl-10 pl-0"
              ref={this.canvas}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onMouseDown={this.handleMouseDown}
              onMouseUp={this.handleMouseUp}
              onMouseOut={this.handleMouseUp}
              onMouseMove={this.handleMouseMove}
            />
          </div>
        </div>
      </main>
    );
  }
}

export default DrawingGame;
