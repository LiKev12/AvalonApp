import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

const COLOR_BLUE = { color: '#7EC8E3' };
const COLOR_GREEN = { color: '#90ee90' };
const COLOR_RED = { color: '#ff726f' };

const StatsIndividualHistory = props => {
    const { history } = props;

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

    const placeholderRow = history ? noDataRow : loadingRow;

    const tableBody = history && history.length > 0 ? getTableBodyRows(history) : placeholderRow;

    const historyTable = (
        <Table dark>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Num Players</th>
                    <th>Team</th>
                    <th>Role</th>
                    <th>Result</th>
                </tr>
            </thead>
            <tbody>{tableBody}</tbody>
        </Table>
    );
    return <div>{historyTable}</div>;
};

StatsIndividualHistory.propTypes = {
    /**
     * history: [{time, num_players, role, team, result}]
     */
    history: PropTypes.array
};

export default StatsIndividualHistory;

const getTableBodyRows = history => {
    const tableBodyRows = history.map((singleRowData, idx) => {
        const { time, num_players, role, team, result } = singleRowData;
        const date = getDate(time);
        const colorTeamAndRole = team === 'RESISTANCE' ? COLOR_BLUE : COLOR_RED;
        const colorResult = result === 'WIN' ? COLOR_GREEN : COLOR_RED;
        return (
            <tr key={idx + 1}>
                <td>{idx + 1}</td>
                <td>{date}</td>
                <td>{num_players}</td>
                <td style={colorTeamAndRole}>{team}</td>
                <td style={colorTeamAndRole}>{role}</td>
                <td style={colorResult}>{result}</td>
            </tr>
        );
    });

    return tableBodyRows;
};

const getDate = dateTime => {
    const date = new Date(dateTime).toISOString().split('T')[0];
    return date;
};
