import React, { Component } from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { Link } from 'react-router-dom';

import { addRoomWithoutDispatch } from '../../../actions/roomActions';

import classes from './LobbyModal.module.css';
import { socket } from '../../../service/socket';
import { connect } from 'react-redux';

const DEFAULT_STATE = {
    modal: false,
    buttonDisabled: false,
    room_id: '0',
    room_pwd: '0',
    is_public: true,
    is_rated: false,
    isCreated: false,
    success_msg: null
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

    /**
     * Generates a 4-digit string of numbers
     */
    generateRoomID = unavailable_room_ids => {
        const available_room_ids = [...Array(10000).keys()]
            .filter(val => ![...Array(1000).keys()].includes(val))
            .map(el => el.toString())
            .filter(val => !unavailable_room_ids.includes(val));
        const room_id = available_room_ids[Math.floor(Math.random() * available_room_ids.length)];
        return room_id;
    };

    onSubmit = e => {
        e.preventDefault();
        this.setState({
            buttonDisabled: true
        });
        axios.get('/api/rooms').then(res => {
            const room_id = res.data;
            // Add to database
            this.props.addRoomWithoutDispatch({
                room_id,
                is_public: this.state.is_public,
                is_rated: this.state.is_rated
            });

            // Set state to show isCreated
            this.setState({
                room_id,
                isCreated: true,
                success_msg: `Your room ID is ${room_id}`
            });

            // Send data to server for Avalon to track
            const user_id = this.props.auth && this.props.auth.user ? this.props.auth.user._id : null;
            const data = {
                room_id,
                user_id,
                is_public: this.state.is_public,
                is_rated: this.state.is_rated
            };
            socket.emit('server_game_handle_CREATE', data);
        });
    };

    render() {
        let createRoomButton = (
            <Button color="success" className={classes.CreateRoomButton} onClick={this.toggle}>
                Create a Room
            </Button>
        );
        return (
            <div>
                {createRoomButton}
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Create a Room</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup check>
                                <Label check>
                                    <Input
                                        checked={this.state.is_public}
                                        type="radio"
                                        name="radio_public_private"
                                        onClick={() => this.handleClickPublic(true)}
                                    />
                                    Public
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input
                                        checked={!this.state.is_public}
                                        type="radio"
                                        name="radio_public_private"
                                        onClick={() => this.handleClickPublic(false)}
                                        disabled
                                    />
                                    Private
                                </Label>
                            </FormGroup>
                            <hr />
                            <FormGroup check>
                                <Label check>
                                    <Input
                                        checked={!this.state.is_rated}
                                        type="radio"
                                        name="radio_rated_unrated"
                                        onClick={() => this.handleClickRated(false)}
                                    />
                                    Unrated
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input
                                        checked={this.state.is_rated}
                                        type="radio"
                                        name="radio_rated_unrated"
                                        onClick={() => this.handleClickRated(true)}
                                    />
                                    Rated
                                </Label>
                            </FormGroup>
                            <Button
                                color="dark"
                                block
                                disabled={this.state.buttonDisabled}
                                className={classes.CreateRoomModalButton}
                            >
                                Create Room
                            </Button>

                            {this.state.isCreated ? (
                                <Alert className="mt-3" color="success">
                                    {this.state.success_msg}
                                </Alert>
                            ) : null}
                            {this.state.isCreated && this.state.is_public && (
                                <Link to={`/game/${this.state.room_id}`}>
                                    <Button color="success" style={{ marginTop: '2rem' }} block>
                                        Join Public Room
                                    </Button>
                                </Link>
                            )}
                            {this.state.isCreated && !this.state.is_public && (
                                <Link to={`/game/${this.state.room_id}/pwd/${this.state.game_pwd}`}>
                                    <Button color="success" style={{ marginTop: '2rem' }} block>
                                        Join Private Room
                                    </Button>
                                </Link>
                            )}
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

export default connect(mapStateToProps, {
    addRoomWithoutDispatch
})(LobbyModal);
