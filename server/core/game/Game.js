const Metadata = require('./helpers/Metadata');
const Current = require('./helpers/Current');
const History = require('./helpers/History');
const View = require('./helpers/View');
const ResourceBoards = require('./resources/Boards');

class Game {
    constructor(room_id, is_public, is_rated) {
        this.room_id = room_id;
        this.is_public = is_public;
        this.is_rated = is_rated;
        this.creation_time = Date.now();
        //
        this.metadata = new Metadata();
        this.view = new View();
        this.history = null;
        this.current = null;
    }

    /**
     * data: {user_id, user_name}
     * @param {*} data
     */
    handleEnter(user_id, user_name) {
        this.metadata.handleEnter(user_id, user_name, this.view);
        const { players } = this.metadata.get();
        this.view.updatePlayersList(players);
    }

    handleLeave(user_id) {
        this.metadata.handleLeave(user_id, this.view);
        const { players } = this.metadata.get();
        this.view.updatePlayersList(players);
    }

    handleLock() {
        this.metadata.handleLock();
    }

    /**
     * Initializes the following:
     * - metadata: {hasSetup, features, board, ordered_players}
     * - current: new
     * - history: new
     * - view: {boards, buttons, teams | MISSION_TRACKER, ROUND_TRACKER}
     * @param {*} setup
     */
    handleSetup(setup) {
        const { num_players, roles, features } = setup;
        const board = ResourceBoards[num_players];
        // inits:
        this.metadata.handleSetup(num_players, roles, features, board);
        this.current = new Current(num_players);
        this.history = new History(board);
        const { ordered_players } = this.metadata.get();
        const { summary } = this.history.get();
        this.view.handleSetup(ordered_players, summary, roles, features);
        if (features['Lady of the Lake']) {
            const initialPlayerIdGivenLOTL = ordered_players[ordered_players.length - 1].user_id;
            this.current.setPlayerGivenLOTL(initialPlayerIdGivenLOTL);
            this.current.updatePlayersGivenLOTL(initialPlayerIdGivenLOTL);
        }
    }

    handleStart() {
        this.metadata.handleStart();
    }

    handleSelect(user_id, target_idx) {
        const { leader_idx, selectionContext } = this.current.get();
        if (selectionContext === 'mission') {
            const { map_id_to_idx, map_idx_to_id } = this.metadata.get();
            const isUserLeader = map_id_to_idx[user_id] === leader_idx;
            // Sanity check
            if (isUserLeader) {
                const target_user_id = map_idx_to_id[target_idx];
                const isTargetPlayerAlreadySelected = this.current.isPlayerSelected(target_user_id);
                if (isTargetPlayerAlreadySelected) {
                    // Remove
                    this.current.removePlayerSelected(target_user_id);
                    this.view.removePlayerSelected(target_idx);
                } else {
                    // Add
                    this.current.addPlayerSelected(target_user_id);
                    this.view.addPlayerSelected(target_idx);
                }
                const { players_selected, mission } = this.current.get();
                const numSpotsOnMission = this.metadata.getNumSpotsOnMission(mission);
                const correctNumberOfSelections = players_selected.length === numSpotsOnMission;
                if (correctNumberOfSelections) {
                    // Show propose button
                    this.view.setButton(user_id, 'propose');
                } else {
                    // Hide propose button
                    this.view.unsetButton(user_id);
                }
            }
        } else if (selectionContext === 'assassinate') {
            const { assassin_performer } = this.metadata.get();
            const isUserAssassinPerformer = user_id === assassin_performer;
            // Sanity check
            if (isUserAssassinPerformer) {
                const { map_idx_to_id } = this.metadata.get();
                const target_user_id = map_idx_to_id[target_idx];
                this.current.setPlayerToAssassinate(target_user_id);
                const { player_to_assassinate } = this.current.get();
                const isAnyPlayerChosenToAssassinate = !!player_to_assassinate;
                this.view.togglePlayerToAssassinate(target_idx, isAnyPlayerChosenToAssassinate);
                if (isAnyPlayerChosenToAssassinate) {
                    this.view.setButton(user_id, 'assassinate');
                } else {
                    this.view.unsetButton(user_id);
                }
            }
        } else if (selectionContext === 'give_excalibur') {
            const { map_id_to_idx, map_idx_to_id } = this.metadata.get();
            const isUserLeader = map_id_to_idx[user_id] === leader_idx;
            // Sanity check
            if (isUserLeader) {
                // Can only select users on mission
                const target_user_id = map_idx_to_id[target_idx];
                const isTargetPlayerOnTeam = this.current.isPlayerSelected(target_user_id);
                const isSelf = target_user_id === user_id;
                if (isTargetPlayerOnTeam && !isSelf) {
                    this.current.setPlayerGivenExcalibur(target_user_id);
                    const { player_given_excalibur } = this.current.get();
                    const isAnyPlayerGivenExcalibur = !!player_given_excalibur;
                    this.view.togglePlayerGivenExcalibur(target_idx, isAnyPlayerGivenExcalibur);
                    if (isAnyPlayerGivenExcalibur) {
                        this.view.setButton(user_id, 'give_excalibur');
                    } else {
                        this.view.unsetButton(user_id);
                    }
                }
            }
        } else if (selectionContext === 'use_excalibur') {
            const { map_idx_to_id } = this.metadata.get();
            const { player_given_excalibur } = this.current.get();
            const isUserGivenExcalibur = player_given_excalibur === user_id;
            // Sanity check
            if (isUserGivenExcalibur) {
                // Can only select users on mission
                const target_user_id = map_idx_to_id[target_idx];
                const isTargetPlayerOnTeam = this.current.isPlayerSelected(target_user_id);
                const isSelf = target_user_id === user_id;
                if (isTargetPlayerOnTeam && !isSelf) {
                    this.current.setPlayerToExcalibur(target_user_id);
                    const { player_to_excalibur } = this.current.get();
                    const isAnyPlayerTargetedByExcalibur = !!player_to_excalibur;
                    this.view.togglePlayerToExcalibur(target_idx, isAnyPlayerTargetedByExcalibur);
                    if (isAnyPlayerTargetedByExcalibur) {
                        this.view.setButton(user_id, 'use_excalibur');
                    } else {
                        this.view.setButton(user_id, 'skip_excalibur');
                    }
                }
            }
        } else if (selectionContext === 'use_lotl') {
            const { map_idx_to_id } = this.metadata.get();
            const { player_given_lotl } = this.current.get();
            const isUserGivenLOTL = user_id === player_given_lotl;
            // Sanity check
            if (isUserGivenLOTL) {
                const target_user_id = map_idx_to_id[target_idx];
                const isSelf = target_user_id === user_id;
                const isGivenLOTLBefore = this.current.hasPlayerHadLOTLBefore(target_user_id);
                if (!isSelf && !isGivenLOTLBefore) {
                    this.current.setPlayerToLOTL(target_user_id);
                    const { player_to_lotl } = this.current.get();
                    const isAnyPlayerTargetedByLOTL = !!player_to_lotl;
                    this.view.togglePlayerToLOTL(target_idx, isAnyPlayerTargetedByLOTL);
                    if (isAnyPlayerTargetedByLOTL) {
                        this.view.setButton(user_id, 'use_lotl');
                    } else {
                        this.view.unsetButton(user_id);
                    }
                }
            }
        }
    }

    handlePropose(user_id) {
        const { leader_idx, mission, round, players_selected } = this.current.get();
        const { map_id_to_idx, ordered_ids, ordered_players, board } = this.metadata.get();
        const isUserLeader = map_id_to_idx[user_id] === leader_idx;
        const isEnoughPlayersSelected = players_selected.length === board[mission]['num_spots_on_mission'];
        // Sanity check
        if (isUserLeader && isEnoughPlayersSelected) {
            this.history.updateRecordWithTeam(mission, round, user_id, players_selected);
            this.view.unsetButton(user_id);
            this.view._transcript_propose(ordered_players, leader_idx, players_selected, map_id_to_idx);
            const { features } = this.metadata.get();
            if (features['Excalibur']) {
                this.view._transcript_select_give_excalibur(ordered_players, leader_idx);
                this.current.setSelectionContext('give_excalibur');
            } else {
                this.view.setButtonForMultiplePlayers(ordered_ids, 'round');
                this.view.setAllPlayersToStillVoting();
                this.current.setSelectionContext(null);
            }
        }
    }

    handleRound(user_id, isApprove) {
        // Voting can cause game to end
        const userHasAlreadyVoted = user_id && this.current.hasPlayerVotedRound(user_id);
        // Sanity check
        if (!userHasAlreadyVoted) {
            this.view.unsetButton(user_id);
            const { map_id_to_idx, ordered_players } = this.metadata.get();
            const user_idx = map_id_to_idx[user_id];
            this.view._transcript_vote_round(user_idx, ordered_players);
            this.view.unsetPlayerStillVoting(user_idx);
            this.current.addPlayerVotedRound(user_id, isApprove);
            const hasEveryPlayerVotedRound = this.current.hasEveryPlayerVotedRound();
            if (hasEveryPlayerVotedRound) {
                // Lots of game logic
                const isRoundApproved = this.current.isRoundApproved();
                if (isRoundApproved) {
                    // history -
                    const { mission, round, players_voted_round } = this.current.get();
                    this.view._transcript_round_approved(mission, round);
                    this.history.updateRecordWithVotesAfterRound(mission, round, players_voted_round, isRoundApproved);
                    // Update view - VOTING_RECORD
                    this._view_update_VOTING_RECORD();
                    // Update view - buttons
                    const { players_selected } = this.current.get();
                    this.view.setButtonForMultiplePlayers(players_selected, 'mission');
                    const { map_id_to_idx } = this.metadata.get();
                    const arr_target_idx = players_selected.map(player_id => map_id_to_idx[player_id]);
                    this.view.setSomePlayersToStillVoting(arr_target_idx);
                } else {
                    // Update history with round votes
                    const { mission, round, players_voted_round } = this.current.get();
                    this.view._transcript_round_rejected(mission, round);
                    this.history.updateRecordWithVotesAfterRound(mission, round, players_voted_round, isRoundApproved);

                    const isGameAutoEnd = round === 5;
                    if (isGameAutoEnd) {
                        // handle game auto end
                        this.view._transcript_result_byAutoLoss();
                        this._view_update_VOTING_RECORD();
                        this._game_handle_game_end('SPY', 'byAutoLoss');
                    } else {
                        // Update current
                        this.current.incrementAfterRound();
                        this.current.setSelectionContext('mission');
                        // Update view
                        this._view_update_VOTING_RECORD();
                        this._view_update_ROUND_TRACKER();
                        this._view_update_boards();
                        this._view_transcript_leader();
                    }
                }
            }
        }
    }

    handleMission(user_id, isPass) {
        const userHasAlreadyVoted = this.current.hasPlayerVotedMission(user_id);

        if (!userHasAlreadyVoted) {
            const { map_id_to_idx, ordered_players } = this.metadata.get();
            const user_idx = map_id_to_idx[user_id];
            this.view._transcript_vote_mission(user_idx, ordered_players);
            this.view.unsetButton(user_id);
            this.view.unsetPlayerStillVoting(user_idx);
            this.current.addPlayerVotedMission(user_id, isPass);
            const { board } = this.metadata.get();
            const hasEveryPlayerVotedMission = this.current.hasEveryPlayerVotedMission(board);
            if (hasEveryPlayerVotedMission) {
                const { features } = this.metadata.get();
                if (features['Excalibur']) {
                    const { player_given_excalibur } = this.current.get();
                    this.view._transcript_decide_use_excalibur(player_given_excalibur, map_id_to_idx, ordered_players);
                    this.view.setButton(player_given_excalibur, 'skip_excalibur');
                    this.current.setSelectionContext('use_excalibur');
                } else {
                    this._game_handle_mission_finished();
                }
            }
        }
    }

    handleAssassinate(user_id) {
        const { assassin_performer, correct_assassin_target, map_id_to_idx, ordered_players } = this.metadata.get();
        const isUserAssassinPerformer = user_id === assassin_performer;
        // Sanity Check
        if (isUserAssassinPerformer) {
            this.view.unsetButton(user_id);
            const { player_to_assassinate } = this.current.get();
            const isCorrectAssassinTargetChosen = player_to_assassinate === correct_assassin_target;
            if (isCorrectAssassinTargetChosen) {
                // SPY wins
                this.view._transcript_result_assassin_spy(correct_assassin_target, map_id_to_idx, ordered_players);
                this._game_handle_game_end('SPY', 'byAssassin');
            } else {
                // RESISTANCE wins
                this.view._transcript_result_assassin_res(correct_assassin_target, map_id_to_idx, ordered_players);
                this._game_handle_game_end('RESISTANCE', 'byMissions');
            }
        }
    }

    handleGiveExcalibur(user_id) {
        const { map_id_to_idx, ordered_ids, ordered_players } = this.metadata.get();
        const { mission, round, leader_idx, player_given_excalibur } = this.current.get();
        const userIsLeader = map_id_to_idx[user_id] === leader_idx;
        const isAnyPlayerGivenExcalibur = !!player_given_excalibur;
        // Sanity check
        if (userIsLeader && isAnyPlayerGivenExcalibur) {
            this.view.unsetButton(user_id);
            this.view._transcript_give_excalibur(player_given_excalibur, map_id_to_idx, ordered_players);
            this.view.setButtonForMultiplePlayers(ordered_ids, 'round');
            this.view.setAllPlayersToStillVoting();
            this.current.setSelectionContext(null);
            this.history.updateRecordWithPlayerGivenExcalibur(mission, round, player_given_excalibur);
        }
    }

    handleUseExcalibur(user_id, isExcaliburUsed) {
        const { mission, round, player_given_excalibur, player_to_excalibur } = this.current.get();
        const { map_id_to_idx, ordered_players } = this.metadata.get();
        const isUserGivenExcalibur = user_id === player_given_excalibur;
        // Sanity check
        if (isUserGivenExcalibur) {
            this.view.unsetButton(user_id);
            const isAnyPlayerTargetedByExcalibur = !!player_to_excalibur;
            if (isExcaliburUsed) {
                if (isAnyPlayerTargetedByExcalibur) {
                    this.view._transcript_use_excalibur(
                        player_given_excalibur,
                        player_to_excalibur,
                        map_id_to_idx,
                        ordered_players
                    );
                    // Flip vote
                    this.current.excaliburMissionVote(player_to_excalibur);
                    this.history.updateRecordWithPlayerToExcalibur(mission, round, player_to_excalibur);
                    const targetPlayerNewVote = this.current.getTargetPlayerMissionVote(player_to_excalibur);
                    if (targetPlayerNewVote) {
                        // voted PASS
                        this.view.setButton(user_id, 'confirm_excalibur_pass');
                    } else {
                        // voted FAIL
                        this.view.setButton(user_id, 'confirm_excalibur_fail');
                    }
                }
            } else {
                // skip use excalibur
                if (!isAnyPlayerTargetedByExcalibur) {
                    this.view._transcript_skip_excalibur(player_given_excalibur, map_id_to_idx, ordered_players);
                    this.history.updateRecordWithPlayerToExcalibur(mission, round, player_to_excalibur);
                    this.view.togglePlayerGivenExcalibur(map_id_to_idx[player_given_excalibur], false);
                    this.current.setPlayerGivenExcalibur(null);
                    this._game_handle_mission_finished();
                }
            }
        }
    }

    handleConfirmExcalibur(user_id) {
        const { player_given_excalibur, player_to_excalibur } = this.current.get();
        const isUserGivenExcalibur = user_id === player_given_excalibur;
        // Sanity check
        if (isUserGivenExcalibur) {
            this.view.unsetButton(user_id);
            const { map_id_to_idx } = this.metadata.get();
            this.view.togglePlayerGivenExcalibur(map_id_to_idx[player_given_excalibur], false);
            this.current.setPlayerGivenExcalibur(null);
            this.view.togglePlayerToExcalibur(map_id_to_idx[player_to_excalibur], false);
            this.current.setPlayerToExcalibur(null);

            this._game_handle_mission_finished();
        }
    }

    handleUseLOTL(user_id) {
        // Sanity Check
        const { ordered_players, map_id_to_idx } = this.metadata.get();
        const { player_given_lotl, player_to_lotl } = this.current.get();
        const isUserGivenLOTL = user_id === player_given_lotl;
        if (isUserGivenLOTL) {
            this.view.unsetButton(user_id);
            const isTargetPlayerResistance = ordered_players[map_id_to_idx[player_to_lotl]].team === 'RESISTANCE';
            if (isTargetPlayerResistance) {
                this.view.setButton(user_id, 'confirm_lotl_resistance');
            } else {
                this.view.setButton(user_id, 'confirm_lotl_spy');
            }
        }
    }

    handleConfirmLOTL(user_id) {
        // Sanity check
        const { mission, round, player_given_lotl, player_to_lotl } = this.current.get();
        const isUserGivenLOTL = user_id === player_given_lotl;
        if (isUserGivenLOTL) {
            this.view.unsetButton(user_id);
            const { map_id_to_idx, ordered_players } = this.metadata.get();
            this.view._transcript_use_lotl(player_given_lotl, player_to_lotl, map_id_to_idx, ordered_players);
            this.history.updateRecordWithLOTL(mission, round, player_given_lotl, player_to_lotl);

            // Remove the lady token (given) from the original player, give to target_player
            const isLastMissionIncoming = mission === 4;
            if (isLastMissionIncoming) {
                this.view.togglePlayerGivenLOTL(map_id_to_idx[player_given_lotl], false);
                this.view.togglePlayerToLOTL(map_id_to_idx[player_to_lotl], false);
                this.current.setPlayerGivenLOTL(null);
                this.current.setPlayerToLOTL(null);
            } else {
                this.view.togglePlayerGivenLOTL(map_id_to_idx[player_given_lotl], false);
                this.view.togglePlayerGivenLOTL(map_id_to_idx[player_to_lotl], true);
                this.view.togglePlayerToLOTL(map_id_to_idx[player_to_lotl], false);
                this.current.setPlayerGivenLOTL(player_to_lotl);
                this.current.updatePlayersGivenLOTL(player_to_lotl);
                this.current.setPlayerToLOTL(null);
            }

            // increment after mission
            this._game_update_after_mission();
        }
    }

    _view_update_ROUND_TRACKER() {
        const { round } = this.current.get();
        this.view.update_ROUND_TRACKER(round);
    }

    _view_update_MISSION_TRACKER() {
        const { summary } = this.history.get();
        this.view.update_MISSION_TRACKER(summary);
    }

    _view_update_VOTING_RECORD() {
        const { record } = this.history.get();
        const { map_id_to_idx } = this.metadata.get();
        const { num_players } = this.current.get();
        this.view.update_VOTING_RECORD(record, map_id_to_idx, num_players);
    }

    _view_update_boards() {
        const { leader_idx, hammer_idx } = this.current.get();
        this.view.update_boards(leader_idx, hammer_idx);
    }

    _view_transcript_leader() {
        const { leader_idx } = this.current.get();
        const { ordered_players } = this.metadata.get();
        this.view._transcript_leader(leader_idx, ordered_players);
    }

    _game_update_after_mission() {
        this.current.setSelectionContext('mission');
        this.current.incrementAfterMission();
        this._view_update_ROUND_TRACKER();
        this._view_update_boards();
        this._view_transcript_leader();
    }

    _game_handle_mission_finished() {
        // history - record
        const { board, assassin_performer, map_id_to_idx, ordered_players } = this.metadata.get();
        const { isMissionPassed, num_fails } = this.current.isMissionPassed(board);
        const { mission, round, players_voted_mission, player_given_lotl } = this.current.get();
        this.history.updateRecordWithVotesAfterMission(mission, round, players_voted_mission, isMissionPassed);
        this.history.updateSummary(mission, isMissionPassed);
        this._view_update_VOTING_RECORD();
        this._view_update_MISSION_TRACKER();
        if (isMissionPassed) {
            this.view._transcript_mission_passed(mission);
            // Check if game is over
            const hasResistanceWonMissions = this.history.hasResistanceWonMissions();
            if (hasResistanceWonMissions) {
                // Game over (not quite though)
                this.view._transcript_mission_passed_final(assassin_performer, map_id_to_idx, ordered_players);
                this.current.setSelectionContext('assassinate');
            } else {
                // Game continues
                const { features } = this.metadata.get();
                if (features['Lady of the Lake'] && [2, 3, 4].includes(mission)) {
                    this.view._transcript_decide_user_lotl(player_given_lotl, map_id_to_idx, ordered_players);
                    this.current.setSelectionContext('use_lotl');
                } else {
                    this._game_update_after_mission();
                }
            }
        } else {
            this.view._transcript_mission_failed(mission, num_fails);
            // Check if game is over (if so, this time is really over since SPY wins)
            const hasSpyWonMissions = this.history.hasSpyWonMissions();
            if (hasSpyWonMissions) {
                // Game actually over
                this.view._transcript_mission_failed_final();
                this._game_handle_game_end('SPY', 'byMissions');
            } else {
                const { features } = this.metadata.get();
                if (features['Lady of the Lake'] && [2, 3, 4].includes(mission)) {
                    this.view._transcript_decide_user_lotl(player_given_lotl, map_id_to_idx, ordered_players);
                    this.current.setSelectionContext('use_lotl');
                } else {
                    this._game_update_after_mission();
                }
            }
        }
    }

    _game_handle_game_end(winningTeam, winningFactor) {
        this.metadata.handleEnd();
        this.history.updateResult(winningTeam, winningFactor);
        this.current.setSelectionContext(null);
        const { ordered_players } = this.metadata.get();
        this.view.reveal_boards(ordered_players);
    }

    hasGameEnded() {
        const { hasEnded } = this.metadata.get();
        return hasEnded;
    }

    getLobbyData() {
        const metadata = this.metadata.get();
        const { hasStarted, hasEnded, hasLocked, players } = metadata;
        const { room_id, is_public, creation_time } = this;

        const num_players = players.length;
        return {
            room_id,
            is_public,
            creation_time,
            hasStarted,
            hasEnded,
            hasLocked,
            num_players
        };
    }

    getViewData() {
        return this.view.get(this.metadata);
    }
}

module.exports = Game;

/**
 * Note: The following are safety checks, aka they shouldn't be needed but may deter the game
 * from getting into a bad state due to slow connection on the client:
 * {isEnoughPlayersSelected, isAnyPlayerGivenExcalibur, isAnyPlayerTargetedByExcalibur}
 *
 */
