import React, { Component } from 'react';
import classes from './GameButtons.module.css';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import * as BUTTON_CONSTANTS from '../../../../constants/buttons';

class GameButtons extends Component {
    state = {
        buttonVisible: true
    };

    handleOnClick = (button, isAffirmative) => {
        this.props.onHandleButtonClick(button, isAffirmative);
        this.setState({
            buttonVisible: !this.state.buttonVisible
        });
    };

    render() {
        const renderedGameButtons = this.state.buttonVisible
            ? _getVisibleButtons(this.props.button, this.props.team, this.props.onHandleButtonClick, this.handleOnClick)
            : null;
        return <div className={classes.GameButtons}>{renderedGameButtons}</div>;
    }
}

GameButtons.propTypes = {
    button: PropTypes.string
};

export default GameButtons;

const _getVisibleButtons = (button, team, onHandleButtonClick, handleOnClick) => {
    if (button === BUTTON_CONSTANTS.ROUND) {
        return (
            <React.Fragment>
                <Button
                    color="success"
                    className={classes.GameButtonDuo}
                    onClick={() => handleOnClick(BUTTON_CONSTANTS.ROUND, true)}
                >
                    {BUTTON_CONSTANTS.APPROVE}
                </Button>
                <Button
                    color="danger"
                    className={classes.GameButtonDuo}
                    onClick={() => handleOnClick(BUTTON_CONSTANTS.ROUND, false)}
                >
                    {BUTTON_CONSTANTS.REJECT}
                </Button>
            </React.Fragment>
        );
    } else if (button === BUTTON_CONSTANTS.MISSION) {
        return (
            <React.Fragment>
                <Button
                    color="success"
                    className={classes.GameButtonDuo}
                    onClick={() => handleOnClick(BUTTON_CONSTANTS.MISSION, true)}
                >
                    {BUTTON_CONSTANTS.PASS}
                </Button>
                {team === 'SPY' && (
                    <Button
                        color="danger"
                        className={classes.GameButtonDuo}
                        onClick={() => handleOnClick(BUTTON_CONSTANTS.MISSION, false)}
                    >
                        {BUTTON_CONSTANTS.FAIL}
                    </Button>
                )}
            </React.Fragment>
        );
    } else if (button === BUTTON_CONSTANTS.PROPOSE) {
        return (
            <Button color="info" onClick={() => handleOnClick(BUTTON_CONSTANTS.PROPOSE)}>
                {BUTTON_CONSTANTS.PROPOSE}
            </Button>
        );
    } else if (button === BUTTON_CONSTANTS.ASSASSINATE) {
        return (
            <Button color="danger" onClick={() => handleOnClick(BUTTON_CONSTANTS.ASSASSINATE)}>
                {BUTTON_CONSTANTS.ASSASSINATE}
            </Button>
        );
    } else if (button === BUTTON_CONSTANTS.GIVE_EXCALIBUR) {
        return (
            <Button color="info" onClick={() => handleOnClick(BUTTON_CONSTANTS.GIVE_EXCALIBUR)}>
                {BUTTON_CONSTANTS.GIVE_EXCALIBUR_TEXT}
            </Button>
        );
    } else if (button === BUTTON_CONSTANTS.USE_EXCALIBUR) {
        return (
            <Button color="info" onClick={() => handleOnClick(BUTTON_CONSTANTS.USE_EXCALIBUR, true)}>
                {BUTTON_CONSTANTS.USE_EXCALIBUR_TEXT}
            </Button>
        );
    } else if (button === BUTTON_CONSTANTS.SKIP_EXCALIBUR) {
        return (
            <Button color="secondary" onClick={() => handleOnClick(BUTTON_CONSTANTS.USE_EXCALIBUR, false)}>
                {BUTTON_CONSTANTS.SKIP_EXCALIBUR_TEXT}
            </Button>
        );
    } else if (button === BUTTON_CONSTANTS.CONFIRM_EXCALIBUR_PASS) {
        return (
            <Button color="warning" onClick={() => handleOnClick(BUTTON_CONSTANTS.CONFIRM_EXCALIBUR)}>
                {BUTTON_CONSTANTS.CONFIRM_EXCALIBUR_PASS_TEXT}
            </Button>
        );
    } else if (button === BUTTON_CONSTANTS.CONFIRM_EXCALIBUR_FAIL) {
        return (
            <Button color="warning" onClick={() => handleOnClick(BUTTON_CONSTANTS.CONFIRM_EXCALIBUR)}>
                {BUTTON_CONSTANTS.CONFIRM_EXCALIBUR_FAIL_TEXT}
            </Button>
        );
    } else if (button === BUTTON_CONSTANTS.USE_LOTL) {
        return (
            <Button color="info" onClick={() => onHandleButtonClick(BUTTON_CONSTANTS.USE_LOTL)}>
                {BUTTON_CONSTANTS.USE_LOTL_TEXT}
            </Button>
        );
    } else if (button === BUTTON_CONSTANTS.CONFIRM_LOTL_RESISTANCE) {
        return (
            <Button color="secondary" onClick={() => onHandleButtonClick(BUTTON_CONSTANTS.CONFIRM_LOTL)}>
                {BUTTON_CONSTANTS.CONFIRM_LOTL_RESISTANCE_TEXT}
            </Button>
        );
    } else if (button === BUTTON_CONSTANTS.CONFIRM_LOTL_SPY) {
        return (
            <Button color="secondary" onClick={() => onHandleButtonClick(BUTTON_CONSTANTS.CONFIRM_LOTL)}>
                {BUTTON_CONSTANTS.CONFIRM_LOTL_SPY_TEXT}
            </Button>
        );
    }
    return null;
};
