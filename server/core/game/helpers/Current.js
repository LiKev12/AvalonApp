class Current {
    constructor(num_players) {
        this.num_players = num_players;
        this.leader_idx = 0;
        this.hammer_idx = 4 % num_players; // when is hammer updated? after a mission
        this.mission = 1;
        this.round = 1;
        this.players_selected = [];
        this.players_voted_round = [];
        this.players_voted_mission = [];
        this.player_to_assassinate = null;
        this.player_given_excalibur = null;
        this.player_to_excalibur = null;
        this.player_given_lotl = null;
        this.all_players_given_lotl = [];
        this.selectionContext = 'mission'; // mission | assassinate | give_excalibur | use_excalibur | use_lotl | null
    }

    /**
     * MISSION
     */

    incrementAfterMission() {
        this.leader_idx++;
        if (this.leader_idx === this.num_players) {
            this.leader_idx = 0;
        }
        this.hammer_idx = (this.leader_idx + 4) % this.num_players;
        this.round = 1;
        this.mission++;
        this.players_selected = [];
        this.players_voted_round = [];
        this.players_voted_mission = [];
        this.player_to_excalibur = null;
        this.player_given_excalibur = null;
    }

    isMissionPassed(board) {
        const num_fails_required = board[this.mission].num_fails_required;
        const num_fails = this.players_voted_mission.filter(voteObj => !voteObj.vote).length;
        const isMissionPassed = num_fails < num_fails_required;
        return {
            isMissionPassed,
            num_fails
        };
    }

    hasEveryPlayerVotedMission(board) {
        const num_spots_on_mission = board[this.mission].num_spots_on_mission;
        const numPlayersVotedSoFar = this.players_voted_mission.length;
        return num_spots_on_mission === numPlayersVotedSoFar;
    }
    hasPlayerVotedMission(user_id) {
        return this.players_voted_mission.some(voteObj => voteObj.user_id === user_id);
    }

    addPlayerVotedMission(user_id, isPassed) {
        this.players_voted_mission.push({ user_id, vote: isPassed });
    }

    /**
     * ROUND
     */

    // Only after round is NOT approved
    incrementAfterRound() {
        this.leader_idx++;
        if (this.leader_idx === this.num_players) {
            this.leader_idx = 0;
        }
        this.round++;
        this.players_selected = [];
        this.players_voted_round = [];
        this.player_to_excalibur = null;
        this.player_given_excalibur = null;
    }

    addPlayerVotedRound(user_id, isApproved) {
        this.players_voted_round.push({ user_id, vote: isApproved });
    }

    hasPlayerVotedRound(user_id) {
        return this.players_voted_round.some(voteObj => voteObj.user_id === user_id);
    }

    hasEveryPlayerVotedRound() {
        return this.players_voted_round.length === this.num_players;
    }

    isRoundApproved() {
        const votesApprove = this.players_voted_round.filter(voteObj => voteObj.vote).length;
        const votesReject = this.players_voted_round.filter(voteObj => !voteObj.vote).length;
        const isApproved = votesApprove > votesReject;
        return isApproved;
    }

    /**
     * SELECT
     */

    addPlayerSelected(target_user_id) {
        this.players_selected.push(target_user_id);
    }

    removePlayerSelected(target_user_id) {
        this.players_selected = this.players_selected.filter(user_id => user_id !== target_user_id);
    }

    isPlayerSelected(target_user_id) {
        const isSelected = this.players_selected.some(user_id => user_id === target_user_id);
        return isSelected;
    }

    /**
     * ASSASSINATE
     */

    setPlayerToAssassinate(target_user_id) {
        this.player_to_assassinate = target_user_id;
    }

    /**
     * EXCALIBUR
     */

    setPlayerGivenExcalibur(target_user_id) {
        this.player_given_excalibur = target_user_id;
    }

    setPlayerToExcalibur(target_user_id) {
        // Must allow unselect because player can skip excalibur
        if (this.player_to_excalibur === target_user_id) {
            this.player_to_excalibur = null;
        } else {
            this.player_to_excalibur = target_user_id;
        }
    }

    isPlayerGivenExcalibur(target_user_id) {
        const isGivenExcalibur = this.player_given_excalibur === target_user_id;
        return isGivenExcalibur;
    }

    excaliburMissionVote(target_user_id) {
        this.players_voted_mission.forEach(voteObj => {
            const { user_id, vote } = voteObj;
            if (user_id === target_user_id) {
                voteObj.vote = !vote;
            }
        });
    }

    getTargetPlayerMissionVote(target_user_id) {
        let targetPlayerMissionVote = false;
        this.players_voted_mission.forEach(voteObj => {
            const { user_id, vote } = voteObj;
            if (user_id === target_user_id) {
                targetPlayerMissionVote = vote;
            }
        });
        return targetPlayerMissionVote;
    }

    /**
     * LOTL
     */

    setPlayerToLOTL(target_user_id) {
        this.player_to_lotl = target_user_id;
    }

    setPlayerGivenLOTL(target_user_id) {
        this.player_given_lotl = target_user_id;
    }

    updatePlayersGivenLOTL(target_user_id) {
        this.all_players_given_lotl.push(target_user_id);
    }

    hasPlayerHadLOTLBefore(target_user_id) {
        return this.all_players_given_lotl.includes(target_user_id);
    }

    /**
     * OTHER
     */

    setSelectionContext(newSelectionContext) {
        this.selectionContext = newSelectionContext;
    }

    get() {
        return this;
    }
}

module.exports = Current;
