const ResourceRoles = require('../resources/Roles');

class View {
    constructor() {
        this.boards = null;
        this.buttons = null;
        this.teams = null;

        this.PLAYERS_LIST = null;
        this.MISSION_TRACKER = null;
        this.ROUND_TRACKER = null;
        this.VOTING_RECORD = null;
        this.TRANSCRIPT = null;
    }

    reveal_boards(ordered_players) {
        Object.keys(this.boards).forEach(view_id => {
            this.boards[view_id].forEach((playerView, player_idx) => {
                const curr_ordered_player = ordered_players[player_idx];
                const { role, team } = curr_ordered_player;
                playerView['isLeader'] = false;
                playerView['isHammer'] = false;
                playerView['isSelected'] = false;
                playerView['isGivenExcalibur'] = false;
                playerView['isGivenLOTL'] = false;
                playerView['activeState'] = null;
                playerView['roleAppearsAs'] = role;
                playerView['teamAppearsAs'] = team;
            });
        });
    }

    update_boards(leader_idx, hammer_idx) {
        Object.keys(this.boards).forEach(view_id => {
            this.boards[view_id].forEach((playerView, player_idx) => {
                playerView['isLeader'] = player_idx === leader_idx;
                playerView['isHammer'] = player_idx === hammer_idx;
                playerView['isSelected'] = false;
                playerView['isGivenExcalibur'] = false;
                playerView['activeState'] = null;
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
                this.boards[view_id][target_idx]['isGivenExcalibur'] = true;
            });
        }
    }

    togglePlayerGivenLOTL(target_idx, isGivenLOTL) {
        // Unset all others to false
        Object.keys(this.boards).forEach(view_id => {
            this.boards[view_id].forEach((player, player_idx) => {
                this.boards[view_id][player_idx]['isGivenLOTL'] = false;
            });
        });
        if (isGivenLOTL) {
            // Set the correct user to true
            Object.keys(this.boards).forEach(view_id => {
                this.boards[view_id][target_idx]['isGivenLOTL'] = true;
            });
        }
    }

    togglePlayerToLOTL(target_idx, isTargetedByLOTL) {
        // Unset all others to false
        Object.keys(this.boards).forEach(view_id => {
            this.boards[view_id].forEach((player, player_idx) => {
                this.boards[view_id][player_idx]['activeState'] = null;
            });
        });
        if (isTargetedByLOTL) {
            // Set the correct user to true
            Object.keys(this.boards).forEach(view_id => {
                this.boards[view_id][target_idx]['activeState'] = 'IS_TARGETED_BY_LOTL';
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
     * Updates PLAYERS_LIST when player enters and leaves room
     */
    updatePlayersList(players) {
        if (players.length > 0) {
            const updatedPlayersList = [];
            players.forEach(player => {
                updatedPlayersList.push(player);
            });
            this.PLAYERS_LIST = updatedPlayersList;
        } else {
            this.PLAYERS_LIST = null;
        }
    }

    handleSetup(ordered_players, summary, roles, features) {
        // Create boards for each player
        this.boards = this._init_boards(ordered_players, features);
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
        // Create common TRANSCRIPT
        this.TRANSCRIPT = this._init_TRANSCRIPT(ordered_players, roles, features);
    }

    _init_VOTING_RECORD_players(ordered_players) {
        const players = [];
        ordered_players.forEach(player => {
            players.push(player.user_name);
        });
        return players;
    }

    _init_TRANSCRIPT(ordered_players, roles, features) {
        const transcript = [];
        transcript.push(`Game has started with ${ordered_players.length} players.`);
        const playerNamesString = ordered_players.map(playerObj => playerObj.user_name).join(', ');
        transcript.push(`Players: ${playerNamesString}`);
        const rolesString = roles.join(', ');
        transcript.push(`Roles: ${rolesString}`);
        const featuresString = Object.keys(features)
            .filter(feature => features[feature])
            .join(', ');
        transcript.push(`Features: ${featuresString === '' ? 'None' : featuresString}`);
        const hasLOTLFeature = features['Lady of the Lake'];
        if (hasLOTLFeature) {
            const initialLOTLName = ordered_players[ordered_players.length - 1].user_name;
            transcript.push(`${initialLOTLName} has Lady of the Lake`);
        }
        const firstLeaderName = ordered_players[0].user_name;
        transcript.push(`${firstLeaderName} is the Leader`);
        transcript.push(`${firstLeaderName} is selecting a team...`);
        return transcript;
    }

    _init_boards(ordered_players, features) {
        const boards = {};

        const num_players = ordered_players.length;
        const initialHammerIdx = 4 % num_players;
        const initialLOTLIdx = features['Lady of the Lake'] ? ordered_players.length - 1 : -1;
        // Create board for each player in game
        ordered_players.forEach(playerObjToGetID => {
            const { user_id, role, team } = playerObjToGetID;
            boards[user_id] = [];
            ordered_players.forEach((playerObj, idx) => {
                const player_view = {};

                player_view['user_name'] = playerObj.user_name;
                player_view['isSelected'] = false;
                player_view['isLeader'] = idx === 0; // Initially, first player at table is leader
                player_view['isHammer'] = idx === initialHammerIdx;
                player_view['isGivenExcalibur'] = false;
                player_view['isGivenLOTL'] = idx === initialLOTLIdx;
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
            player_view['isHammer'] = idx === initialHammerIdx;
            player_view['isGivenExcalibur'] = false;
            player_view['isGivenLOTL'] = idx === initialLOTLIdx;
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
     * TRANSCRIPT
     */

    _transcript_propose(ordered_players, leader_idx, players_selected, map_id_to_idx) {
        const leaderName = ordered_players[leader_idx].user_name;
        const teamString = players_selected
            .map(player_id => {
                const player_idx = map_id_to_idx[player_id];
                return ordered_players[player_idx].user_name;
            })
            .join(', ');
        const proposeString = `${leaderName} proposed a team of: ${teamString}`;
        this.TRANSCRIPT.push(proposeString);
    }

    _transcript_vote_round(user_idx, ordered_players) {
        const userName = ordered_players[user_idx].user_name;
        const voteRoundString = `${userName} has voted on the team`;
        this.TRANSCRIPT.push(voteRoundString);
    }

    _transcript_round_approved(mission, round) {
        const roundApprovedString = `Mission ${mission} Round ${round} was approved`;
        this.TRANSCRIPT.push(roundApprovedString);
    }

    _transcript_round_rejected(mission, round) {
        const roundRejectedString = `Mission ${mission} Round ${round} was rejected`;
        this.TRANSCRIPT.push(roundRejectedString);
    }

    _transcript_mission_passed(mission) {
        const missionPassedString = `Mission ${mission} passed`;
        this.TRANSCRIPT.push(missionPassedString);
    }

    _transcript_mission_failed(mission, num_fails) {
        const missionFailedString = `Mission ${mission} failed with ${num_fails} fail(s)`;
        this.TRANSCRIPT.push(missionFailedString);
    }

    _transcript_vote_mission(user_idx, ordered_players) {
        const userName = ordered_players[user_idx].user_name;
        const voteMissionString = `${userName} has voted on the mission`;
        this.TRANSCRIPT.push(voteMissionString);
    }

    _transcript_mission_passed_final(assassin_performer, map_id_to_idx, ordered_players) {
        const assassinPerformerRole = ordered_players[map_id_to_idx[assassin_performer]].user_name;
        const missionPassedFinalString = `3 missions have passed. ${assassinPerformerRole} is choosing a player to target...`;
        this.TRANSCRIPT.push(missionPassedFinalString);
    }

    _transcript_mission_failed_final() {
        const missionFailedFinalString = `SPY team wins: 3 missions have failed.`;
        this.TRANSCRIPT.push(missionFailedFinalString);
    }

    _transcript_leader(leader_idx, ordered_players) {
        const newLeaderName = ordered_players[leader_idx].user_name;
        const newLeaderString = `${newLeaderName} is the Leader`;
        this.TRANSCRIPT.push(newLeaderString);
        const newLeaderSelectTeamString = `${newLeaderName} is selecting a team...`;
        this.TRANSCRIPT.push(newLeaderSelectTeamString);
    }

    _transcript_result_byAutoLoss() {
        const resultByAutoLossString = 'SPY team wins: 5th team failed to gain approval.';
        this.TRANSCRIPT.push(resultByAutoLossString);
    }

    _transcript_result_assassin_spy(correct_assassin_target, map_id_to_idx, ordered_players) {
        const nameMerlinString = ordered_players[map_id_to_idx[correct_assassin_target]].user_name;
        const resultAssassinCorrectString = `SPY team wins: ${nameMerlinString} was Merlin`;
        this.TRANSCRIPT.push(resultAssassinCorrectString);
    }

    _transcript_result_assassin_res(correct_assassin_target, map_id_to_idx, ordered_players) {
        const nameMerlinString = ordered_players[map_id_to_idx[correct_assassin_target]].user_name;
        const resultAssassinIncorrectString = `RESISTANCE team wins: ${nameMerlinString} was Merlin`;
        this.TRANSCRIPT.push(resultAssassinIncorrectString);
    }

    _transcript_select_give_excalibur(ordered_players, leader_idx) {
        const leaderName = ordered_players[leader_idx].user_name;
        const selectGiveExcaliburString = `${leaderName} is choosing a player to give Excalibur...`;
        this.TRANSCRIPT.push(selectGiveExcaliburString);
    }

    _transcript_give_excalibur(player_given_excalibur, map_id_to_idx, ordered_players) {
        const nameGivenExcalibur = ordered_players[map_id_to_idx[player_given_excalibur]].user_name;
        const giveExcaliburString = `${nameGivenExcalibur} was given Excalibur`;
        this.TRANSCRIPT.push(giveExcaliburString);
    }

    _transcript_use_excalibur(player_given_excalibur, player_to_excalibur, map_id_to_idx, ordered_players) {
        const nameGivenExcalibur = ordered_players[map_id_to_idx[player_given_excalibur]].user_name;
        const nameToExcalibur = ordered_players[map_id_to_idx[player_to_excalibur]].user_name;
        const useExcaliburString = `${nameGivenExcalibur} used Excalibur on ${nameToExcalibur}`;
        this.TRANSCRIPT.push(useExcaliburString);
    }
    _transcript_skip_excalibur(player_given_excalibur, map_id_to_idx, ordered_players) {
        const nameGivenExcalibur = ordered_players[map_id_to_idx[player_given_excalibur]].user_name;
        const skipExcaliburString = `${nameGivenExcalibur} decided not to use Excalibur`;
        this.TRANSCRIPT.push(skipExcaliburString);
    }

    _transcript_decide_use_excalibur(player_given_excalibur, map_id_to_idx, ordered_players) {
        const nameGivenExcalibur = ordered_players[map_id_to_idx[player_given_excalibur]].user_name;
        const decideUseExcaliburString = `${nameGivenExcalibur} is deciding whether to use Excalibur...`;
        this.TRANSCRIPT.push(decideUseExcaliburString);
    }

    _transcript_use_lotl(player_given_lotl, player_to_lotl, map_id_to_idx, ordered_players) {
        const nameGivenLOTL = ordered_players[map_id_to_idx[player_given_lotl]].user_name;
        const nameToLOTL = ordered_players[map_id_to_idx[player_to_lotl]].user_name;
        const useLOTLString = `${nameGivenLOTL} has used Lady of the Lake on ${nameToLOTL}`;
        this.TRANSCRIPT.push(useLOTLString);
        const hasLOTLString = `${nameToLOTL} has Lady of the Lake`;
        this.TRANSCRIPT.push(hasLOTLString);
    }

    _transcript_decide_user_lotl(player_given_lotl, map_id_to_idx, ordered_players) {
        const nameGivenLOTL = ordered_players[map_id_to_idx[player_given_lotl]].user_name;
        const decideUseLOTLString = `${nameGivenLOTL} is choosing which player to use Lady of the Lake on...`;
        this.TRANSCRIPT.push(decideUseLOTLString);
    }

    /**
     *
     * @param {flags} metadata
     */
    get(metadata) {
        const { hasLocked, hasSetup, hasStarted, hasEnded, roomLeaderId } = metadata.get();
        return {
            isValid: true,
            // From metadata
            hasLocked,
            hasSetup,
            hasStarted,
            hasEnded,
            //
            roomLeaderId,
            // Single
            boards: this.boards,
            buttons: this.buttons,
            teams: this.teams,
            // Common
            PLAYERS_LIST: this.PLAYERS_LIST,
            MISSION_TRACKER: this.MISSION_TRACKER,
            ROUND_TRACKER: this.ROUND_TRACKER,
            VOTING_RECORD: this.VOTING_RECORD,
            TRANSCRIPT: this.TRANSCRIPT
        };
    }
}

module.exports = View;
