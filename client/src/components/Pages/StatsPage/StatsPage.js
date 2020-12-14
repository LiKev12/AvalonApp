import React, { Component } from 'react';
import axios from 'axios';

import { Button, Container } from 'reactstrap';
import StatsIndividualHistory from './StatsIndividualHistory/StatsIndividualHistory';
import StatsIndividualOverall from './StatsIndividualOverall/StatsIndividualOverall';
import StatsIndividualByRoles from './StatsIndividualByRoles/StatsIndividualByRoles';

export class StatsPage extends Component {
    state = {
        history: null,
        overall: null,
        byRoles: null
    };

    componentDidMount() {
        // Get individual stats data and set state accordingly
        axios.get(`/api/mock_games/id1`).then(res => {
            /**
             * [{date, team, role, num_players, result}]
             */
            const data = res.data;
            const history = _getHistoryData(data);
            const overall = _getOverallData(data);
            const byRoles = _getByRolesData(data);
            this.setState({
                history,
                overall,
                byRoles
            });
        });
    }

    render() {
        const { history, overall, byRoles } = this.state;
        return (
            <div>
                <Container>
                    <hr />
                    <h3>History</h3>
                    <hr />
                    <StatsIndividualHistory history={history} />
                    <hr />
                    <h3>Overall</h3>
                    <hr />
                    <StatsIndividualOverall overall={overall} />
                    <hr />
                    <h3>By Role</h3>
                    <hr />
                    <StatsIndividualByRoles byRole={byRoles} />
                </Container>
            </div>
        );
    }
}

export default StatsPage;

const _getHistoryData = data => {
    // Get top 5
    const arrMaxLen = Math.min(data.length, 5);
    return data.slice(0, arrMaxLen);
};

const _getOverallData = data => {
    // Aggregate based on team
    if (data.length === 0) return [];
    let RESISTANCE_GAMES_WON = 0;
    let RESISTANCE_GAMES_PLAYED = 0;
    let SPY_GAMES_WON = 0;
    let SPY_GAMES_PLAYED = 0;

    data.forEach(singleGameData => {
        const { team, result } = singleGameData;
        if (team === 'RESISTANCE') {
            if (result === 'WIN') {
                RESISTANCE_GAMES_WON++;
            }
            RESISTANCE_GAMES_PLAYED++;
        } else if (team === 'SPY') {
            if (result === 'WIN') {
                SPY_GAMES_WON++;
            }
            SPY_GAMES_PLAYED++;
        }
    });
    const TOTAL_GAMES_WON = RESISTANCE_GAMES_WON + SPY_GAMES_WON;
    const TOTAL_GAMES_PLAYED = RESISTANCE_GAMES_PLAYED + SPY_GAMES_PLAYED;
    return [
        { team: 'TOTAL', games_won: TOTAL_GAMES_WON, games_played: TOTAL_GAMES_PLAYED },
        { team: 'RESISTANCE', games_won: RESISTANCE_GAMES_WON, games_played: RESISTANCE_GAMES_PLAYED },
        { team: 'SPY', games_won: SPY_GAMES_WON, games_played: SPY_GAMES_PLAYED }
    ];
};

const _getByRolesData = data => {
    const uniqueRolesAndTeams = [];
    const setOfUniqueRoles = new Set();
    const mapRoleToGamesWon = new Map();
    const mapRoleToGamesPlayed = new Map();

    data.forEach(singleGameData => {
        const { role, team, result } = singleGameData;
        if (!setOfUniqueRoles.has(role)) {
            setOfUniqueRoles.add(role);
            uniqueRolesAndTeams.push({ role, team });
            mapRoleToGamesWon.set(role, result === 'WIN' ? 1 : 0);
            mapRoleToGamesPlayed.set(role, 1);
        } else {
            if (result === 'WIN') {
                // Increment games_won
                const games_won = mapRoleToGamesWon.get(role);
                mapRoleToGamesWon.set(role, games_won + 1);
            }
            // Increment games_played
            const games_played = mapRoleToGamesPlayed.get(role);
            mapRoleToGamesPlayed.set(role, games_played + 1);
        }
    });

    // Create data from helpers
    const byRolesData = uniqueRolesAndTeams.map(roleAndTeam => {
        const { role, team } = roleAndTeam;
        const games_won = mapRoleToGamesWon.get(role);
        const games_played = mapRoleToGamesPlayed.get(role);
        return {
            role,
            team,
            games_won,
            games_played
        };
    });

    // Sort final data
    const sortByTeamThenRole = (a, b) => {
        if (a.team === b.team) {
            return a.role > b.role ? 1 : -1;
        }
        return a.team > b.team ? 1 : -1;
    };
    byRolesData.sort(sortByTeamThenRole);
    return byRolesData;
};
