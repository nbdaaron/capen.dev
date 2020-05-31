import React from 'react';

class Chatbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draftMessage: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  handleChange(event) {
    this.setState({ draftMessage: event.target.value });
  }

  sendMessage() {
    this.props.sendMessage(this.state.draftMessage);
    this.setState({
      draftMessage: '',
    });
  }

  render() {
    return (
      <div>
        {this.props.messages.map(msg => (
          <p>
            {msg.sender}: {msg.message}
          </p>
        ))}
        <input type="text" value={this.state.draftMessage} onChange={this.handleChange} />
        <button onClick={this.sendMessage} className="btn btn-dark">
          Send
        </button>
      </div>
    );
  }
}

export default Chatbox;
