import React, { Component } from 'react';
import classes from './GameEnterModal.module.css';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalFooter } from 'reactstrap';

class GameEnterModal extends Component {
    state = {
        modal: true
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    onHandleJoin = () => {
        this.props.onHandleEnter();
        this.toggle();
    };

    onHandleSpectate = () => {
        this.props.onHandleSpectate();
        this.toggle();
    };

    onHandleRejoin = () => {
        this.toggle();
    };

    render() {
        const { room, hasStarted, isPlayerInGame } = this.props;

        const buttonRejoin = (
            <Button color="success" block onClick={this.onHandleRejoin}>
                Rejoin
            </Button>
        );

        const buttonJoin = (
            <Button color="success" block onClick={this.onHandleJoin}>
                Join
            </Button>
        );

        const buttonSpectate = (
            <Button color="info" block onClick={this.onHandleSpectate}>
                Spectate
            </Button>
        );

        let gameEnterModalButtons = null;
        if (hasStarted) {
            if (isPlayerInGame) {
                gameEnterModalButtons = buttonRejoin;
            } else {
                gameEnterModalButtons = buttonSpectate;
            }
        } else {
            gameEnterModalButtons = (
                <div>
                    {buttonJoin}
                    {buttonSpectate}
                </div>
            );
        }
        return (
            <div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} keyboard={false} backdrop={'static'}>
                    <ModalHeader>Welcome to game {room}</ModalHeader>
                    <ModalFooter className={classes.ModalFooterCustom}>{gameEnterModalButtons}</ModalFooter>
                </Modal>
            </div>
        );
    }
}

GameEnterModal.propTypes = {
    room: PropTypes.string,
    hasStarted: PropTypes.bool,
    isPlayerInGame: PropTypes.bool,
    onHandleEnter: PropTypes.func,
    onHandleSpectate: PropTypes.func
};

export default GameEnterModal;
