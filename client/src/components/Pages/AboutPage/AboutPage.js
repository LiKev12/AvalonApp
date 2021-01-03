import React, { Component } from 'react';
import axios from 'axios';
import classes from './AboutPage.module.css';
import { Container } from 'reactstrap';

import { Merlin, Percival } from '../../../media/RoleAvatars';
import AboutLeaderboard from './AboutLeaderboard/AboutLeaderboard';
import AboutStatsGames from './AboutStatsGames/AboutStatsGames';
import AboutStatsUsers from './AboutStatsUsers/AboutStatsUsers';
import LoadingSpinner from '../Loading/LoadingSpinner';

class AboutPage extends Component {
    state = {
        //
        isLoadingUsersOverTime: false,
        isLoadingGamesOverTime: true,
        isLoadingLeaderboard: false,
        usersOverTimeData: null,
        gamesOverTimeData: null,
        leaderboardData: null
    };

    componentDidMount() {
        // 1) Get Users data over time (New Users and Total Users)
        axios.get(`/api/users/getUsersOverTime`).then(res => {
            const usersOverTimeData = res.data;
            this.setState({
                isLoadingUsersOverTime: false,
                usersOverTimeData
            });
        });

        // 2) Get Games data over time (New Games and Total Games)
        axios.get(`/api/games/getGamesOverTime`).then(res => {
            const gamesOverTimeData = res.data;
            this.setState({
                isLoadingGamesOverTime: false,
                gamesOverTimeData
            });
        });

        // 3) Get users with the topK (set to 5) ratings
        const ratingsTopK = 5;
        axios.get(`/api/ratings/topRatings/${ratingsTopK}`).then(res => {
            const leaderboardData = res.data;
            this.setState({
                isLoadingLeaderboard: false,
                leaderboardData
            });
        });
    }

    render() {
        const {
            isLoadingUsersOverTime,
            isLoadingGamesOverTime,
            isLoadingLeaderboard,
            usersOverTimeData,
            gamesOverTimeData,
            leaderboardData
        } = this.state;

        if (isLoadingUsersOverTime || isLoadingGamesOverTime || isLoadingLeaderboard) {
            return <LoadingSpinner />;
        }

        return (
            <div className={classes.AboutPage}>
                <Container>
                    <hr />
                    <h3>About the App</h3>
                    <hr />
                    <AboutStatsUsers usersOverTimeData={usersOverTimeData} />
                    <AboutStatsGames gamesOverTimeData={gamesOverTimeData} />
                    <hr />
                    <AboutLeaderboard leaderboardData={leaderboardData} />
                    <hr />
                    <div className={classes.AboutTextContainer}>
                        {aboutSection}
                        {feedbackSection}
                    </div>
                </Container>
            </div>
        );
    }
}

export default AboutPage;

const aboutSection = (
    <div>
        <h4>This was a fun project done by 2 friends in quarantine during the Covid-19 Pandemic.</h4>
        <h5>
            <div style={{ fontStyle: 'italic' }}>
                ~ Art and design credits to a secret Merlin, coded by her Percival ~
            </div>
        </h5>
        <div className={classes.Avatars}>
            <img src={Merlin} alt="Merlin" />
            <img src={Percival} alt="Percival" />
        </div>
    </div>
);

const feedbackSection = (
    <h6>
        Feel free to leave feedback{' '}
        <a href={`mailto:avalon.app.game@gmail.com?subject=AvalonApp`} target="_blank" rel="noopener noreferrer">
            here
        </a>
        . GitHub link{' '}
        <a href="https://github.com/LiKev12/AvalonApp" target="_blank" rel="noopener noreferrer">
            here
        </a>
        .
    </h6>
);
