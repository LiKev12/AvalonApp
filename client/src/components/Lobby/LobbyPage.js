import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import classes from './LobbyPage.module.css';

import Chat from '../Chat/Chat';
import LobbyModal from './LobbyModal/LobbyModal';
import LobbyTable from './LobbyTable/LobbyTable';
import { socket } from '../../service/socket';

class LobbyPage extends Component {
    state = {
        lobby_data: []
    };

    componentDidMount() {
        socket.emit('server_game_lobby_data');
        socket.on('client_game_lobby_data', data => {
            this.setState({
                lobby_data: data
            });
        });
    }

    render() {
        const chatHeader = (
            <div>
                <hr />
                <h3>Chat</h3>
                <hr />
            </div>
        );

        const lobbyHeader = (
            <div>
                <hr></hr>
                <h3>Game Lobby</h3>
                <hr></hr>
            </div>
        );
        return (
            <div className={classes.LobbyPageContainer}>
                <Container>
                    {chatHeader}
                    <Chat room={'lobby'} />
                    {lobbyHeader}
                    <LobbyModal />
                    <LobbyTable lobby_data={this.state.lobby_data} />
                </Container>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(LobbyPage);
