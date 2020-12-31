import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LobbyPage from '../../Lobby/LobbyPage';
import WelcomePage from '../WelcomePage/WelcomePage';

class HomePage extends Component {
    render() {
        return this.props.isAuthenticated ? <LobbyPage /> : <WelcomePage />;
    }
}

HomePage.propTypes = {
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(HomePage);
