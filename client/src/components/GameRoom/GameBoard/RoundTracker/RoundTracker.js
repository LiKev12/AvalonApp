import React, { Fragment } from 'react';
import classes from './RoundTracker.module.css';
import PropTypes from 'prop-types';

import RoundTrackerToken from '../../../../media/Tokens/TokenRound.png';
import RoundTrackerToken1 from '../../../../media/Tokens/TokenRound1.png';
import RoundTrackerToken2 from '../../../../media/Tokens/TokenRound2.png';
import RoundTrackerToken3 from '../../../../media/Tokens/TokenRound3.png';
import RoundTrackerToken4 from '../../../../media/Tokens/TokenRound4.png';
import RoundTrackerToken5 from '../../../../media/Tokens/TokenRound5.png';

const RoundTracker = props => {
    const roundTrackerTokens = getRoundTrackerTokens(props.data);
    return <div className={classes.RoundTracker}>{roundTrackerTokens}</div>;
};

RoundTracker.props = {
    data: PropTypes.number
};

export default RoundTracker;

const mapRoundToToken = {
    0: RoundTrackerToken,
    1: RoundTrackerToken1,
    2: RoundTrackerToken2,
    3: RoundTrackerToken3,
    4: RoundTrackerToken4,
    5: RoundTrackerToken5
};

const roundTrackerTokenCurrent = (
    <div className={classes.RoundTrackerToken} style={{ backgroundImage: `url(${RoundTrackerToken})` }}></div>
);

const getRoundTrackerToken = idx => {
    return (
        <div className={classes.RoundTrackerToken} style={{ backgroundImage: `url(${mapRoundToToken[idx]})` }}></div>
    );
};

const getRoundTrackerTokens = current_round => {
    const tokens = [];
    const order = [1, 2, 3, 4, 5];
    order.forEach(idx => {
        if (idx === current_round) {
            tokens.push(<Fragment key={idx}>{roundTrackerTokenCurrent}</Fragment>);
        } else {
            tokens.push(<Fragment key={idx}>{getRoundTrackerToken(idx)}</Fragment>);
        }
    });
    return tokens;
};
