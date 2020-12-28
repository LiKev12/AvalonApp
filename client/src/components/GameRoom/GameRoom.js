import React, { Component } from 'react';
import classes from './GameRoom.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { socket } from '../../service/socket';
import { Button, Container } from 'reactstrap';

import AccessDeniedPage from '../Pages/AccessDeniedPage/AccessDeniedPage';
import GameBoard from './GameBoard/GameBoard';
import GameEnterModal from './GameEnterModal/GameEnterModal';
import GameNav from './GameCommon/GameNav/GameNav';
import GameSetupModal from './GameSetupModal/GameSetupModal';
import InvalidGamePage from '../Pages/InvalidGamePage/InvalidGamePage';
import PlayersList from './GameCommon/PlayersList/PlayersList';
import LoadingSpinner from '../Pages/Loading/LoadingSpinner';

export class GameRoom extends Component {
    state = {
        /**
         * purely for client-side (need to wait for socket request to come back, timeout => socket => update state)
         */
        isLoading: true,
        /**
         * if game is created on server side
         */
        isValid: false,
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
         * isRoomLeader is the first person in the players list
         */
        isRoomLeader: false,
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
        VOTING_RECORD: null,

        /**
         * TRANSCRIPT records all the actions played within the game
         */
        TRANSCRIPT: null
    };

    componentDidMount() {
        this.onHandleInitialize();
        this.socket_event_listeners();
        window.addEventListener('beforeunload', this.onLeaveRoom);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onLeaveRoom); // remove the event handler for normal unmounting
    }

    _get_user_id = () => {
        const user_id = this.props.auth && this.props.auth.user ? this.props.auth.user._id : null;
        return user_id;
    };

    _get_room_id = () => {
        const room_id = this.props.match.params.room_id;
        return room_id;
    };

    _get_room_pwd = () => {
        const { is_public } = this.props;
        if (is_public) {
            // No room_pwd for public games
            return null;
        } else {
            return this.props.match.params.pwd;
        }
    };

    socket_event_listeners = () => {
        socket.on('client_game_view_data', data => {
            const { isValid, hasLocked, hasSetup, hasStarted, hasEnded, roomLeaderId } = data;
            const { boards, buttons, teams } = data;
            const { PLAYERS_LIST, MISSION_TRACKER, ROUND_TRACKER, VOTING_RECORD, TRANSCRIPT } = data;

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
            const isRoomLeader = user_id === roomLeaderId;
            this.setState({
                isLoading: false,
                isValid,
                //
                hasLocked,
                hasSetup,
                hasStarted,
                hasEnded,
                isRoomLeader,
                // Single
                board,
                button,
                team,
                // Common
                PLAYERS_LIST,
                MISSION_TRACKER,
                ROUND_TRACKER,
                VOTING_RECORD,
                TRANSCRIPT
            });
        });
        socket.on('client_game_invalid_or_unauthorized', () => {
            this.setState({
                isLoading: false
            });
        });
    };

    onHandleInitialize() {
        setTimeout(() => {
            const user_id = this._get_user_id();
            const room_id = this._get_room_id();
            const room_pwd = this._get_room_pwd();
            const data = {
                user_id,
                room_id,
                room_pwd
            };
            socket.emit('server_game_handle_INITIALIZE', data);
        }, 1000);
    }

    onHandleEnter = () => {
        const user_id = this._get_user_id();
        const user_name = this.props.auth && this.props.auth.user ? this.props.auth.user.name : null;
        const room_id = this._get_room_id();
        const room_pwd = this._get_room_pwd();

        const data = {
            user_id,
            user_name,
            room_id,
            room_pwd
        };
        socket.emit('server_game_handle_ENTER', data);
    };

    onHandleSpectate = () => {
        const user_id = this._get_user_id();
        const room_id = this._get_room_id();
        const room_pwd = this._get_room_pwd();
        const data = {
            user_id,
            room_id,
            room_pwd
        };
        socket.emit('server_game_handle_SPECTATE', data);
    };

    onLeaveRoom = () => {
        const room_id = this._get_room_id();
        const user_id = this._get_user_id();
        const room_pwd = this._get_room_pwd();

        const data = {
            user_id,
            room_id,
            room_pwd
        };
        socket.emit('server_game_handle_LEAVE', data);
    };

    onLockRoom = () => {
        const room_id = this._get_room_id();
        const user_id = this._get_user_id();
        const room_pwd = this._get_room_pwd();

        const data = {
            user_id,
            room_id,
            room_pwd
        };
        socket.emit('server_game_handle_LOCK', data);
    };

    onSetup = setup => {
        const room_id = this._get_room_id();
        const user_id = this._get_user_id();
        const room_pwd = this._get_room_pwd();

        const data = {
            user_id,
            room_id,
            room_pwd,
            setup
        };
        socket.emit('server_game_handle_SETUP', data);
    };

    onStart = () => {
        const user_id = this._get_user_id();
        const room_id = this._get_room_id();
        const room_pwd = this._get_room_pwd();

        const data = {
            user_id,
            room_id,
            room_pwd
        };
        socket.emit('server_game_handle_START', data);
    };

    onClickPlayerCard = target_idx => {
        const room_id = this._get_room_id();
        const user_id = this._get_user_id();
        const room_pwd = this._get_room_pwd();

        const data = {
            user_id,
            room_id,
            room_pwd,
            target_idx
        };
        socket.emit('server_game_handle_SELECT', data);
    };

    onHandleButtonClick = (button, isAffirmative) => {
        const room_id = this._get_room_id();
        const user_id = this._get_user_id();
        const room_pwd = this._get_room_pwd();

        const data = {
            user_id,
            room_id,
            room_pwd
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
        } else if (button === 'confirm_excalibur') {
            socket.emit('server_game_handle_CONFIRM_EXCALIBUR', data);
        } else if (button === 'use_lotl') {
            socket.emit('server_game_handle_USE_LOTL', data);
        } else if (button === 'confirm_lotl') {
            socket.emit('server_game_handle_CONFIRM_LOTL', data);
        }
    };

    _getIsPlayerInGame = () => {
        // If PLAYERS_LIST contains user_id
        const { PLAYERS_LIST } = this.state;
        if (!PLAYERS_LIST) {
            return false;
        }
        const user_id = this._get_user_id();
        const arrPlayerWithUserId = PLAYERS_LIST.filter(playerObj => {
            return playerObj.user_id === user_id;
        });
        const isPlayerInGame = arrPlayerWithUserId.length > 0;
        return isPlayerInGame;
    };

    _getRoomLeaderButton = () => {
        const { hasLocked, hasSetup, hasStarted, isRoomLeader, PLAYERS_LIST } = this.state;
        let roomLeaderButton = null;
        if (isRoomLeader) {
            const needWaitToLock = PLAYERS_LIST && (PLAYERS_LIST.length < 5 || PLAYERS_LIST.length > 12);
            const needLock = !hasLocked;
            const needSetup = hasLocked && !hasSetup;
            const needStart = hasSetup && !hasStarted;
            if (needLock) {
                roomLeaderButton = (
                    <Button
                        className={classes.Button}
                        block
                        disabled={needWaitToLock}
                        color="warning"
                        onClick={this.onLockRoom}
                    >
                        Lock
                    </Button>
                );
            } else if (needSetup) {
                roomLeaderButton = (
                    <GameSetupModal num_players={this.state.PLAYERS_LIST.length} onSetup={this.onSetup} />
                );
            } else if (needStart) {
                roomLeaderButton = (
                    <Button className={classes.Button} block color="success" onClick={this.onStart}>
                        Start
                    </Button>
                );
            }
        }
        return roomLeaderButton;
    };

    render() {
        // Check if loading
        const { isLoading } = this.state;
        if (isLoading) {
            return <LoadingSpinner />;
        }

        // Check if authenticated
        const { isAuthenticated } = this.props.auth;
        if (!isAuthenticated) {
            return <AccessDeniedPage />;
        }

        // Check if valid game
        const { isValid } = this.state;
        if (!isValid) {
            return <InvalidGamePage />;
        }

        const { PLAYERS_LIST, MISSION_TRACKER, ROUND_TRACKER, VOTING_RECORD, TRANSCRIPT } = this.state;
        const { board, button, team } = this.state;
        const { hasStarted } = this.state;
        const room_id = this._get_room_id();
        const roomLeaderButton = this._getRoomLeaderButton();

        const preGameComponents = !hasStarted ? (
            <Container>
                {roomLeaderButton}
                <PlayersList players_list={PLAYERS_LIST} />
            </Container>
        ) : null;
        const gameComponents = hasStarted ? (
            <div>
                <GameBoard
                    onClickPlayerCard={this.onClickPlayerCard}
                    onHandleButtonClick={this.onHandleButtonClick}
                    board={board}
                    button={button}
                    team={team}
                    MISSION_TRACKER={MISSION_TRACKER}
                    ROUND_TRACKER={ROUND_TRACKER}
                />
                <GameNav room={room_id} voting_record={VOTING_RECORD} transcript={TRANSCRIPT} />
            </div>
        ) : null;

        return (
            <div>
                <GameEnterModal
                    room={room_id}
                    hasStarted={hasStarted}
                    isPlayerInGame={this._getIsPlayerInGame()}
                    onHandleEnter={this.onHandleEnter}
                    onHandleSpectate={this.onHandleSpectate}
                />
                {preGameComponents}
                {gameComponents}
            </div>
        );
    }
}

GameRoom.propTypes = {
    auth: PropTypes.object.isRequired,
    is_public: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(GameRoom);
