import React, { Component } from 'react';
import axios from 'axios';
import classes from './StatsPage.module.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

import AccessDeniedPage from '../AccessDeniedPage/AccessDeniedPage';
import LoadingSpinner from '../Loading/LoadingSpinner';
import StatsIndividualByRoles from './StatsIndividualByRoles/StatsIndividualByRoles';
import StatsIndividualHistory from './StatsIndividualHistory/StatsIndividualHistory';
import StatsIndividualOverall from './StatsIndividualOverall/StatsIndividualOverall';
import StatsHeadToHead from './StatsHeadToHead/StatsHeadToHead';

export class StatsPage extends Component {
    state = {
        isAuthenticated: false,
        isLoadingRating: true,
        isLoadingStats: true,
        rating: null,
        history: null,
        overall: null,
        byRoles: null
    };

    componentDidMount() {
        setTimeout(() => {
            // Get individual stats data and set state accordingly
            const user_id = this._get_user_id();
            if (!!user_id) {
                axios.get(`/api/ratings/${user_id}`).then(res => {
                    const rating = res.data;
                    this.setState({
                        isLoadingRating: false,
                        rating
                    });
                });
                axios.get(`/api/games/${user_id}`).then(res => {
                    /**
                     * [{date, is_completed, is_public, is_rated, num_players, team, role, result}]
                     */
                    const data = res.data;
                    const history = _getHistoryData(data);
                    const overall = _getOverallData(data);
                    const byRoles = _getByRolesData(data);
                    this.setState({
                        isAuthenticated: true,
                        isLoadingStats: false,
                        history,
                        overall,
                        byRoles
                    });
                });
            } else {
                this.setState({
                    isLoadingRating: false,
                    isLoadingStats: false
                });
            }
        }, 1000);
    }

    _get_user_id = () => {
        const user_id = this.props.auth && this.props.auth.user ? this.props.auth.user.id : null;
        return user_id;
    };

    render() {
        const { isAuthenticated, isLoadingRating, isLoadingStats, rating, history, overall, byRoles } = this.state;

        if (isLoadingRating || isLoadingStats) {
            return <LoadingSpinner />;
        }

        if (!isAuthenticated) {
            return <AccessDeniedPage />;
        }

        return (
            <div>
                <Container>
                    <div className={classes.RatingBanner}>Rating: {rating ? rating : 1500}</div>
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
                    <StatsIndividualByRoles byRoles={byRoles} />
                    <hr />
                    <h3>Head to Head</h3>
                    <hr />
                    <StatsHeadToHead />
                </Container>
            </div>
        );
    }
}

StatsPage.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(StatsPage);

const _getHistoryData = data => {
    // Get all (previously just top 5, but now table is scrollable)
    return data;
};

const _getOverallData = data => {
    // Aggregate based on team
    if (data.length === 0) return [];
    let RESISTANCE_GAMES_WON = 0;
    let RESISTANCE_GAMES_PLAYED = 0;
    let SPY_GAMES_WON = 0;
    let SPY_GAMES_PLAYED = 0;

    data.forEach(singleGameData => {
        const {
            team,
            result: { winningTeam }
        } = singleGameData;
        const resultText = team === winningTeam ? 'WIN' : 'LOSS';
        if (team === 'RESISTANCE') {
            if (resultText === 'WIN') {
                RESISTANCE_GAMES_WON++;
            }
            RESISTANCE_GAMES_PLAYED++;
        } else if (team === 'SPY') {
            if (resultText === 'WIN') {
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
        const {
            role,
            team,
            result: { winningTeam }
        } = singleGameData;
        const resultText = team === winningTeam ? 'WIN' : 'LOSS';
        if (!setOfUniqueRoles.has(role)) {
            setOfUniqueRoles.add(role);
            uniqueRolesAndTeams.push({ role, team });
            mapRoleToGamesWon.set(role, resultText === 'WIN' ? 1 : 0);
            mapRoleToGamesPlayed.set(role, 1);
        } else {
            if (resultText === 'WIN') {
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
