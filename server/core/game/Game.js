const Metadata = require('./helpers/Metadata');
const Current = require('./helpers/Current');
const History = require('./helpers/History');
const View = require('./helpers/View');
const ResourceBoards = require('./resources/Boards');

class Game {
    constructor(room_id, is_public) {
        console.log('new game object!');
        this.room_id = room_id;
        this.is_public = is_public;
        this.creation_time = Date.now();
        //
        this.metadata = new Metadata();
        this.view = new View();
        this.history = null;
        this.current = null;
    }

    checkValidEnter() {
        // Valid if game hasn't started or if started, player is already in game
        // If not valid, list as spectator on side
    }

    /**
     * data: {user_id, user_name}
     * @param {*} data
     */
    handleEnter(user_id, user_name) {
        console.log('handleEnter');
        this.metadata.handleEnter(user_id, user_name, this.view);
    }

    handleLeave(user_id) {
        console.log('handleLeave');
        this.metadata.handleLeave(user_id, this.view);
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
        this.view.handleSetup(ordered_players, summary);
    }

    handleStart() {
        this.metadata.handleStart();
    }

    handleSelect(user_id, target_idx) {
        const { leader_idx, selectionContext } = this.current.get();
        if (selectionContext === 'mission') {
            const { map_id_to_idx, map_idx_to_id } = this.metadata.get();
            const userIsLeader = map_id_to_idx[user_id] === leader_idx;
            // Sanity check
            if (userIsLeader) {
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
            // Sanity check
            const { assassin_performer } = this.metadata.get();
            const isUserAssassinPerformer = user_id === assassin_performer;
            if (isUserAssassinPerformer) {
                const { map_idx_to_id } = this.metadata.get();
                const target_user_id = map_idx_to_id[target_idx];
                this.current.setPlayerToAssassinate(target_user_id);
                const { player_to_assassinate } = this.metadata.get();
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
            const userIsLeader = map_id_to_idx[user_id] === leader_idx;
            // Sanity check
            if (userIsLeader) {
                // Can only select users on mission
                const target_user_id = map_idx_to_id[target_idx];
                const isTargetPlayerOnTeam = this.current.isPlayerSelected(target_user_id);
                if (isTargetPlayerOnTeam) {
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
            console.log('[handleSelect] selectionContext', selectionContext);
            const { player_given_excalibur } = this.current.get();
            const isUserGivenExcalibur = player_given_excalibur === user_id;
            // Sanity check
            if (isUserGivenExcalibur) {
                // Can only select users on mission
                const target_user_id = map_idx_to_id[target_idx];
                const isTargetPlayerOnTeam = this.current.isPlayerSelected(target_user_id);
                if (isTargetPlayerOnTeam) {
                    this.current.setPlayerToExcalibur(target_user_id);
                    const { player_to_excalibur } = this.current.get();
                    const isAnyPlayerTargetedByExcalibur = !!player_to_excalibur;
                    this.view.togglePlayerToExcalibur(target_idx, isAnyPlayerTargetedByExcalibur);
                    if (isAnyPlayerTargetedByExcalibur) {
                        this.view.setButton(user_id, 'use_excalibur');
                    } else {
                        this.view.unsetButton(user_id);
                    }
                }
            }
        }
    }

    handlePropose(user_id) {
        const { leader_idx, mission, round, players_selected } = this.current.get();
        const { map_id_to_idx, ordered_ids } = this.metadata.get();
        const userIsLeader = map_id_to_idx[user_id] === leader_idx;
        // Sanity check
        if (userIsLeader) {
            this.history.updateRecordWithTeam(mission, round, user_id, players_selected);
            this.view.unsetButton(user_id);
            this.view.setButtonForMultiplePlayers(ordered_ids, 'round');
            this.view.setAllPlayersToStillVoting();
            const { features } = this.metadata.get();
            if (features['Excalibur']) {
                this.current.setSelectionContext('give_excalibur');
            } else {
                this.current.setSelectionContext(null);
            }
        }
    }

    handleRound(user_id, isApprove) {
        // Voting can cause game to end
        const userHasAlreadyVoted = user_id && this.current.hasPlayerVotedRound(user_id);
        // Sanity check
        if (!userHasAlreadyVoted) {
            console.log('[handleRound] in');
            this.view.unsetButton(user_id);
            const { map_id_to_idx } = this.metadata.get();
            const user_idx = map_id_to_idx[user_id];
            this.view.unsetPlayerStillVoting(user_idx);
            this.current.addPlayerVotedRound(user_id, isApprove);
            const hasEveryPlayerVotedRound = this.current.hasEveryPlayerVotedRound();
            if (hasEveryPlayerVotedRound) {
                // Lots of game logic
                const isRoundApproved = this.current.isRoundApproved();
                if (isRoundApproved) {
                    console.log('[handleVoteRound] isRoundApproved', isRoundApproved);

                    // history -
                    const { mission, round, players_voted_round } = this.current.get();
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
                    console.log('[handleVoteRound] isRoundApproved', isRoundApproved);
                    // Update history with round votes
                    const { mission, round, players_voted_round } = this.current.get();
                    this.history.updateRecordWithVotesAfterRound(mission, round, players_voted_round, isRoundApproved);

                    const isGameAutoEnd = round === 5;
                    if (isGameAutoEnd) {
                        // handle game auto end

                        this._game_handle_game_end('SPY', 'byAutoLoss');
                    } else {
                        // Update current
                        this.current.incrementAfterRound();
                        // Update view
                        this._view_update_VOTING_RECORD();
                        this._view_update_ROUND_TRACKER();
                        this._view_update_boards();
                    }
                }
            }
        }
    }

    handleMission(user_id, isPass) {
        const userHasAlreadyVoted = this.current.hasPlayerVotedMission(user_id);

        if (!userHasAlreadyVoted) {
            console.log('[handleMission] in');
            this.view.unsetButton(user_id);

            const { map_id_to_idx } = this.metadata.get();
            const user_idx = map_id_to_idx[user_id];
            this.view.unsetPlayerStillVoting(user_idx);
            this.current.addPlayerVotedMission(user_id, isPass);
            const { board } = this.metadata.get();
            const hasEveryPlayerVotedMission = this.current.hasEveryPlayerVotedMission(board);
            if (hasEveryPlayerVotedMission) {
                console.log('[handleMission] hasEveryPlayerVotedMission', hasEveryPlayerVotedMission);
                const { features } = this.metadata.get();

                if (features['Excalibur']) {
                    this.current.setSelectionContext('use_excalibur');
                } else {
                    this._game_handle_mission_finished();
                }
            }
        }
    }

    handleAssassinate(user_id) {
        const { assassin_performer } = this.metadata.get();
        const isUserAssassinPerformer = user_id === assassin_performer;
        // Sanity Check
        if (isUserAssassinPerformer) {
            const { correct_assassin_target } = this.metadata.get();
            const { player_to_assassinate } = this.current.get();
            const isCorrectAssassinTargetChosen = player_to_assassinate === correct_assassin_target;
            if (isCorrectAssassinTargetChosen) {
                // SPY wins
                this._game_handle_game_end('SPY', 'byAssassin');
            } else {
                // RESISTANCE wins
                this._game_handle_game_end('RESISTANCE', 'byMissions');
            }
        }
    }

    handleGiveExcalibur(user_id) {
        const { map_id_to_idx } = this.metadata.get();
        const userIsLeader = map_id_to_idx[user_id] === leader_idx;
        // Sanity check
        if (userIsLeader) {
            console.log('[handleGiveExcalibur]');
            this.view.unsetButton(user_id);
            this.current.setSelectionContext(null);

            const { player_given_excalibur } = this.current.get();
            this.history.updateRecordWithGivenExcalibur(player_given_excalibur);
        }
    }

    handleUseExcalibur(user_id, isExcaliburUsed) {
        console.log('[handleUseExcalibur]');
        const { player_given_excalibur } = this.current.get();
        const isUserGivenExcalibur = user_id === player_given_excalibur;
        // Sanity check
        if (isUserGivenExcalibur) {
            this.view.unsetButton(user_id);
            this.current.setSelectionContext('mission');
            if (isExcaliburUsed) {
                console.log('[handleUseExcalibur] isExcaliburUsed', isExcaliburUsed);
                // Flip vote
                const { player_to_excalibur } = this.current.get();
                this.current.excaliburMissionVote(player_to_excalibur);
            }
            this._game_handle_mission_finished();
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
        const { leader_idx } = this.current.get();
        this.view.update_boards(leader_idx);
    }

    _game_handle_mission_finished() {
        // history - record
        const { board } = this.metadata.get();
        const isMissionPassed = this.current.isMissionPassed(board);
        const { mission, round, players_voted_mission, player_to_excalibur } = this.current.get();
        this.history.updateRecordWithVotesAfterMission(
            mission,
            round,
            players_voted_mission,
            isMissionPassed,
            player_to_excalibur
        );
        this.history.updateSummary(mission, isMissionPassed);
        this._view_update_VOTING_RECORD();
        this._view_update_MISSION_TRACKER();
        if (isMissionPassed) {
            console.log('[handleMission] isMissionPassed', isMissionPassed);
            // Check if game is over
            const hasResistanceWonMissions = this.history.hasResistanceWonMissions();
            if (hasResistanceWonMissions) {
                // Game over
                console.log('[handleMission] hasResistanceWonMissions', hasResistanceWonMissions);
                this.current.setSelectionContext('assassinate');
            } else {
                // Game continues
                console.log('[handleMission] hasResistanceWonMissions', hasResistanceWonMissions);
                this.current.incrementAfterMission();
                this._view_update_ROUND_TRACKER();
                this._view_update_boards();
            }
        } else {
            console.log('[handleMission] isMissionPassed', isMissionPassed);
            // Check if game is over (if so, this time is really over since SPY wins)
            const hasSpyWonMissions = this.history.hasSpyWonMissions();
            if (hasSpyWonMissions) {
                // Game actually over
                console.log('[handleMission] hasSpyWonMissions', hasSpyWonMissions);
                this._game_handle_game_end('SPY', 'byMissions');
            } else {
                console.log('[handleMission] hasSpyWonMissions', hasSpyWonMissions);
                this.current.incrementAfterMission();
                this._view_update_ROUND_TRACKER();
                this._view_update_boards();
            }
        }
    }

    _game_handle_game_end(winningTeam, winningFactor) {
        this.metadata.handleEnd();
        this.history.updateResult(winningTeam, winningFactor);
        this.current.setSelectionContext(null);
        this.view.reveal_boards();
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
