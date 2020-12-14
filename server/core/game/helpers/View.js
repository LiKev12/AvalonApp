const ResourceRoles = require('../resources/Roles');

class View {
    constructor() {
        console.log('new view object!');
        this.boards = null;
        this.buttons = null;
        this.teams = null;

        this.PLAYERS_LIST = null;
        this.MISSION_TRACKER = null;
        this.ROUND_TRACKER = null;
        this.VOTING_RECORD = null;
    }

    reveal_boards(ordered_players) {
        Object.keys(this.boards).forEach(view_id => {
            this.boards[view_id].forEach((player_view, player_idx) => {
                const curr_ordered_player = ordered_players[player_idx];
                const { role, team } = curr_ordered_player;
                playerView['isLeader'] = false;
                playerView['isSelected'] = false;
                playerView['isGivenExcalibur'] = false;
                playerView['isTargetedByExcalibur'] = false;
                player_view['roleAppearsAs'] = role;
                player_view['teamAppearsAs'] = team;
            });
        });
    }

    update_boards(leader_idx) {
        Object.keys(this.boards).forEach(view_id => {
            this.boards[view_id].forEach((playerView, player_idx) => {
                playerView['isLeader'] = player_idx === leader_idx;
                playerView['isSelected'] = false;
                playerView['isGivenExcalibur'] = false;
                playerView['isTargetedByExcalibur'] = false;
            });
        });
    }

    update_ROUND_TRACKER(round) {
        this.ROUND_TRACKER = round;
    }

    update_VOTING_RECORD(record, map_id_to_idx, num_players) {
        Object.keys(record).forEach(missionNumber => {
            Object.keys(record[missionNumber]).forEach(roundNumber => {
                const round = record[missionNumber][roundNumber];
                if (!!round) {
                    const { leader_id, team, votes_round, player_given_excalibur, player_to_excalibur } = round;
                    this.VOTING_RECORD.record[missionNumber][roundNumber] = {};
                    this.VOTING_RECORD.record[missionNumber][roundNumber]['leader'] = map_id_to_idx[leader_id];
                    this.VOTING_RECORD.record[missionNumber][roundNumber]['team'] = Array(num_players).fill(false);
                    team.forEach(user_id => {
                        const user_idx = map_id_to_idx[user_id];
                        this.VOTING_RECORD.record[missionNumber][roundNumber]['team'][user_idx] = true;
                    });
                    this.VOTING_RECORD.record[missionNumber][roundNumber]['votesRound'] = Array(num_players).fill(
                        false
                    );
                    votes_round.forEach(voteObj => {
                        const { user_id, vote } = voteObj;
                        const user_idx = map_id_to_idx[user_id];
                        this.VOTING_RECORD.record[missionNumber][roundNumber]['votesRound'][user_idx] = vote;
                    });
                    this.VOTING_RECORD.record[missionNumber][roundNumber]['player_given_excalibur'] =
                        map_id_to_idx[player_given_excalibur];
                    this.VOTING_RECORD.record[missionNumber][roundNumber]['player_to_excalibur'] =
                        map_id_to_idx[player_to_excalibur];
                }
            });
        });
    }

    update_MISSION_TRACKER(summary) {
        // Update
        this.MISSION_TRACKER = summary;
    }

    setButtonForMultiplePlayers(user_ids, button) {
        user_ids.forEach(user_id => {
            this.setButton(user_id, button);
        });
    }

    setButton(user_id, button) {
        this.buttons[user_id] = button;
    }

    unsetButton(user_id) {
        this.buttons[user_id] = null;
    }

    unsetPlayerStillVoting(target_idx) {
        Object.keys(this.boards).forEach(view_id => {
            this.boards[view_id][target_idx]['activeState'] = null;
        });
    }

    setAllPlayersToStillVoting() {
        Object.keys(this.boards).forEach(view_id => {
            this.boards[view_id].forEach((player, player_idx) => {
                this.boards[view_id][player_idx]['activeState'] = 'IS_STILL_VOTING';
            });
        });
    }

    setSomePlayersToStillVoting(arr_target_idx) {
        Object.keys(this.boards).forEach(view_id => {
            this.boards[view_id].forEach((player, player_idx) => {
                if (arr_target_idx.includes(player_idx)) {
                    this.boards[view_id][player_idx]['activeState'] = 'IS_STILL_VOTING';
                }
            });
        });
    }

    togglePlayerToAssassinate(target_idx, isTargetedByAssassin) {
        // Unset all others to false
        Object.keys(this.boards).forEach(view_id => {
            this.boards[view_id].forEach((player, player_idx) => {
                this.boards[view_id][player_idx]['activeState'] = null;
            });
        });
        if (isTargetedByAssassin) {
            // Set the correct user to true
            Object.keys(this.boards).forEach(view_id => {
                this.boards[view_id][target_idx]['activeState'] = 'IS_TARGETED_BY_ASSASSIN';
            });
        }
    }

    togglePlayerToExcalibur(target_idx, isTargetedByExcalibur) {
        // Unset all others to false
        Object.keys(this.boards).forEach(view_id => {
            this.boards[view_id].forEach((player, player_idx) => {
                this.boards[view_id][player_idx]['activeState'] = null;
            });
        });
        if (isTargetedByExcalibur) {
            // Set the correct user to true
            Object.keys(this.boards).forEach(view_id => {
                this.boards[view_id][target_idx]['activeState'] = 'IS_TARGETED_BY_EXCALIBUR';
            });
        }
    }

    togglePlayerGivenExcalibur(target_idx, isGivenExcalibur) {
        // Unset all others to false
        Object.keys(this.boards).forEach(view_id => {
            this.boards[view_id].forEach((player, player_idx) => {
                this.boards[view_id][player_idx]['isGivenExcalibur'] = false;
            });
        });
        if (isGivenExcalibur) {
            // Set the correct user to true
            Object.keys(this.boards).forEach(view_id => {
                this.boards[view_id][target_idx]['isGivenExcalibur'] = isGivenExcalibur;
            });
        }
    }

    addPlayerSelected(target_idx) {
        // view_id is either a user_id or 'spectate'
        Object.keys(this.boards).forEach(view_id => {
            this.boards[view_id][target_idx].isSelected = true;
        });
    }

    removePlayerSelected(target_idx) {
        // view_id is either a user_id or 'spectate'
        Object.keys(this.boards).forEach(view_id => {
            this.boards[view_id][target_idx].isSelected = false;
        });
    }

    /**
     *
     * @param {} data: {user_id, user_name}
     */
    handleEnter(user_id, user_name) {
        if (!this.PLAYERS_LIST) {
            this.PLAYERS_LIST = [];
        }
        this.PLAYERS_LIST.push({ user_id, user_name });
    }

    /**
     *
     * @param {*} data: user_id
     */
    handleLeave(user_id) {
        this.PLAYERS_LIST = this.PLAYERS_LIST.filter(tableObj => tableObj.user_id !== user_id);
        if (this.PLAYERS_LIST.length === 0) {
            this.PLAYERS_LIST = null;
        }
    }

    handleSetup(ordered_players, summary) {
        // Create boards for each player
        this.boards = this._init_boards(ordered_players);
        // Create buttons for each player
        this.buttons = this._init_buttons(ordered_players);
        // Create team for each player
        this.teams = this._init_teams(ordered_players);
        // Create common MISSION_TRACKER
        this.MISSION_TRACKER = summary;
        // Create common ROUND_TRACKER
        this.ROUND_TRACKER = 1;
        // Create common VOTING_RECORD
        this.VOTING_RECORD = {
            players: this._init_VOTING_RECORD_players(ordered_players),
            record: {
                1: { 1: null, 2: null, 3: null, 4: null, 5: null },
                2: { 1: null, 2: null, 3: null, 4: null, 5: null },
                3: { 1: null, 2: null, 3: null, 4: null, 5: null },
                4: { 1: null, 2: null, 3: null, 4: null, 5: null },
                5: { 1: null, 2: null, 3: null, 4: null, 5: null }
            }
        };
    }

    _init_VOTING_RECORD_players(ordered_players) {
        const players = [];
        ordered_players.forEach(player => {
            players.push(player.user_name);
        });
        return players;
    }

    _init_boards(ordered_players) {
        const boards = {};

        // Create board for each player in game
        ordered_players.forEach(playerObjToGetID => {
            const { user_id, role, team } = playerObjToGetID;
            boards[user_id] = [];
            ordered_players.forEach((playerObj, idx) => {
                const player_view = {};

                player_view['user_name'] = playerObj.user_name;
                player_view['isSelected'] = false;
                player_view['isLeader'] = idx === 0; // Initially, first player at table is leader
                player_view['isGivenExcalibur'] = false;
                player_view['activeState'] = null;
                const is_seen = playerObj.role in ResourceRoles[role]['Sees'];
                player_view['teamAppearsAs'] = is_seen ? ResourceRoles[role]['Sees'][playerObj.role] : 'RESISTANCE';
                const is_known = playerObj.role in ResourceRoles[role]['Knows'];
                player_view['roleAppearsAs'] = is_known ? ResourceRoles[role]['Knows'][playerObj.role] : 'Unknown';

                const is_self = playerObj.user_id === user_id;
                if (is_self) {
                    player_view['roleAppearsAs'] = role;
                    player_view['teamAppearsAs'] = team;
                }
                boards[user_id].push(player_view);
            });
        });

        // Create board for spectator
        boards['spectate'] = [];
        ordered_players.forEach((playerObj, idx) => {
            const player_view = {};
            player_view['user_name'] = playerObj.user_name;
            player_view['isSelected'] = false;
            player_view['isLeader'] = idx === 0; // Initially, first player at table is leader
            player_view['isGivenExcalibur'] = false;
            player_view['activeState'] = null;
            player_view['teamAppearsAs'] = 'RESISTANCE';
            player_view['roleAppearsAs'] = 'Unknown';
            boards['spectate'].push(player_view);
        });
        return boards;
    }

    _init_buttons(ordered_players) {
        const buttons = {};
        ordered_players.forEach(playerObjToGetID => {
            const { user_id } = playerObjToGetID;
            buttons[user_id] = null;
        });
        buttons['spectate'] = null;
        return buttons;
    }

    _init_teams(ordered_players) {
        const teams = {};
        ordered_players.forEach(playerObjToGetID => {
            const { user_id, team } = playerObjToGetID;
            teams[user_id] = team;
        });
        teams['spectate'] = null;
        return teams;
    }

    /**
     *
     * @param {flags} metadata
     */
    get(metadata) {
        const { hasLocked, hasSetup, hasStarted, hasEnded } = metadata.get();
        return {
            // From metadata
            hasLocked,
            hasSetup,
            hasStarted,
            hasEnded,
            // Single
            boards: this.boards,
            buttons: this.buttons,
            teams: this.teams,
            // Common
            PLAYERS_LIST: this.PLAYERS_LIST,
            MISSION_TRACKER: this.MISSION_TRACKER,
            ROUND_TRACKER: this.ROUND_TRACKER,
            VOTING_RECORD: this.VOTING_RECORD
        };
    }
}

module.exports = View;
