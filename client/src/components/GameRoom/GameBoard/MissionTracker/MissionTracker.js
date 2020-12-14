import React from 'react';
import classes from './MissionTracker.module.css';
import PropTypes from 'prop-types';

import MissionTrackerTokenNull from '../../../../media/Tokens/TokenNull.png';
import MissionTrackerTokenPass from '../../../../media/Tokens/TokenPass.png';
import MissionTrackerTokenFail from '../../../../media/Tokens/TokenFail.png';

const missionTracker = props => {
    const order = [1, 2, 3, 4, 5];
    const tokens = [];
    order.forEach(mission_idx => {
        const { isPassed, num_spots_on_mission, num_fails_required } = props.data[mission_idx];
        const token = getMissionTrackerToken(isPassed, num_spots_on_mission, num_fails_required);
        tokens.push(token);
    });
    return <div className={classes.MissionTracker}>{tokens}</div>;
};

missionTracker.propTypes = {
    /**
     * data:
     * {
            1: { isPassed, num_spots_on_mission, num_fails_required }
            2: { isPassed, num_spots_on_mission, num_fails_required }
            3: { isPassed, num_spots_on_mission, num_fails_required }
            4: { isPassed, num_spots_on_mission, num_fails_required }
            5: { isPassed, num_spots_on_mission, num_fails_required }
        };
     */
    data: PropTypes.object
};

export default missionTracker;

const getMissionTrackerToken = (isPassed, num_spots_on_mission, num_fails_required) => {
    if (isPassed === null) {
        return (
            <div className={classes.MissionTrackerToken} style={{ backgroundImage: `url(${MissionTrackerTokenNull})` }}>
                {num_spots_on_mission} | {num_fails_required}
            </div>
        );
    } else if (isPassed === true) {
        return (
            <div className={classes.MissionTrackerToken} style={{ backgroundImage: `url(${MissionTrackerTokenPass})` }}>
                {num_spots_on_mission} | {num_fails_required}
            </div>
        );
    } else if (isPassed === false) {
        return (
            <div className={classes.MissionTrackerToken} style={{ backgroundImage: `url(${MissionTrackerTokenFail})` }}>
                {num_spots_on_mission} | {num_fails_required}
            </div>
        );
    }
};
