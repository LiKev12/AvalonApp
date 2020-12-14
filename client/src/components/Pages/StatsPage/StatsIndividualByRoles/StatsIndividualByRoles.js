import React from 'react';
import { Table } from 'reactstrap';

const COLOR_BLUE = { color: '#7EC8E3' };
const COLOR_RED = { color: '#ff726f' };

const StatsIndividualByRole = props => {
    const { byRole } = props;
    const loadingRow = (
        <tr key="loading">
            <th colSpan="6" style={{ textAlign: 'center' }}>
                Stats are loading...
            </th>
        </tr>
    );
    const noDataRow = (
        <tr key="noData">
            <th colSpan="6" style={{ textAlign: 'center' }}>
                No stats to show. Please play more games to see.
            </th>
        </tr>
    );
    const placeholderRow = byRole ? noDataRow : loadingRow;
    const tableBody = byRole && byRole.length > 0 ? getTableBodyRows(byRole) : placeholderRow;

    const byRoleTable = (
        <Table dark>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Team</th>
                    <th>Role</th>
                    <th>Games Won</th>
                    <th>Games Played</th>
                    <th>Win %</th>
                </tr>
            </thead>
            <tbody>{tableBody}</tbody>
        </Table>
    );
    return <div>{byRoleTable}</div>;
};

export default StatsIndividualByRole;

const map_team_to_color = {
    RESISTANCE: COLOR_BLUE,
    SPY: COLOR_RED
};

const getTableBodyRows = byRole => {
    const tableBodyRows = byRole.map((singleRowData, idx) => {
        const { team, role, games_won, games_played } = singleRowData;
        const win_percentage = getWinPercentage(games_won, games_played);
        const colorTeamAndRole = map_team_to_color[team];
        return (
            <tr key={idx + 1}>
                <td>{idx + 1}</td>
                <td style={colorTeamAndRole}>{team}</td>
                <td style={colorTeamAndRole}>{role}</td>
                <td>{games_won}</td>
                <td>{games_played}</td>
                <td>{win_percentage}</td>
            </tr>
        );
    });

    return tableBodyRows;
};

const getWinPercentage = (games_won, games_played) => {
    // Round to 1 decimal place
    const win_percentage = parseInt(Math.round((games_won / games_played) * 1000)) / 10;
    return win_percentage;
};
