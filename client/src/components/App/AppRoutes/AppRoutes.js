import React, { Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import HomePage from '../../Pages/HomePage/HomePage';
import AboutPage from '../../Pages/AboutPage/AboutPage';
import RulesPage from '../../Pages/RulesPage/RulesPage';
import StatsPage from '../../Pages/StatsPage/StatsPage';

import GameRoomPublic from '../../GameRoom/GameRoomPublic/GameRoomPublic';

const appRoutes = props => {
    const sharedRoutes = (
        <Fragment>
            <Route exact path="/" component={HomePage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/rules" component={RulesPage} />
            {/** Below routes are not supposed to be "shared" but do not render otherwise (even on refresh). */}
            <Route path="/stats" component={StatsPage} />
            <Route exact path="/game/:room_id" component={GameRoomPublic} />
        </Fragment>
    );
    const authRoutes = (
        <Switch>
            {sharedRoutes}
            {/* <Route exact path="/game/:room_id/pwd/:room_pwd" component={GameRoomPrivate} /> */}
            <Redirect to="/"></Redirect>
        </Switch>
    );

    const guestRoutes = <Switch>{sharedRoutes}</Switch>;
    return props.isAuthenticated ? authRoutes : guestRoutes;
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {})(appRoutes);
