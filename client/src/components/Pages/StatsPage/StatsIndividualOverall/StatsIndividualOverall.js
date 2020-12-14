import React from 'react';
import { Table } from 'reactstrap';

const COLOR_BLUE = { color: '#7EC8E3' };
const COLOR_GREEN = { color: '#90ee90' };
const COLOR_RED = { color: '#ff726f' };

const StatsIndividualOverall = props => {
    const { overall } = props;
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
    const placeholderRow = overall ? noDataRow : loadingRow;
    const tableBody = overall && overall.length > 0 ? getTableBodyRows(overall) : placeholderRow;

    const overallTable = (
        <Table dark>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Team</th>
                    <th>Games Won</th>
                    <th>Games Played</th>
                    <th>Win %</th>
                </tr>
            </thead>
            <tbody>{tableBody}</tbody>
        </Table>
    );
    return <div>{overallTable}</div>;
};

export default StatsIndividualOverall;

const map_team_to_color = {
    TOTAL: COLOR_GREEN,
    RESISTANCE: COLOR_BLUE,
    SPY: COLOR_RED
};

const getTableBodyRows = overall => {
    const tableBodyRows = overall.map((singleRowData, idx) => {
        const { team, games_won, games_played } = singleRowData;
        const win_percentage = getWinPercentage(games_won, games_played);

        const colorTeam = map_team_to_color[team];
        return (
            <tr key={idx + 1}>
                <td>{idx + 1}</td>
                <td style={colorTeam}>{team}</td>
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
    if (games_played === 0) return 0;
    const win_percentage = parseInt(Math.round((games_won / games_played) * 1000)) / 10;
    return win_percentage;
};
