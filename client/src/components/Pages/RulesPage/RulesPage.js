import React, { Fragment } from 'react';
import classes from './RulesPage.module.css';
import { Container } from 'reactstrap';
import CharacterCards from './CharacterCards/CharacterCards';
import FeatureCards from './FeatureCards/FeatureCards';

const RulesPage = () => {
    return (
        <div className={classes.AboutPage}>
            <Container>
                {charactersSection}
                {featuresSection}
                {rulesSection}
            </Container>
        </div>
    );
};

export default RulesPage;

const charactersSection = (
    <Fragment>
        <hr />
        <h3>Characters</h3>
        <hr />
        <CharacterCards />
    </Fragment>
);

const featuresSection = (
    <Fragment>
        <hr />
        <h3>Features</h3>
        <hr />
        <FeatureCards />
    </Fragment>
);

const rulesSection = (
    <Fragment>
        <div>
            <hr />
            <h3>Rules</h3>
            <hr />
            <p>
                The rules of Avalon are explained nicely in this
                <a
                    href="http://upload.snakesandlattes.com/rules/r/ResistanceAvalon.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {' '}
                    guide{' '}
                </a>{' '}
                and video here:
            </p>
            <div className={classes.RulesVideoContainer}>
                <iframe
                    title="The Resistance: Avalon - How To Play"
                    className="mb-3 mt-3 "
                    src="https://www.youtube.com/embed/rXlK3NZjLGc"
                ></iframe>
            </div>
        </div>
    </Fragment>
);
