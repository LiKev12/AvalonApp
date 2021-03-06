const ResourceRoles = require('../resources/Roles');

class Metadata {
    constructor() {
        //
        this.hasLocked = false;
        this.hasSetup = false;
        this.hasStarted = false;
        this.hasEnded = false;
        this.roomLeaderId = null;
        //
        this.players = [];
        this.ordered_players = [];
        this.ordered_ids = [];
        this.map_id_to_idx = {};
        this.map_idx_to_id = {};
        //
        this.num_players = null;
        this.board = null;
        this.features = null;
        //
        this.assassin_performer = null;
        this.correct_assassin_target = null;
    }

    getNumSpotsOnMission(mission) {
        return this.board[mission].num_spots_on_mission;
    }

    /**
     * create game => hasStarted, hasEnded, hasLocked = false
     * enter room => check if room is locked, if so, cannot enter (unless it is original player)
     * leave room => DONT DO ANYTHING once game is locked. Before lock, remove player from room.
     *
     */

    handleEnter(user_id, user_name) {
        if (!this.hasLocked) {
            const isPlayerInGame = this.players.some(player => player.user_id === user_id);
            if (!isPlayerInGame) {
                this.players.push({ user_id, user_name });
                this.roomLeaderId = this.players[0].user_id;
            }
        }
    }

    handleLeave(user_id) {
        if (!this.hasLocked) {
            const isPlayerInGame = this.players.some(player => player.user_id === user_id);
            if (isPlayerInGame) {
                this.players = this.players.filter(playerObj => playerObj.user_id !== user_id);
                if (this.players.length > 0) {
                    this.roomLeaderId = this.players[0].user_id;
                } else {
                    this.roomLeaderId = null;
                }
            }
        }
    }

    handleLock() {
        this.hasLocked = true;
    }

    handleSetup(num_players, roles, features, board) {
        this.hasSetup = true;
        this.num_players = num_players;
        this.features = features;
        this.board = board;
        this.ordered_players = this._getOrderedPlayers(roles);
        this.ordered_ids = this._init_ordered_ids();
        this.map_id_to_idx = this._init_map_id_to_idx();
        this.map_idx_to_id = this._init_map_idx_to_id();
        this.assassin_performer = this._init_assassin_performer();
        this.correct_assassin_target = this._init_correct_assassin_target();
    }

    handleStart() {
        this.hasStarted = true;
    }

    handleEnd() {
        this.hasEnded = true;
    }

    _getOrderedPlayers(roles_from_client) {
        // create copy of this.players
        const ordered_players = [];
        this.players.forEach(playerObj => {
            const orderedPlayerObj = {};
            const { user_id, user_name } = playerObj;
            orderedPlayerObj.user_id = user_id;
            orderedPlayerObj.user_name = user_name;
            ordered_players.push(orderedPlayerObj);
        });

        // create copy of roles
        const roles = [];
        roles_from_client.forEach(role => {
            roles.push(role);
        });

        // shuffle players
        this._shuffle(ordered_players);

        // shuffle roles
        this._shuffle(roles);

        // assign role to player
        ordered_players.forEach((orderedPlayerObj, idx) => {
            const role = roles[idx];
            orderedPlayerObj.role = role;
            orderedPlayerObj.team = ResourceRoles[role]['Team'];
        });
        return ordered_players;
    }

    _shuffle(arr) {
        // Fisher-Yates Shuffle
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const x = arr[i];
            arr[i] = arr[j];
            arr[j] = x;
        }
    }

    _init_ordered_ids() {
        const ordered_ids = [];
        this.ordered_players.forEach(playerObj => {
            const { user_id } = playerObj;
            ordered_ids.push(user_id);
        });
        return ordered_ids;
    }

    _init_map_id_to_idx() {
        const map_id_to_idx = {};
        this.ordered_players.forEach((playerObj, idx) => {
            const { user_id } = playerObj;
            map_id_to_idx[user_id] = idx;
        });
        return map_id_to_idx;
    }

    _init_map_idx_to_id() {
        const map_idx_to_id = {};
        this.ordered_players.forEach((playerObj, idx) => {
            const { user_id } = playerObj;
            map_idx_to_id[idx] = user_id;
        });
        return map_idx_to_id;
    }

    _init_assassin_performer() {
        const orderOfSelection = ['Assassin', 'Morgana', 'Minion', 'Mordred', 'Oberon'];
        let assassin_performer_user_id = null;
        let found = false;
        orderOfSelection.forEach(roleOfChoice => {
            this.ordered_players.forEach(playerObj => {
                if (!found) {
                    const { role, user_id } = playerObj;
                    if (role === roleOfChoice) {
                        assassin_performer_user_id = user_id;
                        found = true;
                    }
                }
            });
        });
        return assassin_performer_user_id;
    }

    _init_correct_assassin_target() {
        let assassin_target_user_id = null;
        this.ordered_players.forEach(playerObj => {
            const { role, user_id } = playerObj;
            if (role === 'Merlin') {
                assassin_target_user_id = user_id;
            }
        });
        return assassin_target_user_id;
    }

    get() {
        return this;
    }
}

module.exports = Metadata;
