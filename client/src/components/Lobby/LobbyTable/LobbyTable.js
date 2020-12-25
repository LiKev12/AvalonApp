import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Table } from 'reactstrap';
import classes from './LobbyTable.module.css';

const LobbyTable = props => {
    let table_body = (
        <tr key="single">
            <th colSpan="7" className={classes.LobbyTableCell}>
                No games in progress. Try making one!
            </th>
        </tr>
    );

    if (props.lobby_data.length > 0) {
        table_body = props.lobby_data.map((room_data, idx) => {
            const { is_public, is_rated, hasLocked, hasEnded } = room_data;
            const isPublicSetting = is_public ? 'public' : 'private';
            const isRated = is_rated ? 'rated' : 'unrated';
            const gameStatus = getGameStatus(hasLocked, hasEnded);
            const tableButton = getTableButton(gameStatus);
            return (
                <tr key={idx}>
                    <th className={classes.LobbyTableCell} scope="row">
                        {idx + 1}
                    </th>
                    <td className={classes.LobbyTableCell}>{room_data['room_id']}</td>
                    <td className={classes.LobbyTableCell}>{isPublicSetting}</td>
                    <td className={classes.LobbyTableCell}>{isRated}</td>
                    <td className={classes.LobbyTableCell}>{room_data['num_players']} / 12</td>
                    <td className={classes.LobbyTableCell}>{gameStatus}</td>
                    <td className={classes.LobbyTableCell}>
                        <Link to={`game/${room_data['room_id']}`}>{tableButton}</Link>
                    </td>
                </tr>
            );
        });
    }
    return (
        <div>
            <Table dark>
                <thead>
                    <tr>
                        <th className={classes.LobbyTableCell}>#</th>
                        <th className={classes.LobbyTableCell}>Game ID</th>
                        <th className={classes.LobbyTableCell}>Setting</th>
                        <th className={classes.LobbyTableCell}>Rating</th>
                        <th className={classes.LobbyTableCell}>Capacity</th>
                        <th className={classes.LobbyTableCell}>Status</th>
                        <th className={classes.LobbyTableCell}>Action</th>
                    </tr>
                </thead>
                <tbody>{table_body}</tbody>
            </Table>
        </div>
    );
};

LobbyTable.propTypes = {
    /**
     * [room_id, is_public, is_rated, creation_time, hasStarted, hasEnded, hasLocked, num_players]
     */
    lobby_data: PropTypes.array
};
export default LobbyTable;

const getGameStatus = (hasLocked, hasEnded) => {
    if (!hasLocked) {
        return 'waiting';
    }
    if (!hasEnded) {
        return 'in progress';
    }
    return 'finished';
};

const getTableButton = gameStatus => {
    if (gameStatus === 'waiting') {
        return (
            <Button color="success" style={{ width: '100px' }}>
                Join
            </Button>
        );
    } else if (gameStatus === 'in progress') {
        return (
            <Button color="info" style={{ width: '100px' }}>
                Spectate
            </Button>
        );
    } else if (gameStatus === 'finished') {
        return (
            <Button color="info" style={{ width: '100px' }}>
                Spectate
            </Button>
        );
    }
};
