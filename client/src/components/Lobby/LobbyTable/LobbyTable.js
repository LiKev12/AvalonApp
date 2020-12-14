import React from 'react';
import { Button, Table } from 'reactstrap';
import { Link } from 'react-router-dom';

const lobbyTable = props => {
    let table_body = (
        <tr key="single">
            <th colSpan="5" style={{ textAlign: 'center' }}>
                No games in progress. Try making one!
            </th>
        </tr>
    );

    if (props.lobby_data.length > 0) {
        table_body = props.lobby_data.map((room_data, idx) => {
            const isPublicSetting = room_data['is_public'] ? 'public' : 'private';
            const buttonColor = room_data.hasLocked ? 'info' : 'success';
            const buttonText = room_data.hasLocked ? 'Spectate' : 'Join';
            return (
                <tr key={idx}>
                    <th scope="row">{idx + 1}</th>
                    <td>{isPublicSetting}</td>
                    <td>{room_data['room_id']}</td>
                    <td>{room_data['num_players']} / 12</td>
                    <td>
                        <Link to={`game/${room_data['room_id']}`}>
                            <Button color={buttonColor} style={{ width: '100px' }}>
                                {buttonText}
                            </Button>
                        </Link>
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
                        <th>#</th>
                        <th>Setting</th>
                        <th>Game ID</th>
                        <th>Capacity</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>{table_body}</tbody>
            </Table>
        </div>
    );
};

/**
 * [{lobby}]
 *             setting,
            room_id,
            creation_time,
            hasStarted,
            hasEnded,
            hasLocked,
            num_players
 */

export default lobbyTable;
