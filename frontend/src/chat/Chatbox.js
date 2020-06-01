import React from 'react';

class Chatbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draftMessage: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.chatRef = React.createRef();
  }

  handleChange(event) {
    this.setState({ draftMessage: event.target.value });
  }

  sendMessage(event) {
    event.preventDefault();

    if (!this.state.draftMessage) {
      return;
    }

    this.props.sendMessage(this.state.draftMessage);
    this.setState({
      draftMessage: '',
    });
  }

  componentDidUpdate(prevProps) {
    // Scroll to bottom of chat if new message received
    if (prevProps.messages.length !== this.props.messages.length) {
      const scrollHeight = this.chatRef.current.scrollHeight;
      this.chatRef.current.scrollTop = scrollHeight;
    }
  }

  render() {
    return (
      <div className="chatbox">
        <div className="chatmessages" ref={this.chatRef}>
          {this.props.messages.map(msg => (
            <p key={msg.id} className="chatmessage">
              <span className="chatmessageSender">{msg.sender.name}</span>: {msg.message}
            </p>
          ))}
        </div>
        <form onSubmit={this.sendMessage}>
          <input
            type="text"
            className="chatInputBox"
            value={this.state.draftMessage}
            onChange={this.handleChange}
          />
          <input type="submit" className="chatSendButton btn-dark" value="send"></input>
        </form>
      </div>
    );
  }
}

export default Chatbox;
