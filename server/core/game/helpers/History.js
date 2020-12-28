class History {
    constructor(board) {
        this.record = {
            1: { 1: null, 2: null, 3: null, 4: null, 5: null },
            2: { 1: null, 2: null, 3: null, 4: null, 5: null },
            3: { 1: null, 2: null, 3: null, 4: null, 5: null },
            4: { 1: null, 2: null, 3: null, 4: null, 5: null },
            5: { 1: null, 2: null, 3: null, 4: null, 5: null }
        };

        this.summary = this._init_summary(board);
        this.result = {
            winningTeam: null, // CHANGE BACK LATER AFTER TESTING
            winningFactor: null // byAutoLoss, byAssassin, byMissions
        };
    }

    updateResult(winningTeam, winningFactor) {
        this.result = {
            winningTeam,
            winningFactor
        };
    }

    hasResistanceWonMissions() {
        let numMissionsPassed = 0;
        Object.keys(this.summary).forEach(mission => {
            if (this.summary[mission].isPassed === true) {
                numMissionsPassed++;
            }
        });
        return numMissionsPassed === 3;
    }

    hasSpyWonMissions() {
        let numMissionsFailed = 0;
        Object.keys(this.summary).forEach(mission => {
            if (this.summary[mission].isPassed === false) {
                numMissionsFailed++;
            }
        });
        return numMissionsFailed === 3;
    }

    updateSummary(mission, isPassed) {
        this.summary[mission]['isPassed'] = isPassed;
    }

    updateRecordWithVotesAfterMission(mission, round, players_voted_mission, isPassed) {
        this.record[mission][round]['votes_mission'] = [...players_voted_mission];
        this.record[mission][round]['isPassed'] = isPassed;
        const isExcaliburUsed = !!this.record[mission][round]['player_to_excalibur'];
        this.record[mission][round]['isExcaliburUsed'] = isExcaliburUsed;
    }

    updateRecordWithVotesAfterRound(mission, round, players_voted_round, isApproved) {
        this.record[mission][round]['votes_round'] = [...players_voted_round];
        this.record[mission][round]['isApproved'] = isApproved;
        this.record[mission][round]['votes_mission'] = [];
        this.record[mission][round]['isPassed'] = null;
    }

    updateRecordWithPlayerGivenExcalibur(mission, round, player_given_excalibur) {
        this.record[mission][round]['player_given_excalibur'] = player_given_excalibur;
    }

    updateRecordWithPlayerToExcalibur(mission, round, player_to_excalibur) {
        this.record[mission][round]['player_to_excalibur'] = player_to_excalibur;
    }

    updateRecordWithLOTL(mission, round, player_given_lotl, player_to_lotl) {
        this.record[mission][round]['player_given_lotl'] = player_given_lotl;
        this.record[mission][round]['player_to_lotl'] = player_to_lotl;
    }

    updateRecordWithTeam(mission, round, user_id, players_selected) {
        this.record[mission][round] = {};
        this.record[mission][round]['leader_id'] = user_id;
        // Make a deep copy of players_selected array
        this.record[mission][round]['team'] = [...players_selected];
    }

    _init_summary(board) {
        // Creating a clone of board but
        const summary = {};
        Object.keys(board).forEach(missionNumber => {
            summary[missionNumber] = {};
            summary[missionNumber].isPassed = null;
            summary[missionNumber].num_spots_on_mission = board[missionNumber].num_spots_on_mission;
            summary[missionNumber].num_fails_required = board[missionNumber].num_fails_required;
        });
        return summary;
    }

    get() {
        return this;
    }
}

module.exports = History;
