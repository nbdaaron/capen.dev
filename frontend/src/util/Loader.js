import React from 'react';
import PacmanLoader from 'react-spinners/PacmanLoader';
import './Loader.css';

class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    return (
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
