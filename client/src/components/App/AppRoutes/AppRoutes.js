import React, { Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import HomePage from '../../Pages/HomePage/HomePage';
import AboutPage from '../../Pages/AboutPage/AboutPage';
import RulesPage from '../../Pages/RulesPage/RulesPage';
import StatsPage from '../../Pages/StatsPage/StatsPage';

import GameRoom from '../../GameRoom/GameRoom';

const appRoutes = props => {
    const sharedRoutes = (
        <Fragment>
            <Route exact path="/" component={HomePage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/rules" component={RulesPage} />
            {/** Below routes are not supposed to be "shared" but do not render otherwise (even on refresh). */}
            <Route path="/stats" component={StatsPage} />
            {/* <Route exact path="/game/:room_id" component={GameRoom} />
            <Route exact path="/game/:room_id/pwd/:room_pwd" component={GameRoom} /> */}
            <Route exact path="/game/:room_id" render={props => <GameRoom {...props} is_public={true} />} />
            <Route exact path="/game/:room_id/pwd/:pwd" render={props => <GameRoom {...props} is_public={false} />} />
        </Fragment>
    );
    const authRoutes = (
        <Switch>
            {sharedRoutes}
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
