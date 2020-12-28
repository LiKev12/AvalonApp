import React from 'react';
import classes from './StatsIndividualHistory.module.css';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

const COLOR_BLUE = { color: '#7EC8E3' };
const COLOR_GREEN = { color: '#90ee90' };
const COLOR_RED = { color: '#ff726f' };

const StatsIndividualHistory = props => {
    const { history } = props;

    const loadingRow = (
        <tr key="loading">
            <th colSpan="8" style={{ textAlign: 'center' }}>
                Stats are loading...
            </th>
        </tr>
    );

    const noDataRow = (
        <tr key="noData">
            <th colSpan="8" style={{ textAlign: 'center' }}>
                No stats to show. Please play more games to see.
            </th>
        </tr>
    );

    const placeholderRow = history ? noDataRow : loadingRow;

    const tableBody = history && history.length > 0 ? getTableBodyRows(history) : placeholderRow;

    const historyTable = (
        <div className={classes.TableContainer}>
            <Table dark>
                <thead>
                    <tr>
                        <th className={classes.CellCenterText}>#</th>
                        <th className={classes.CellCenterText}>Date</th>
                        <th className={classes.CellCenterText}>Setting</th>
                        <th className={classes.CellCenterText}>Type</th>
                        <th className={classes.CellCenterText}>Num Players</th>
                        <th className={classes.CellCenterText}>Team</th>
                        <th className={classes.CellCenterText}>Role</th>
                        <th className={classes.CellCenterText}>Result</th>
                    </tr>
                </thead>
                <tbody>{tableBody}</tbody>
            </Table>
        </div>
    );
    return <div>{historyTable}</div>;
};

StatsIndividualHistory.propTypes = {
    /**
     * history: [{date, is_completed, is_public, is_rated, num_players, team, role, result}]
     */
    history: PropTypes.array
};

export default StatsIndividualHistory;

const getTableBodyRows = history => {
    const tableBodyRows = history.map((singleRowData, idx) => {
        const { date, is_public, is_rated, num_players, role, team, result } = singleRowData;
        const dateText = getDateFormatted(date);
        const settingText = is_public ? 'public' : 'private';
        const typeText = is_rated ? 'rated' : 'unrated';
        const numPlayersText = num_players;
        const teamText = team;
        const roleText = role;
        const resultText = result.winningTeam === team ? 'WIN' : 'LOSS';
        const colorTeamAndRole = team === 'RESISTANCE' ? COLOR_BLUE : COLOR_RED;
        const colorResult = resultText === 'WIN' ? COLOR_GREEN : COLOR_RED;
        return (
            <tr key={idx + 1}>
                <td className={classes.CellCenterText}>{idx + 1}</td>
                <td className={classes.CellCenterText}>{dateText}</td>
                <td className={classes.CellCenterText}>{settingText}</td>
                <td className={classes.CellCenterText}>{typeText}</td>
                <td className={classes.CellCenterText}>{numPlayersText}</td>
                <td className={classes.CellCenterText} style={colorTeamAndRole}>
                    {teamText}
                </td>
                <td className={classes.CellCenterText} style={colorTeamAndRole}>
                    {roleText}
                </td>
                <td className={classes.CellCenterText} style={colorResult}>
                    {resultText}
                </td>
            </tr>
        );
    });

    return tableBodyRows;
};

const getDateFormatted = dateTime => {
    const date_yyyy_mm_dd = new Date(dateTime).toISOString().split('T')[0];
    return date_yyyy_mm_dd;
};
