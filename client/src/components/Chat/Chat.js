import React, { Component } from 'react';
import classes from './Chat.module.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Input, FormGroup } from 'reactstrap';
import { socket } from '../../service/socket';

export class Chat extends Component {
    state = {
        message: '',
        chat: []
    };

    componentDidMount() {
        const data = { flag: 'get', room: this.props.room };
        socket.emit('server_get_chat', data);
        this.socketEventListeners();
    }

    socketEventListeners = () => {
        socket.on('client_get_chat', chat => {
            this.setState(
                {
                    chat
                },
                () => {
                    this.changeTableScroll();
                }
            );
        });
    };

    handleSubmitMessage = e => {
        e.preventDefault();

        // Don't allow submitting empty messages
        if (this.state.message.length === 0) return;

        // Send data with message to server
        const user_name = this.props.auth && this.props.auth.user ? this.props.auth.user.name : '';
        const data = {
            flag: 'msg',
            msg: this.state.message,
            user_name: user_name,
            room: this.props.room
        };
        this.setState({
            message: ''
        });
        socket.emit('server_get_chat', data);
    };

    changeTableScroll = () => {
        let objDiv = document.getElementById('chat_body_id');
        objDiv.scrollTop = objDiv.scrollHeight;
    };

    handleKeyDown = e => {
        if (e.key === 'Enter') {
            this.handleSubmitMessage(e);
        }
    };

    handleMessageChange = e => {
        this.setState({
            message: e.target.value
        });
    };

    render() {
        const renderedChatMessages = this.state.chat.map((chatObj, idx) => (
            <tr key={idx}>
                <td className={classes.ChatTimestamp}>{chatObj['timestamp']}</td>
                <td className={classes.ChatUsername}>{chatObj['user_name']}</td>
                <td className={classes.ChatMessage}>{chatObj['message']}</td>
            </tr>
        ));
        return (
            <div>
                <Table borderless size="sm" className={classes.OuterTableContainer}>
                    <thead>
                        <tr>
                            <td>
                                <Table className={classes.TableHeader}>
                                    <thead>
                                        <tr>
                                            <th className={classes.ChatTimestamp}></th>
                                            <th className={classes.ChatUsername}></th>
                                            <th className={classes.ChatMessage}></th>
                                        </tr>
                                    </thead>
                                </Table>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className={classes.TableBodyContainer} id="chat_body_id">
                                    <Table className={classes.TableBody}>
                                        <tbody>{renderedChatMessages}</tbody>
                                    </Table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <FormGroup>
                    <Input
                        type="textarea"
                        name="text"
                        placeholder="Enter chat message here..."
                        value={this.state.message}
                        onChange={this.handleMessageChange}
                        onKeyDown={this.handleKeyDown}
                    />
                </FormGroup>
            </div>
        );
    }
}

Chat.propTypes = {
    auth: PropTypes.object.isRequired,
    room: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Chat);

// Table Design: https://stackoverflow.com/questions/14834198/table-scroll-with-html-and-css
// Table Auto-scroll: https://stackoverflow.com/questions/7303948/how-to-auto-scroll-to-end-of-div-when-data-is-added
