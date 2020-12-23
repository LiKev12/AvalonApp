import React from 'react';
import { Container } from 'reactstrap';
import classes from './AboutPage.module.css';
import Merlin from '../../../media/RoleAvatars/Merlin.png';
import Percival from '../../../media/RoleAvatars/Percival.png';
import AboutStats from './AboutStats/AboutStats';

const AboutPage = props => {
    return (
        <div className={classes.AboutPage}>
            <Container>
                <hr />
                <h3>About the App</h3>
                <hr />
                <AboutStats />
                <hr />
                <div className={classes.AboutTextContainer}>
                    {aboutSection}
                    {feedbackSection}
                </div>
            </Container>
        </div>
    );
};

export default AboutPage;

const aboutSection = (
    <div>
        <h4>This was a fun project done by 2 friends in quarantine during the 2020 Covid Pandemic.</h4>
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
        Feel free to leave feedback
        <a
            href={`mailto:avalon.resistance.game@gmail.com?subject=AvalonGame`}
            target="_blank"
            rel="noopener noreferrer"
        >
            {' here'}
        </a>
        .
    </h6>
);
