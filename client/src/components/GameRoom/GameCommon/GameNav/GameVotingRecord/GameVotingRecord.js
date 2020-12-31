import React from 'react';
import classes from './GameVotingRecord.module.css';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

const CHECKMARK = '\u2713';
const APPROVE_COLOR = 'rgb(171, 255, 183)';
const REJECT_COLOR = 'rgb(255, 186, 184)';
const centerStyle = { textAlign: 'center' };

const GameVotingRecord = props => {
    const { voting_record } = props;
    const { players, record } = voting_record;

    const { missionHeader, roundHeader } = getTableHeaders();
    const tableBody = getTableBody(players, record);

    const gameVotingRecordTable = (
        <div className={classes.TableContainer}>
            <Table dark bordered>
                <thead>
                    <tr key="mission_header">{missionHeader}</tr>
                    <tr key="round_header">{roundHeader}</tr>
                </thead>
                <tbody>{tableBody}</tbody>
            </Table>
        </div>
    );
    return gameVotingRecordTable;
};

GameVotingRecord.propTypes = {
    /**
     * voting_record: {players: [user_name], record: {1:1:{leader, team: [true], votesRound: [false]}}}
     */
    voting_record: PropTypes.object
};

export default GameVotingRecord;

const getTableHeaders = () => {
    const order = [1, 2, 3, 4, 5];
    const missionHeader = [
        <th key="mission_header_prefix" style={centerStyle}>
            Mission
        </th>
    ];
    const roundHeader = [
        <th key="round_header_prefix" style={centerStyle}>
            Round
        </th>
    ];
    order.forEach(missionNumber => {
        missionHeader.push(
            <th key={`M${missionNumber}`} colSpan={5} style={centerStyle}>
                {missionNumber}
            </th>
        );
        order.forEach(roundNumber => {
            roundHeader.push(
                <th key={`M${missionNumber}R${roundNumber}`} style={centerStyle}>
                    {roundNumber}
                </th>
            );
        });
    });
    return {
        missionHeader,
        roundHeader
    };
};

const getTableBody = (players, record) => {
    // row by row
    const order = [1, 2, 3, 4, 5];
    const tableBody = [];
    players.forEach((user_name, user_idx) => {
        const tableRow = [];
        tableRow.push(
            <th key={user_idx} style={centerStyle}>
                {user_name}
            </th>
        );
        order.forEach(missionNumber => {
            order.forEach(roundNumber => {
                const isRoundCompleted = !!record[missionNumber][roundNumber];
                if (isRoundCompleted) {
                    // Push a normal game obj
                    const currRound = record[missionNumber][roundNumber];
                    const cellBackgroundColor = currRound.votesRound[user_idx] ? APPROVE_COLOR : REJECT_COLOR; // votesRound
                    const cellBorder = currRound.leader === user_idx ? '3px solid black' : '1px solid'; // leader
                    const cellContents = currRound.team[user_idx] ? CHECKMARK : ''; // team
                    const cellStyle = {
                        backgroundColor: cellBackgroundColor,
                        border: cellBorder,
                        color: 'black',
                        textAlign: 'center'
                    };
                    tableRow.push(
                        <th key={`M${missionNumber}R${roundNumber}`} style={cellStyle}>
                            {cellContents}
                        </th>
                    );
                } else {
                    // Push a blank tile
                    tableRow.push(<th key={`M${missionNumber}R${roundNumber}`} />);
                }
            });
        });
        tableBody.push(<tr key={user_idx}>{tableRow}</tr>);
    });
    return tableBody;
};
