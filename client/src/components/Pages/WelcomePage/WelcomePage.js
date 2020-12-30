import React from 'react';
import classes from './WelcomePage.module.css';

const WelcomePage = () => {
    const spacing = (
        <div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
        </div>
    );
    return (
        <div className={classes.OuterContainer}>
            <div className={classes.InnerContainer}>
                {spacing}
                <div className={classes.InnerText}>
                    Welcome to The Resistance: Avalon
                    <br></br>
                    <div className={classes.SubText}>Please register and log in to play</div>
                </div>
                <div className={classes.DisclaimerText}>
                    This is not affiliated with the official creators of "The Resistance: Avalon" game. This was purely
                    a hobby project, from enthusiasts of the game.
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
