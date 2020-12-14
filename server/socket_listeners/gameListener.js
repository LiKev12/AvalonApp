/**
 * data: { room_id, user_id, is_public }
 * Notes: Handles creating a game from lobby modal
 */
server_game_handle_CREATE = (io, sock, Avalon) => {
    sock.on('server_game_handle_CREATE', data => {
        const { room_id, user_id, is_public } = data;
        if (user_id) {
            Avalon.createGame(room_id, is_public);
            _update_client_game_lobby_data(io, Avalon);
        }
    });
};

/**
 * data: { room_id, user_id, user_name }
 * Notes: Handles player entering a game
 */
server_game_handle_ENTER = (io, sock, Avalon) => {
    sock.on('server_game_handle_ENTER', data => {
        const { room_id, user_id, user_name } = data;
        const game = Avalon.getGame(room_id);
        if (game && user_id) {
            game.handleEnter(user_id, user_name);
            _update_client_game_lobby_data(io, Avalon);
            _update_client_game_view_data(io, game);
        }
    });
};

/**
 * data: { room_id, user_id }
 * Notes: Handles player leaving a game
 */
server_game_handle_LEAVE = (io, sock, Avalon) => {
    sock.on('server_game_handle_LEAVE', data => {
        const { room_id, user_id } = data;
        const game = Avalon.getGame(room_id);
        if (game && user_id) {
            game.handleLeave(user_id);
            _update_client_game_lobby_data(io, Avalon);
            _update_client_game_view_data(io, game);
        }
    });
};

/**
 * data: { room_id, user_id }
 * Notes: Handles player locking a game so no more players can enter
 */
server_game_handle_LOCK = (io, sock, Avalon) => {
    sock.on('server_game_handle_LOCK', data => {
        const { room_id, user_id } = data;
        const game = Avalon.getGame(room_id);
        if (game && user_id) {
            game.handleLock();
            _update_client_game_lobby_data(io, Avalon);
            _update_client_game_view_data(io, game);
        }
    });
};

/**
 * data: { room_id, user_id, setup }
 * Notes: Handles player setting up a game from modal (setup includes { roles, features, num_players })
 */
server_game_handle_SETUP = (io, sock, Avalon) => {
    sock.on('server_game_handle_SETUP', data => {
        const { room_id, user_id, setup } = data;
        const game = Avalon.getGame(room_id);
        if (game && user_id) {
            game.handleSetup(setup);
            _update_client_game_view_data(io, game);
        }
    });
};

/**
 * data: { room_id, user_id }
 * Notes: Handles player starting a game
 */
server_game_handle_START = (io, sock, Avalon) => {
    sock.on('server_game_handle_START', data => {
        const { room_id, user_id } = data;
        const game = Avalon.getGame(room_id);
        if (game && user_id) {
            game.handleStart();
            _update_client_game_view_data(io, game);
        }
    });
};

/**
 * data: { room_id, user_id, target_idx }
 * Notes: Handles player selecting a player card
 */
server_game_handle_SELECT = (io, sock, Avalon) => {
    sock.on('server_game_handle_SELECT', data => {
        const { room_id, user_id, target_idx } = data;
        const game = Avalon.getGame(room_id);
        if (game && user_id) {
            game.handleSelect(user_id, target_idx);
            _update_client_game_view_data(io, game);
        }
    });
};

/**
 * data: { room_id, user_id }
 * Notes: Handles player proposing a team
 */
server_game_handle_PROPOSE = (io, sock, Avalon) => {
    sock.on('server_game_handle_PROPOSE', data => {
        console.log('server_game_handle_PROPOSE', data);
        const { room_id, user_id } = data;
        const game = Avalon.getGame(room_id);
        if (game && user_id) {
            game.handlePropose(user_id);
            _update_client_game_view_data(io, game);
        }
    });
};

/**
 * data: { room_id, user_id, isApproved }
 * Notes: Handles player voting on a round
 */
server_game_handle_ROUND = (io, sock, Avalon) => {
    sock.on('server_game_handle_ROUND', data => {
        console.log('server_game_handle_ROUND', data);
        const { room_id, user_id, isApproved } = data;
        const game = Avalon.getGame(room_id);
        if (game && user_id) {
            game.handleRound(user_id, isApproved);
            if (game.hasGameEnded()) {
                _update_client_game_lobby_data(io, Avalon);
            }
            _update_client_game_view_data(io, game);
        }
    });
};

/**
 * data: { room_id, user_id, isPassed }
 * Notes: Handles player voting on a mission
 */
server_game_handle_MISSION = (io, sock, Avalon) => {
    sock.on('server_game_handle_MISSION', data => {
        console.log('server_game_handle_MISSION', data);
        const { room_id, user_id, isPassed } = data;
        const game = Avalon.getGame(room_id);
        if (game && user_id) {
            game.handleMission(user_id, isPassed);
            if (game.hasGameEnded()) {
                _update_client_game_lobby_data(io, Avalon);
            }
            _update_client_game_view_data(io, game);
        }
    });
};

/**
 * data: { room_id, user_id }
 * Notes: Handles player giving another player the excalibur
 */
server_game_handle_GIVE_EXCALIBUR = (io, sock, Avalon) => {
    sock.on('server_game_handle_GIVE_EXCALIBUR', data => {
        console.log('server_game_handle_GIVE_EXCALIBUR', data);
        const { room_id, user_id } = data;
        const game = Avalon.getGame(room_id);
        if (game && user_id) {
            game.handleGiveExcalibur(user_id);
            _update_client_game_view_data(io, game);
        }
    });
};

/**
 * data: { room_id, user_id, isExcaliburUsed }
 * Notes: Handles player that was given excalibur using excalibur
 */
server_game_handle_USE_EXCALIBUR = (io, sock, Avalon) => {
    sock.on('server_game_handle_USE_EXCALIBUR', data => {
        console.log('server_game_handle_USE_EXCALIBUR', data);
        const { room_id, user_id, isExcaliburUsed } = data;
        const game = Avalon.getGame(room_id);
        if (game && user_id) {
            game.handleUseExcalibur(user_id, isExcaliburUsed);
            if (game.hasGameEnded()) {
                _update_client_game_lobby_data(io, Avalon);
            }
            _update_client_game_view_data(io, game);
        }
    });
};

/**
 * data: { room_id, user_id }
 * Notes: Handles spy player confirming the choice of assassination
 */
server_game_handle_ASSASSINATE = (io, sock, Avalon) => {
    sock.on('server_game_handle_ASSASSINATE', data => {
        console.log('server_game_handle_ASSASSINATE', data);
        const { room_id, user_id } = data;
        const game = Avalon.getGame(room_id);
        if (game && user_id) {
            game.handleAssassinate(user_id);
            if (game.hasGameEnded()) {
                _update_client_game_lobby_data(io, Avalon);
            }
            _update_client_game_view_data(io, game);
        }
    });
};

/**
 * Notes: Called to initialize lobby page
 */
server_game_lobby_data = (io, sock, Avalon) => {
    sock.on('server_game_lobby_data', () => {
        _update_client_game_lobby_data(io, Avalon);
    });
};

/**
 * Notes: Called to initialize game page
 */
server_game_view_data = (io, sock, Avalon) => {
    sock.on('server_game_view_data', data => {
        const { room_id, user_id } = data;
        const game = Avalon.getGame(room_id);
        if (game && user_id) {
            _update_client_game_view_data(io, game);
        }
    });
};

/**
 * Notes: Private helper methods
 */

_update_client_game_lobby_data = (io, Avalon) => {
    const gameLobbyData = Avalon.getLobbyData();
    io.emit('client_game_lobby_data', gameLobbyData);
};

_update_client_game_view_data = (io, game) => {
    const gameViewData = game.getViewData();
    io.emit('client_game_view_data', gameViewData);
};

module.exports = {
    server_game_handle_CREATE,
    server_game_handle_ENTER,
    server_game_handle_LEAVE,
    server_game_handle_LOCK,
    server_game_handle_SETUP,
    server_game_handle_START,
    server_game_handle_SELECT,
    server_game_handle_PROPOSE,
    server_game_handle_ROUND,
    server_game_handle_MISSION,
    server_game_handle_ASSASSINATE,
    server_game_handle_GIVE_EXCALIBUR,
    server_game_handle_USE_EXCALIBUR,
    server_game_view_data,
    server_game_lobby_data
};
