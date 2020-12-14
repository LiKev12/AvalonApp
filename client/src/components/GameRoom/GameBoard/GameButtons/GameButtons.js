import React from 'react';
import classes from './GameButtons.module.css';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

// Expect:
// data = {round: true, mission: false, propose: false, assassinate: false }
// OnClicks

/* propose */
const PROPOSE = 'propose';

/* round */
const ROUND = 'round';
const APPROVE = 'approve';
const REJECT = 'reject';

/* mission */
const MISSION = 'mission';
const PASS = 'pass';
const FAIL = 'fail';

/* assassinate */
const ASSASSINATE = 'assassinate';

/* give_excalibur */
const GIVE_EXCALIBUR = 'give_excalibur';
const GIVE_EXCALIBUR_TEXT = 'give excalibur';

/* use_excalibur */
const USE_EXCALIBUR = 'use_excalibur';
const USE_EXCALIBUR_TEXT = 'excalibur';
const SKIP_EXCALIBUR_TEXT = 'skip';

const gameButtons = props => {
    const renderedGameButtons = _getVisibleButtons(props.button, props.team, props.onHandleButtonClick);
    return <div className={classes.GameButtons}>{renderedGameButtons}</div>;
};

const _getVisibleButtons = (button, team, onHandleButtonClick) => {
    if (button === ROUND) {
        return (
            <React.Fragment>
                <Button className={classes.GameButtonDuo} onClick={() => onHandleButtonClick(ROUND, true)}>
                    {APPROVE}
                </Button>
                <Button className={classes.GameButtonDuo} onClick={() => onHandleButtonClick(ROUND, false)}>
                    {REJECT}
                </Button>
            </React.Fragment>
        );
    } else if (button === MISSION) {
        return (
            <React.Fragment>
                <Button className={classes.GameButtonDuo} onClick={() => onHandleButtonClick(MISSION, true)}>
                    {PASS}
                </Button>
                {team === 'SPY' && (
                    <Button className={classes.GameButtonDuo} onClick={() => onHandleButtonClick(MISSION, false)}>
                        {FAIL}
                    </Button>
                )}
            </React.Fragment>
        );
    } else if (button === PROPOSE) {
        return <Button onClick={() => onHandleButtonClick(PROPOSE)}>{PROPOSE}</Button>;
    } else if (button === ASSASSINATE) {
        return <Button onClick={() => onHandleButtonClick(ASSASSINATE)}>{ASSASSINATE}</Button>;
    } else if (button === GIVE_EXCALIBUR) {
        return <Button onClick={() => onHandleButtonClick(GIVE_EXCALIBUR)}>{GIVE_EXCALIBUR_TEXT}</Button>;
    } else if (button === USE_EXCALIBUR) {
        return (
            <React.Fragment>
                <Button className={classes.GameButtonDuo} onClick={() => onHandleButtonClick(USE_EXCALIBUR, true)}>
                    {USE_EXCALIBUR_TEXT}
                </Button>
                <Button className={classes.GameButtonDuo} onClick={() => onHandleButtonClick(USE_EXCALIBUR, false)}>
                    {SKIP_EXCALIBUR_TEXT}
                </Button>
            </React.Fragment>
        );
    }
    return null;
};

gameButtons.propTypes = {
    button: PropTypes.string
};

export default gameButtons;
