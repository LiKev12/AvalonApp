import React from 'react';
import classes from './StatsIndividualByRoles.module.css';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

const COLOR_BLUE = { color: '#7EC8E3' };
const COLOR_RED = { color: '#ff726f' };

const StatsIndividualByRoles = props => {
    const { byRoles } = props;
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
    const placeholderRow = byRoles ? noDataRow : loadingRow;
    const tableBody = byRoles && byRoles.length > 0 ? getTableBodyRows(byRoles) : placeholderRow;

    const byRolesTable = (
        <div className={classes.TableContainer}>
            <Table dark>
                <thead>
                    <tr>
                        <th className={classes.CellCenterText}>#</th>
                        <th className={classes.CellCenterText}>Team</th>
                        <th className={classes.CellCenterText}>Role</th>
                        <th className={classes.CellCenterText}>Games Won</th>
                        <th className={classes.CellCenterText}>Games Played</th>
                        <th className={classes.CellCenterText}>Win %</th>
                    </tr>
                </thead>
                <tbody>{tableBody}</tbody>
            </Table>
        </div>
    );
    return <div>{byRolesTable}</div>;
};

StatsIndividualByRoles.propTypes = {
    byRoles: PropTypes.array
};

export default StatsIndividualByRoles;

const map_team_to_color = {
    RESISTANCE: COLOR_BLUE,
    SPY: COLOR_RED
};

const getTableBodyRows = byRoles => {
    const tableBodyRows = byRoles.map((singleRowData, idx) => {
        const { team, role, games_won, games_played } = singleRowData;
        const win_percentage = getWinPercentage(games_won, games_played);
        const colorTeamAndRole = map_team_to_color[team];
        return (
            <tr key={idx + 1}>
                <td className={classes.CellCenterText}>{idx + 1}</td>
                <td className={classes.CellCenterText} style={colorTeamAndRole}>
                    {team}
                </td>
                <td className={classes.CellCenterText} style={colorTeamAndRole}>
                    {role}
                </td>
                <td className={classes.CellCenterText}>{games_won}</td>
                <td className={classes.CellCenterText}>{games_played}</td>
                <td className={classes.CellCenterText}>{win_percentage}</td>
            </tr>
        );
    });

    return tableBodyRows;
};

const getWinPercentage = (games_won, games_played) => {
    // Round to 1 decimal place
    if (games_played === 0) return 0;
    const win_percentage = parseInt(Math.round((games_won / games_played) * 1000)) / 10;
    return win_percentage;
};
