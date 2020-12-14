import React, { Component } from 'react';
import { Button, Container } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { socket } from '../../../service/socket';

import AccessDeniedPage from '../../Pages/AccessDeniedPage/AccessDeniedPage';
import GameBoard from '../GameBoard/GameBoard';
import GameNav from '../GameCommon/GameNav/GameNav';
import GameSetupModal from '../GameSetupModal/GameSetupModal';
import InvalidGamePage from '../../Pages/InvalidGamePage/InvalidGamePage';
import PlayersList from '../GameCommon/PlayersList/PlayersList';

export class GameRoomPublic extends Component {
    state = {
        /**
         * if hasLocked, show GameSetupModal
         */
        hasLocked: false,
        /**
         * if hasSetup, show StartGame
         */
        hasSetup: false,
        /**
         * if !hasStarted, show PlayersList
         */
        hasStarted: false,
        /**
         * single view - board
         */
        board: null,
        /**
         * button can be { propose, round, mission, assassinate }
         */
        button: null,
        /**
         * team is either RESISTANCE or SPY
         */
        team: null,

        /**
         * PLAYERS_LIST list of players before game has started
         */
        PLAYERS_LIST: null,

        /**
         * MISSION_TRACKER tracks mission pass/fails
         */
        MISSION_TRACKER: null,

        /**
         * ROUND_TRACKER tracks rounds
         */
        ROUND_TRACKER: null,

        /**
         * VOTING_RECORD tracks voting through all rounds and missions
         */
        VOTING_RECORD: null
    };

    componentDidMount() {
        this.socket_event_listeners();
    }

    _get_user_id = () => {
        const user_id = this.props.auth && this.props.auth.user ? this.props.auth.user._id : null;
        return user_id;
    };

    _get_room_id = () => {
        const room_id = this.props.match.params.room_id;
        return room_id;
    };

    socket_event_listeners = () => {
        socket.on('client_game_view_data', data => {
            const { hasLocked, hasSetup, hasStarted, hasEnded } = data;
            const { boards, buttons, teams } = data;
            const { PLAYERS_LIST, MISSION_TRACKER, ROUND_TRACKER, VOTING_RECORD } = data;

            const user_id = this._get_user_id();
            let board = null;
            let button = null;
            let team = null;
            if (boards) {
                board = boards[user_id] ? boards[user_id] : boards['spectate'];
            }
            if (buttons) {
                button = buttons[user_id] ? buttons[user_id] : null;
            }
            if (teams) {
                team = teams[user_id] ? teams[user_id] : null;
            }
            this.setState({
                hasLocked,
                hasSetup,
                hasStarted,
                hasEnded,
                // Single
                board,
                button,
                team,
                // Common
                PLAYERS_LIST,
                MISSION_TRACKER,
                ROUND_TRACKER,
                VOTING_RECORD
            });
        });
    };

    onEnterRoom = () => {
        const room_id = this._get_room_id();
        const user_id = this._get_user_id();
        const user_name = this.props.auth && this.props.auth.user ? this.props.auth.user.name : null;

        const data = {
            room_id,
            user_id,
            user_name
        };
        socket.emit('server_game_handle_ENTER', data);
    };

    onLeaveRoom = () => {
        const room_id = this._get_room_id();
        const user_id = this._get_user_id();

        const data = {
            user_id,
            room_id
        };
        socket.emit('server_game_handle_LEAVE', data);
    };

    onLockRoom = () => {
        const room_id = this._get_room_id();
        const user_id = this._get_user_id();
        const data = {
            room_id,
            user_id
        };
        socket.emit('server_game_handle_LOCK', data);
    };

    onSetup = setup => {
        const room_id = this._get_room_id();
        const user_id = this._get_user_id();
        const data = {
            room_id,
            user_id,
            setup
        };
        socket.emit('server_game_handle_SETUP', data);
    };

    onStart = () => {
        const room_id = this._get_room_id();
        const user_id = this._get_user_id();
        const data = {
            room_id,
            user_id
        };
        socket.emit('server_game_handle_START', data);
    };

    onClickPlayerCard = target_idx => {
        const room_id = this._get_room_id();
        const user_id = this._get_user_id();
        const data = {
            room_id,
            user_id,
            target_idx
        };
        socket.emit('server_game_handle_SELECT', data);
    };

    onHandleButtonClick = (button, isAffirmative) => {
        const room_id = this._get_room_id();
        const user_id = this._get_user_id();
        const data = {
            room_id,
            user_id
        };
        if (button === 'propose') {
            socket.emit('server_game_handle_PROPOSE', data);
        } else if (button === 'round') {
            data.isApproved = isAffirmative;
            socket.emit('server_game_handle_ROUND', data);
        } else if (button === 'mission') {
            data.isPassed = isAffirmative;
            socket.emit('server_game_handle_MISSION', data);
        } else if (button === 'assassinate') {
            socket.emit('server_game_handle_ASSASSINATE', data);
        } else if (button === 'give_excalibur') {
            socket.emit('server_game_handle_GIVE_EXCALIBUR', data);
        } else if (button === 'use_excalibur') {
            data.isExcaliburUsed = isAffirmative;
            socket.emit('server_game_handle_USE_EXCALIBUR', data);
        }
    };

    render() {
        // Check if authenticated
        const { isAuthenticated } = this.props.auth;
        if (!isAuthenticated) {
            return <AccessDeniedPage />;
        }

        // Check if valid game
        const isValidGame = true;
        if (!isValidGame) {
            return <InvalidGamePage />;
        }

        const welcomeMessage = <h3>{`Welcome to game room ${this._get_room_id()}`}</h3>;

        const { board, team, button } = this.state;
        const { MISSION_TRACKER, ROUND_TRACKER } = this.state;
        const gameBoard = this.state.hasStarted ? (
            <GameBoard
                onClickPlayerCard={this.onClickPlayerCard}
                onHandleButtonClick={this.onHandleButtonClick}
                board={board}
                button={button}
                team={team}
                MISSION_TRACKER={MISSION_TRACKER}
                ROUND_TRACKER={ROUND_TRACKER}
            />
        ) : null;

        const havePlayersJoinedRoom = !!this.state.PLAYERS_LIST;
        const playersList =
            havePlayersJoinedRoom && !this.state.hasStarted ? (
                <PlayersList players_list={this.state.PLAYERS_LIST} />
            ) : null;

        // when to lock room... (only leader can lock room)
        const haveEnoughPlayersJoinedRoom = this.state.PLAYERS_LIST && this.state.PLAYERS_LIST.length >= 5;
        const lockRoomButton = haveEnoughPlayersJoinedRoom ? (
            <Button color="info" onClick={this.onLockRoom}>
                Lock
            </Button>
        ) : null;

        // when to show modal... when enough players have joined room (5) when the game has locked
        const gameSetupModal = havePlayersJoinedRoom ? (
            <GameSetupModal num_players={this.state.PLAYERS_LIST.length} onSetup={this.onSetup} />
        ) : null;

        const gameNav = this.state.hasStarted ? (
            <GameNav room_id={'1111'} voting_record={this.state.VOTING_RECORD} />
        ) : null;

        return (
            <div>
                <Container>{welcomeMessage}</Container>
                <Button color="success" onClick={this.onEnterRoom}>
                    Join
                </Button>
                <Button color="danger" onClick={this.onLeaveRoom}>
                    Leave
                </Button>
                <Button color="warning" onClick={this.onLockRoom}>
                    Lock
                </Button>
                <Button color="info" onClick={this.onStart}>
                    Start
                </Button>
                {gameSetupModal}
                {playersList}
                {gameBoard}
                {gameNav}
            </div>
        );
    }
}

GameRoomPublic.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(GameRoomPublic);
