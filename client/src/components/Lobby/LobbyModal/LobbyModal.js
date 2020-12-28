import React, { Component, Fragment } from 'react';
import classes from './LobbyModal.module.css';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

import { socket } from '../../../service/socket';

const DEFAULT_STATE = {
    modal: false,
    room_id: null, // Ex. "123456"
    room_pwd: null, // Ex. "abcdef"
    is_public: true,
    is_rated: false,
    isCreated: false,
    success_msg: null,
    buttonDisabled: false
};

export class LobbyModal extends Component {
    state = DEFAULT_STATE;

    toggle = () => {
        // Reset everything
        this.setState({
            ...DEFAULT_STATE,
            modal: !this.state.modal
        });
    };

    handleClickPublic = is_public => {
        this.setState({
            is_public
        });
    };

    handleClickRated = is_rated => {
        this.setState({
            is_rated
        });
    };

    _generateArrBetweenEnds = (lower, upper) => {
        const arrBetweenEnds = [];
        for (let i = lower; i < upper; i++) {
            arrBetweenEnds.push(i.toString());
        }
        return arrBetweenEnds;
    };

    _generateRandomRoomID = lengthLimit => {
        let room_id = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < lengthLimit; i++) {
            room_id += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return room_id;
    };

    /**
     * Generates a random 6 letter password
     */
    _generateRandomRoomPassword = lengthLimit => {
        let room_pwd = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let i = 0; i < lengthLimit; i++) {
            room_pwd += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return room_pwd;
    };

    /**
     * Original: 1000
     * New1: 130
     * New2:
     */
    onSubmit = e => {
        e.preventDefault();
        const { is_public, is_rated } = this.state;
        // 1) Generate room_id and room_pwd on client-side
        const room_id = this._generateRandomRoomID(6);
        let room_pwd = null;
        if (is_public) {
            this.setState({
                room_id,
                room_pwd,
                isCreated: true,
                success_msg: `Your room ID is ${room_id}`,
                buttonDisabled: true
            });
        } else {
            room_pwd = this._generateRandomRoomPassword(6);
            this.setState({
                room_id,
                room_pwd,
                isCreated: true,
                success_msg: `Your room ID is ${room_id} and your password is "${room_pwd}"`,
                buttonDisabled: true
            });
        }
        // 2) Send data to server for Avalon to track
        const user_id = this.props.auth && this.props.auth.user ? this.props.auth.user._id : null;
        const data = {
            room_id,
            room_pwd,
            user_id,
            is_public,
            is_rated
        };
        socket.emit('server_game_handle_CREATE', data);
    };

    render() {
        const toggleModalButton = (
            <Button color="success" className={classes.ToggleLobbyModalButton} onClick={this.toggle}>
                Create a Room
            </Button>
        );

        const { modal, room_id, room_pwd, is_public, is_rated, isCreated, success_msg, buttonDisabled } = this.state;
        const settingRadioButtons = (
            <Fragment>
                <FormGroup check>
                    <Label check>
                        <Input
                            checked={is_public}
                            type="radio"
                            name="radio_public_private"
                            onChange={() => this.handleClickPublic(true)}
                        />
                        Public
                    </Label>
                </FormGroup>
                <FormGroup check>
                    <Label check>
                        <Input
                            checked={!is_public}
                            type="radio"
                            name="radio_public_private"
                            onChange={() => this.handleClickPublic(false)}
                        />
                        Private
                    </Label>
                </FormGroup>
            </Fragment>
        );
        const typeRadioButtons = (
            <Fragment>
                <FormGroup check>
                    <Label check>
                        <Input
                            checked={!is_rated}
                            type="radio"
                            name="radio_rated_unrated"
                            onChange={() => this.handleClickRated(false)}
                        />
                        Unrated
                    </Label>
                </FormGroup>
                <FormGroup check>
                    <Label check>
                        <Input
                            checked={is_rated}
                            type="radio"
                            name="radio_rated_unrated"
                            onChange={() => this.handleClickRated(true)}
                        />
                        Rated
                    </Label>
                </FormGroup>
            </Fragment>
        );

        const createRoomButton = (
            <Button color="dark" block disabled={buttonDisabled} className={classes.CreateRoomButton}>
                Create Room
            </Button>
        );
        const successMsg = isCreated ? (
            <Alert className="mt-3" color="success">
                {success_msg}
            </Alert>
        ) : null;

        const gameLinkButton = (
            <Fragment>
                {isCreated && is_public && (
                    <Link to={`/game/${room_id}`}>
                        <Button color="success" style={{ marginTop: '2rem' }} block>
                            Join Public Room
                        </Button>
                    </Link>
                )}
                {isCreated && !is_public && (
                    <Link to={`/game/${room_id}/pwd/${room_pwd}`}>
                        <Button color="success" style={{ marginTop: '2rem' }} block>
                            Join Private Room
                        </Button>
                    </Link>
                )}
            </Fragment>
        );

        return (
            <div>
                {toggleModalButton}
                <Modal isOpen={modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Create a Room</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            {settingRadioButtons}
                            <hr />
                            {typeRadioButtons}
                            <hr />
                            {createRoomButton}
                            {successMsg}
                            {gameLinkButton}
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    room: state.room
});

export default connect(mapStateToProps, null)(LobbyModal);
