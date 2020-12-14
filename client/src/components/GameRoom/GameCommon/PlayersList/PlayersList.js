import React from 'react';
import PropTypes from 'prop-types';

import { Table } from 'reactstrap';

const playersList = props => {
    const { players_list } = props;
    return (
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
    );
};

playersList.propTypes = {
    players_list: PropTypes.array
};

export default playersList;
