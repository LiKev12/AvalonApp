import React from 'react';
import classes from './AboutLeaderboard.module.css';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

const AboutLeaderboard = props => {
    const { leaderboardData } = props;
    const loadingRow = (
        <tr key="loading">
            <th colSpan="3" style={{ textAlign: 'center' }}>
                Stats are loading...
            </th>
        </tr>
    );
    const noDataRow = (
        <tr key="noData">
            <th colSpan="3" style={{ textAlign: 'center' }}>
                No stats to show. Please play more games to see.
            </th>
        </tr>
    );
    const placeholderRow = leaderboardData ? noDataRow : loadingRow;
    const tableBody =
        leaderboardData && leaderboardData.length > 0 ? getTableBodyRows(leaderboardData) : placeholderRow;

    return (
        <div>
            <div className={classes.LeaderboardBanner}>Leaderboard</div>
            <Table dark>
                <thead>
                    <tr>
                        <th className={classes.CellCenterText}>#</th>
                        <th className={classes.CellCenterText}>Username</th>
                        <th className={classes.CellCenterText}>Rating</th>
                    </tr>
                </thead>
                <tbody>{tableBody}</tbody>
            </Table>
        </div>
    );
};

AboutLeaderboard.propTypes = {
    /**
     * [{user_name, rating}]
     */
    leaderboardData: PropTypes.array
};

export default AboutLeaderboard;

const getTableBodyRows = leaderboardData => {
    const tableBodyRows = leaderboardData.map((singleRowData, idx) => {
        const { user_name, rating } = singleRowData;
        return (
            <tr key={idx + 1}>
                <td className={classes.CellCenterText}>{idx + 1}</td>
                <td className={classes.CellCenterText}>{user_name}</td>
                <td className={classes.CellCenterText}>{rating}</td>
            </tr>
        );
    });
    return tableBodyRows;
};
