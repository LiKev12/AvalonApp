import React from 'react';
import classes from './LobbyTable.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Table } from 'reactstrap';

import LobbyPrivateRoomModal from './LobbyPrivateRoomModal/LobbyPrivateRoomModal';

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
            const { room_id, is_public, is_rated, num_players, hasLocked, hasEnded } = room_data;
            const isPublicSetting = is_public ? 'public' : 'private';
            const isRated = is_rated ? 'rated' : 'unrated';
            const gameStatus = getGameStatus(hasLocked, hasEnded);
            const tableButton = getTableButton(is_public, gameStatus, room_id);
            return (
                <tr key={idx}>
                    <th className={classes.LobbyTableCell} scope="row">
                        {idx + 1}
                    </th>
                    <td className={classes.LobbyTableCell}>{room_id}</td>
                    <td className={classes.LobbyTableCell}>{isPublicSetting}</td>
                    <td className={classes.LobbyTableCell}>{isRated}</td>
                    <td className={classes.LobbyTableCell}>{num_players} / 12</td>
                    <td className={classes.LobbyTableCell}>{gameStatus}</td>
                    <td className={classes.LobbyTableCell}>{tableButton}</td>
                </tr>
            );
        });
    }
    return (
        <div className={classes.TableContainer}>
            <Table dark>
                <thead>
                    <tr>
                        <th className={classes.LobbyTableCell}>#</th>
                        <th className={classes.LobbyTableCell}>Game ID</th>
                        <th className={classes.LobbyTableCell}>Setting</th>
                        <th className={classes.LobbyTableCell}>Type</th>
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

const getTableButton = (is_public, gameStatus, room_id) => {
    if (is_public) {
        // PUBLIC
        if (gameStatus === 'waiting') {
            return (
                <Link to={`game/${room_id}`}>
                    <Button color="success">Join</Button>
                </Link>
            );
        } else if (gameStatus === 'in progress' || gameStatus === 'finished') {
            return (
                <Link to={`game/${room_id}`}>
                    <Button color="info">Spectate</Button>
                </Link>
            );
        }
    } else {
        // PRIVATE
        if (gameStatus === 'waiting') {
            return <LobbyPrivateRoomModal buttonName="Join" buttonColor="success" room_id={room_id} />;
        } else if (gameStatus === 'in progress' || gameStatus === 'finished') {
            return <LobbyPrivateRoomModal buttonName="Spectate" buttonColor="info" room_id={room_id} />;
        }
    }
};
