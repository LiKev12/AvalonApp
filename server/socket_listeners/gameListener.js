/**
 * data: { user_id, room_id, room_pwd, is_public, is_rated }
 * Notes: Handles creating a game from lobby modal
 */
server_game_handle_CREATE = (io, sock, Avalon) => {
    sock.on('server_game_handle_CREATE', data => {
        console.log('server_game_handle_CREATE', data);
        const { user_id, room_id, room_pwd, is_public, is_rated } = data;
        if (!!user_id) {
            Avalon.createGame(room_id, room_pwd, is_public, is_rated);
            _update_client_game_lobby_data(io, Avalon);
        }
    });
};

/**
 * data: { user_id, room_id, room_pwd }
 * Notes: Handles player joining a room for the first time (currently same as spectate, but may change later)
 */
server_game_handle_INITIALIZE = (io, sock, Avalon) => {
    sock.on('server_game_handle_INITIALIZE', data => {
        console.log('server_game_handle_INITIALIZE', data);
        const { user_id, room_id, room_pwd } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id) {
            if (game && game.isValid(room_pwd)) {
                sock.join(room_id);
                _update_client_game_view_data(io, room_id, game);
            } else {
                _update_client_game_invalid_or_unauthorized(sock);
            }
        } else {
            _update_client_game_invalid_or_unauthorized(sock);
        }
    });
};

/**
 * data: { user_id, room_id, room_pwd }
 * Notes: Handles player spectating a game (join the socket room as well)
 */
server_game_handle_SPECTATE = (io, sock, Avalon) => {
    sock.on('server_game_handle_SPECTATE', data => {
        console.log('server_game_handle_SPECTATE', data);
        const { user_id, room_id, room_pwd } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id && game && game.isValid(room_pwd)) {
            sock.join(room_id);
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * data: { user_id, user_name, room_id, room_pwd }
 * Notes: Handles player entering a game (join the socket room as well)
 */
server_game_handle_ENTER = (io, sock, Avalon) => {
    sock.on('server_game_handle_ENTER', data => {
        console.log('server_game_handle_ENTER', data);
        const { user_id, user_name, room_id, room_pwd } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id && game && game.isValid(room_pwd)) {
            game.handleEnter(user_id, user_name);
            sock.join(room_id);
            _update_client_game_lobby_data(io, Avalon);
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * data: { user_id, room_id, room_pwd }
 * Notes: Handles player leaving a game
 */
server_game_handle_LEAVE = (io, sock, Avalon) => {
    sock.on('server_game_handle_LEAVE', data => {
        console.log('server_game_handle_LEAVE', data);
        const { user_id, room_id, room_pwd } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id && game && game.isValid(room_pwd)) {
            game.handleLeave(user_id);
            _update_client_game_lobby_data(io, Avalon);
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * data: { user_id, room_id, room_pwd }
 * Notes: Handles player locking a game so no more players can enter
 */
server_game_handle_LOCK = (io, sock, Avalon) => {
    sock.on('server_game_handle_LOCK', data => {
        console.log('server_game_handle_LOCK', data);
        const { user_id, room_id, room_pwd } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id && game && game.isValid(room_pwd)) {
            game.handleLock();
            _update_client_game_lobby_data(io, Avalon);
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * data: { user_id, room_id, room_pwd, setup }
 * Notes: Handles player setting up a game from modal (setup includes { roles, features, num_players })
 */
server_game_handle_SETUP = (io, sock, Avalon) => {
    sock.on('server_game_handle_SETUP', data => {
        console.log('server_game_handle_SETUP', data);
        const { user_id, room_id, room_pwd, setup } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id && game && game.isValid(room_pwd)) {
            game.handleSetup(setup);
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * data: { user_id, room_id, room_pwd }
 * Notes: Handles player starting a game
 */
server_game_handle_START = (io, sock, Avalon) => {
    sock.on('server_game_handle_START', data => {
        console.log('server_game_handle_START', data);
        const { user_id, room_id, room_pwd } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id && game && game.isValid(room_pwd)) {
            game.handleStart();
            _update_client_game_lobby_data(io, Avalon);
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * data: { user_id, room_id, room_pwd, target_idx }
 * Notes: Handles player selecting a player card
 */
server_game_handle_SELECT = (io, sock, Avalon) => {
    sock.on('server_game_handle_SELECT', data => {
        console.log('server_game_handle_SELECT', data);
        const { user_id, room_id, room_pwd, target_idx } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id && game && game.isValid(room_pwd)) {
            game.handleSelect(user_id, target_idx);
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * data: { user_id, room_id, room_pwd }
 * Notes: Handles player proposing a team
 */
server_game_handle_PROPOSE = (io, sock, Avalon) => {
    sock.on('server_game_handle_PROPOSE', data => {
        console.log('server_game_handle_PROPOSE', data);
        const { user_id, room_id, room_pwd } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id && game && game.isValid(room_pwd)) {
            game.handlePropose(user_id);
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * data: { user_id, room_id, room_pwd, isApproved }
 * Notes: Handles player voting on a round
 */
server_game_handle_ROUND = (io, sock, Avalon) => {
    sock.on('server_game_handle_ROUND', data => {
        console.log('server_game_handle_ROUND', data);
        const { user_id, room_id, room_pwd, isApproved } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id && game && game.isValid(room_pwd)) {
            game.handleRound(user_id, isApproved);
            if (game.hasGameEnded()) {
                _update_client_game_lobby_data(io, Avalon);
            }
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * data: { user_id, room_id, room_pwd, isPassed }
 * Notes: Handles player voting on a mission
 */
server_game_handle_MISSION = (io, sock, Avalon) => {
    sock.on('server_game_handle_MISSION', data => {
        console.log('server_game_handle_MISSION', data);
        const { user_id, room_id, room_pwd, isPassed } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id && game && game.isValid(room_pwd)) {
            game.handleMission(user_id, isPassed);
            if (game.hasGameEnded()) {
                _update_client_game_lobby_data(io, Avalon);
            }
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * data: { user_id, room_id, room_pwd }
 * Notes: Handles spy player confirming the choice of assassination
 */
server_game_handle_ASSASSINATE = (io, sock, Avalon) => {
    sock.on('server_game_handle_ASSASSINATE', data => {
        console.log('server_game_handle_ASSASSINATE', data);
        const { user_id, room_id, room_pwd } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id && game && game.isValid(room_pwd)) {
            game.handleAssassinate(user_id);
            if (game.hasGameEnded()) {
                _update_client_game_lobby_data(io, Avalon);
            }
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * data: { user_id, room_id, room_pwd }
 * Notes: Handles player giving another player the excalibur
 */
server_game_handle_GIVE_EXCALIBUR = (io, sock, Avalon) => {
    sock.on('server_game_handle_GIVE_EXCALIBUR', data => {
        console.log('server_game_handle_GIVE_EXCALIBUR', data);
        const { user_id, room_id, room_pwd } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id && game && game.isValid(room_pwd)) {
            game.handleGiveExcalibur(user_id);
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * data: { user_id, room_id, room_pwd, isExcaliburUsed }
 * Notes: Handles player that was given excalibur using excalibur
 */
server_game_handle_USE_EXCALIBUR = (io, sock, Avalon) => {
    sock.on('server_game_handle_USE_EXCALIBUR', data => {
        console.log('server_game_handle_USE_EXCALIBUR', data);
        const { user_id, room_id, room_pwd, isExcaliburUsed } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id && game && game.isValid(room_pwd)) {
            game.handleUseExcalibur(user_id, isExcaliburUsed);
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * data: { user_id, room_id, room_pwd }
 * Notes: Handles player confirming they read the excalibur message (whether target voted pass or fail)
 */
server_game_handle_CONFIRM_EXCALIBUR = (io, sock, Avalon) => {
    sock.on('server_game_handle_CONFIRM_EXCALIBUR', data => {
        console.log('server_game_handle_CONFIRM_EXCALIBUR', data);
        const { user_id, room_id, room_pwd } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id && game && game.isValid(room_pwd)) {
            game.handleConfirmExcalibur(user_id);
            if (game.hasGameEnded()) {
                _update_client_game_lobby_data(io, Avalon);
            }
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * data: { user_id, room_id, room_pwd }
 * Notes: Handles using Lady of the Lake on selected player
 */
server_game_handle_USE_LOTL = (io, sock, Avalon) => {
    sock.on('server_game_handle_USE_LOTL', data => {
        console.log('server_game_handle_USE_LOTL', data);
        const { user_id, room_id, room_pwd } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id && game && game.isValid(room_pwd)) {
            game.handleUseLOTL(user_id);
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * data: { user_id, room_id, room_pwd }
 * Notes: Handles user confirming they read the LOTL message
 */
server_game_handle_CONFIRM_LOTL = (io, sock, Avalon) => {
    sock.on('server_game_handle_CONFIRM_LOTL', data => {
        console.log('server_game_handle_CONFIRM_LOTL', data);
        const { user_id, room_id, room_pwd } = data;
        const game = Avalon.getGame(room_id);
        if (!!user_id && game && game.isValid(room_pwd)) {
            game.handleConfirmLOTL(user_id);
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * Called every hour to refresh lobby view for an individual player (for when games are cleaned)
 * Delete game if :
 * - creation_time was over a day ago
 * - end_time was over an hour ago
 */
server_game_CLEAN_request = (io, sock, Avalon) => {
    setInterval(() => _refresh_client_game_lobby_data(sock, Avalon), 3600000);
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
        if (!!user_id && game && game.isValid(room_pwd)) {
            _update_client_game_view_data(io, room_id, game);
        }
    });
};

/**
 * Notes: Private helper methods
 */

_refresh_client_game_lobby_data = (sock, Avalon) => {
    const gameLobbyData = Avalon.getLobbyData();
    sock.emit('client_game_lobby_data', gameLobbyData);
};

_update_client_game_lobby_data = (io, Avalon) => {
    const gameLobbyData = Avalon.getLobbyData();
    io.emit('client_game_lobby_data', gameLobbyData);
};

_update_client_game_view_data = (io, room_id, game) => {
    const gameViewData = game.getViewData();
    io.to(room_id).emit('client_game_view_data', gameViewData);
};

_update_client_game_invalid_or_unauthorized = sock => {
    sock.emit('client_game_invalid_or_unauthorized');
};

module.exports = {
    server_game_handle_CREATE,
    server_game_handle_INITIALIZE,
    server_game_handle_SPECTATE,
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
    server_game_handle_CONFIRM_EXCALIBUR,
    server_game_handle_USE_LOTL,
    server_game_handle_CONFIRM_LOTL,
    server_game_CLEAN_request,
    server_game_view_data,
    server_game_lobby_data
};
