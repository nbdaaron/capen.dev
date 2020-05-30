import React from 'react';
import PacmanLoader from 'react-spinners/PacmanLoader';
import './Loader.css';

/**
 * Research shows that when showing a loader/spinner for
 * a brief time (<500ms), it makes the website "feel"
 * slower for end users. As a result, we won't render
 * the spinner until a 500ms delay.
 */
const LOADER_DELAY = 500;

class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
    };
  }

  componentDidMount() {
    this.timer = window.setTimeout(() => this.setState({ showing: true }), LOADER_DELAY);
  }

  componentWillUnmount() {
    window.clearTimeout(this.timer);
  }

  render() {
    return (
      this.state.showing &&
      this.props.loading && (
        <div>
          <div className="Loader" />
          <div className="Loader-Spinner">
            <PacmanLoader color="white" size={50} {...this.props} />
          </div>
        </div>
      )
    );
  }
}

export default Loader;
