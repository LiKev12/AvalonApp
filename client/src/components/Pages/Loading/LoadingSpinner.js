import React from 'react';
import classes from './LoadingSpinner.module.css';
import Spinner from './AvalonSpinner.png';

const LoadingSpinner = props => {
    return (
        <div className={classes.FullPageContainer}>
            <img className={classes.FullPageLoadingSpinner} src={Spinner} alt="loading" />
        </div>
    );
};

export default LoadingSpinner;
