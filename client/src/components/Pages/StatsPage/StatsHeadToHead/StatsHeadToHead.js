import React, { Component, Fragment } from 'react';
import classes from './StatsHeadToHead.module.css';
import { Alert, Button, Input, InputGroup, InputGroupAddon, Table } from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';

class StatsHeadToHead extends Component {
    state = {
        enteredNames: '',
        headToHead: [],
        isLoading: false,
        errorMsg: null
    };

    _get_user_id = () => {
        const user_id = this.props.auth && this.props.auth.user ? this.props.auth.user.id : null;
        return user_id;
    };

    _get_user_name = () => {
        const user_name = this.props.auth && this.props.auth.user ? this.props.auth.user.name : null;
        return user_name;
    };

    isValidQuery = (user_id, enteredNames) => {
        // 1) user_id must be valid
        if (!user_id) return false;

        // 2) Must have length > 0
        const isLengthValid = enteredNames.length > 0;
        if (!isLengthValid) return false;

        // 2) Must not contain own username
        const user_name = this._get_user_name();
        if (enteredNames.includes(user_name)) return false;

        // 3) Must contain no spaces
        const containsSpaces = enteredNames.includes(' ');
        return !containsSpaces;
    };

    handleEnterNames = event => {
        const { value: enteredNames } = event.target;
        this.setState({
            enteredNames
        });
    };

    handleSearch = () => {
        const { enteredNames } = this.state;
        const user_id = this._get_user_id();
        const isValidQuery = this.isValidQuery(user_id, enteredNames);

        if (isValidQuery) {
            this.setState({
                isLoading: true
            });
            axios.get(`/api/games/headtohead/${user_id}/${enteredNames}`).then(res => {
                this.setState({
                    isLoading: false,
                    errorMsg: null,
                    headToHead: res.data
                });
            });
        } else {
            this.setState({
                errorMsg: 'Invalid query. Please follow the example: player1,player2 ...'
            });
        }
    };

    render() {
        const { enteredNames, headToHead, isLoading, errorMsg } = this.state;
        const renderedErrorMessage = errorMsg ? (
            <Alert className="mt-3" color="danger">
                {errorMsg}
            </Alert>
        ) : null;
        const userNamesInput = (
            <InputGroup>
                <Input
                    type="text"
                    value={enteredNames}
                    placeholder="Enter a username or a list of usernames (separated by commas, no space)..."
                    onChange={this.handleEnterNames}
                />
                <InputGroupAddon addonType="append">
                    <Button color="success" onClick={this.handleSearch}>
                        Search
                    </Button>
                </InputGroupAddon>
            </InputGroup>
        );
        const loadingRow = (
            <tr key="loading">
                <th colSpan="6" className={classes.CellCenterText}>
                    Stats are loading...
                </th>
            </tr>
        );

        const noDataRow = (
            <tr key="noData">
                <th colSpan="6" className={classes.CellCenterText}>
                    No stats to show. Please play more games to see.
                </th>
            </tr>
        );

        const tableBodyRows = getTableBodyRows(headToHead);
        const renderedTableBodyRows = tableBodyRows.length > 0 ? tableBodyRows : noDataRow;
        const tableBody = isLoading ? loadingRow : renderedTableBodyRows;
        const headToHeadTable = (
            <div className={classes.TableContainer}>
                <Table dark>
                    <thead>
                        <tr key="header">
                            <th className={classes.CellCenterText}>#</th>
                            <th className={classes.CellCenterText}>Player</th>
                            <th className={classes.CellCenterText}>Team</th>
                            <th className={classes.CellCenterText}>Your Games Won</th>
                            <th className={classes.CellCenterText}>Total Games Played</th>
                            <th className={classes.CellCenterText}>Win %</th>
                        </tr>
                    </thead>
                    <tbody>{tableBody}</tbody>
                </Table>
            </div>
        );

        return (
            <div>
                {renderedErrorMessage}
                {userNamesInput}
                {headToHeadTable}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(StatsHeadToHead);

const getTableBodyRows = headToHead => {
    const tableBodyRows = headToHead.map((singlePlayerData, idx) => {
        const { Player, Same, Different } = singlePlayerData;

        const gamesWonSameTeam = Same['Your Games Won'];
        const totalGamesPlayedSameTeam = Same['Total Games Played'];
        const winPercentageSameTeam = getWinPercentage(gamesWonSameTeam, totalGamesPlayedSameTeam);
        const gamesWonDifferentTeam = Different['Your Games Won'];
        const totalGamesPlayedDifferentTeam = Different['Total Games Played'];
        const winPercentageDifferentTeam = getWinPercentage(gamesWonDifferentTeam, totalGamesPlayedDifferentTeam);
        return (
            <Fragment key={idx}>
                <tr key={idx * 2}>
                    <td className={classes.CellCenterText} style={{ verticalAlign: 'middle' }} rowSpan={2}>
                        {idx + 1}
                    </td>
                    <td className={classes.CellCenterText} style={{ verticalAlign: 'middle' }} rowSpan={2}>
                        {Player}
                    </td>
                    <td className={classes.CellCenterText}>Same</td>
                    <td className={classes.CellCenterText}>{gamesWonSameTeam}</td>
                    <td className={classes.CellCenterText}>{totalGamesPlayedSameTeam}</td>
                    <td className={classes.CellCenterText}>{winPercentageSameTeam}</td>
                </tr>
                <tr key={idx * 2 + 1}>
                    <td className={classes.CellCenterText}>Different</td>
                    <td className={classes.CellCenterText}>{gamesWonDifferentTeam}</td>
                    <td className={classes.CellCenterText}>{totalGamesPlayedDifferentTeam}</td>
                    <td className={classes.CellCenterText}>{winPercentageDifferentTeam}</td>
                </tr>
            </Fragment>
        );
    });

    return tableBodyRows;
};

const getWinPercentage = (games_won, games_played) => {
    // Round to 1 decimal place
    const win_percentage = parseInt(Math.round((games_won / games_played) * 1000)) / 10;
    return win_percentage;
};
