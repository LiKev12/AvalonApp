import React, { Component } from 'react';
import { connect } from 'react-redux';

import WelcomePage from '../WelcomePage/WelcomePage';
import LobbyPage from '../../Lobby/LobbyPage';

class HomePage extends Component {
    render() {
        return this.props.isAuthenticated ? <LobbyPage /> : <WelcomePage />;
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(HomePage);
