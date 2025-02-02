import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import AboutPage from '../../Pages/AboutPage/AboutPage';
import GameRoom from '../../GameRoom/GameRoom';
import HomePage from '../../Pages/HomePage/HomePage';
import RulesPage from '../../Pages/RulesPage/RulesPage';
import StatsPage from '../../Pages/StatsPage/StatsPage';

const AppRoutes = (props) => {
    const sharedRoutes = (
        <Fragment>
            <Route exact path='/' component={HomePage} />
            <Route exact path='/about' component={AboutPage} />
            <Route exact path='/rules' component={RulesPage} />
            {/** Below routes are not supposed to be "shared" but do not render otherwise (even on refresh). */}
            <Route exact path='/stats' component={StatsPage} />
            <Route exact path='/game/:room_id' render={(props) => <GameRoom {...props} is_public={true} />} />
            <Route exact path='/game/:room_id/pwd/:pwd' render={(props) => <GameRoom {...props} is_public={false} />} />
        </Fragment>
    );
    const authRoutes = (
        <Switch>
            {sharedRoutes}
            <Redirect to='/'></Redirect>
        </Switch>
    );

    const guestRoutes = (
        <Switch>
            {sharedRoutes}
            <Redirect to='/'></Redirect>
        </Switch>
    );
    return props.isAuthenticated ? <Switch>{authRoutes}</Switch> : <Switch>{guestRoutes}</Switch>;
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, null)(AppRoutes);
