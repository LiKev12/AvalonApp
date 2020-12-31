import React from 'react';
import classes from './MissionTracker.module.css';
import PropTypes from 'prop-types';

import MissionTrackerTokenNull from '../../../../media/Tokens/TokenNull.png';
import MissionTrackerTokenPass from '../../../../media/Tokens/TokenPass.png';
import MissionTrackerTokenFail from '../../../../media/Tokens/TokenFail.png';

const MissionTracker = props => {
    const order = [1, 2, 3, 4, 5];
    const tokens = [];
    order.forEach(mission_idx => {
        const { isPassed, num_spots_on_mission, num_fails_required } = props.data[mission_idx];
        const token = getMissionTrackerToken(isPassed, num_spots_on_mission, num_fails_required);
        tokens.push(<div key={mission_idx}>{token}</div>);
    });
    return <div className={classes.MissionTracker}>{tokens}</div>;
};

MissionTracker.propTypes = {
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

export default MissionTracker;

const mapMissionStatusToToken = {
    null: MissionTrackerTokenNull,
    true: MissionTrackerTokenPass,
    false: MissionTrackerTokenFail
};

const getMissionTrackerToken = (isPassed, num_spots_on_mission, num_fails_required) => {
    const missionTrackerText = (
        <div className={classes.MissionTrackerText}>
            {num_spots_on_mission}
            {num_fails_required > 1 ? <sub className={classes.MissionTrackerSubtext}>{num_fails_required}</sub> : null}
        </div>
    );

    return (
        <div
            className={classes.MissionTrackerToken}
            style={{ backgroundImage: `url(${mapMissionStatusToToken[isPassed]})` }}
        >
            {missionTrackerText}
        </div>
    );
};
