import React, { Component, Fragment } from 'react';
import { NavLink } from 'reactstrap';
import { connect } from 'react-redux';
import { logout } from '../../../../actions/authActions';
import PropTypes from 'prop-types';

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
