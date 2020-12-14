import React from 'react';
import { Table } from 'reactstrap';

import classes from './GameVotingRecord.module.css';

const CHECKMARK = '\u2713';
const APPROVE_COLOR = 'rgb(171, 255, 183)';
const REJECT_COLOR = 'rgb(255, 186, 184)';
const centerStyle = { textAlign: 'center' };
const rightStyle = { textAlign: 'right' };

const gameVotingRecord = props => {
    const { voting_record } = props;
    const { players, record } = voting_record;

    const { missionHeader, roundHeader } = getTableHeaders();
    const tableBody = getTableBody(players, record);

    const gameVotingRecordTable = (
        <Table dark bordered>
            <thead>
                <tr>{missionHeader}</tr>
                <tr>{roundHeader}</tr>
            </thead>
            <tbody>{tableBody}</tbody>
        </Table>
    );
    return gameVotingRecordTable;
};

const getTableHeaders = () => {
    const order = [1, 2, 3, 4, 5];

    const missionHeader = [<th style={centerStyle}>Mission</th>];
    const roundHeader = [<th style={centerStyle}>Round</th>];

    order.forEach(missionNumber => {
        missionHeader.push(
            <th colspan={5} style={centerStyle}>
                {missionNumber}
            </th>
        );
        order.forEach(roundNumber => {
            roundHeader.push(<th style={centerStyle}>{roundNumber}</th>);
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
        tableRow.push(<th style={centerStyle}>{user_name}</th>);
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
                    tableRow.push(<th style={cellStyle}>{cellContents}</th>);
                } else {
                    // Push a blank tile
                    tableRow.push(<th />);
                }
            });
        });
        tableBody.push(<tr>{tableRow}</tr>);
    });
    return tableBody;
};

export default gameVotingRecord;
