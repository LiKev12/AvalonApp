import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

const PlayersList = props => {
    const { players_list } = props;
    if (!players_list || players_list.length === 0) {
        return null;
    }
    return (
        <div>
            <hr />
            <h3>Players</h3>
            <hr />
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {players_list.map((playerObj, idx) => {
                        const { user_name } = playerObj;
                        return (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>
                                    {user_name}
                                    {idx === 0 ? ' (Leader)' : null}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

PlayersList.propTypes = {
    players_list: PropTypes.array
};

export default PlayersList;
