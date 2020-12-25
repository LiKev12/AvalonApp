import React from 'react';
import classes from './WelcomePage.module.css';

const WelcomePage = () => {
    return (
        <div className={classes.OuterContainer}>
            <div className={classes.InnerContainer}>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div className={classes.InnerText}>
                    Welcome to The Resistance: Avalon
                    <br></br>
                    <div className={classes.SubText}>Please register and log in to play</div>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
