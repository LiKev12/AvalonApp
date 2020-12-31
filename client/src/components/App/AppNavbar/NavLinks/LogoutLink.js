import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { NavLink } from 'reactstrap';
import { logout } from '../../../../actions/authActions';

export class LogoutLink extends Component {
    render() {
        return (
            <Fragment>
                <NavLink onClick={this.props.logout} href="/">
                    Logout
                </NavLink>
            </Fragment>
        );
    }
}

LogoutLink.propTypes = {
    logout: PropTypes.func.isRequired
};

export default connect(null, { logout })(LogoutLink);
