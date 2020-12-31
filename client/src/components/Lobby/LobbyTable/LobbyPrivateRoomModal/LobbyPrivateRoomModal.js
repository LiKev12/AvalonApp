import React, { Component } from 'react';
import classes from './LobbyPrivateRoomModal.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Input, Modal, ModalHeader, ModalBody } from 'reactstrap';

class LobbyPrivateRoomModal extends Component {
    state = {
        modal: false,
        enteredPassword: '',
        enterButtonDisabled: true
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    handleEnterPassword = event => {
        const { value: enteredPassword } = event.target;
        const enterButtonDisabled = enteredPassword.length !== 6;
        this.setState({
            enteredPassword,
            enterButtonDisabled
        });
    };

    render() {
        const { buttonName, buttonColor, room_id } = this.props;
        const { modal, enteredPassword, enterButtonDisabled } = this.state;
        return (
            <div>
                <Button color={buttonColor} className={classes.LobbyTableButton} onClick={this.toggle}>
                    {buttonName}
                </Button>
                <Modal isOpen={modal} toggle={this.toggle}>
                    <ModalHeader>Please enter the password for private room {room_id}</ModalHeader>
                    <ModalBody>
                        <Input
                            type="text"
                            maxLength={6}
                            value={enteredPassword}
                            placeholder="Enter password..."
                            onChange={this.handleEnterPassword}
                        />
                        <br />
                        <Link to={`game/${room_id}/pwd/${enteredPassword}`}>
                            <Button color={buttonColor} block disabled={enterButtonDisabled}>
                                {buttonName}
                            </Button>
                        </Link>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

LobbyPrivateRoomModal.propTypes = {
    room_id: PropTypes.string.isRequired,
    buttonName: PropTypes.string.isRequired,
    buttonColor: PropTypes.string.isRequired
};

export default LobbyPrivateRoomModal;
