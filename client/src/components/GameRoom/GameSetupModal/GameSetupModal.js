import React, { Component } from 'react';
import classes from './GameSetupModal.module.css';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, CustomInput, Alert } from 'reactstrap';

class GameSetupModal extends Component {
    state = {
        modal: false,
        buttonDisabled: false,
        num_roles_added: 0,
        error_msg: null,
        roles: {
            Merlin: true,
            Assassin: true,
            Percival: true,
            Morgana: true,
            Oberon: false,
            Mordred: false,
            Minion: false,
            DrunkMerlin: false
        },
        features: {
            Excalibur: false,
            'Lady of the Lake': false
        }
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    onChangeCheck = (e, input) => {
        let inputs = { ...this.state[input] };
        inputs[e.target.name] = !inputs[e.target.name];
        this.setState({ [input]: inputs });
    };

    check_form_validation() {
        let num_roles_added = Object.keys(this.state.roles).filter(role => this.state.roles[role]).length;
        return this.props.num_players - num_roles_added >= 0;
    }

    get_final_setup() {
        // Convert object into array of roles
        let roles = Object.keys(this.state.roles).filter(role => this.state.roles[role]);

        // Add LoyalServants to fill the difference
        let difference = Number(this.props.num_players) - Number(roles.length);
        for (let i = 0; i < difference; i++) {
            roles.push('LoyalServant');
        }

        const features = this.state.features;

        let setup = {
            roles,
            features,
            num_players: this.props.num_players
        };
        return setup;
    }

    onSubmit = e => {
        e.preventDefault();

        // Handle form validation
        if (!this.check_form_validation()) {
            this.setState({
                error_msg: 'Invalid game setup. Please try again.'
            });
            return;
        }
        let final_setup = this.get_final_setup();
        this.props.onSetup(final_setup);
        this.setState({
            buttonDisabled: true
        });
        this.toggle();
    };

    render() {
        let role_inputs = Object.keys(this.state.roles).map((role, idx) => {
            return (
                <CustomInput
                    type="checkbox"
                    id={role}
                    name={role}
                    label={role}
                    onChange={e => this.onChangeCheck(e, 'roles')}
                    checked={this.state.roles[role]}
                />
            );
        });

        let other_inputs = Object.keys(this.state.features).map((feature, idx) => {
            return (
                <CustomInput
                    type="checkbox"
                    id={feature}
                    name={feature}
                    label={feature}
                    onChange={e => this.onChangeCheck(e, 'features')}
                    checked={this.state.features[feature]}
                />
            );
        });

        return (
            <div>
                <Button
                    className={classes.Button}
                    block
                    disabled={this.state.buttonDisabled}
                    color="dark"
                    onClick={this.toggle}
                >
                    Create Game
                </Button>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Create a Game</ModalHeader>
                    <ModalBody>
                        {this.state.error_msg ? <Alert color="danger">{this.state.error_msg} </Alert> : null}
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="role_selection">Number of Players: {this.props.num_players}</Label>
                                <br></br>
                                <Label for="role_selection">Roles:</Label>
                                {role_inputs}
                                <br></br>
                                <Label for="role_selection">Other:</Label>
                                {other_inputs}
                                <Button
                                    color="dark"
                                    block
                                    disabled={this.state.buttonDisabled}
                                    style={{ marginTop: '2rem' }}
                                >
                                    Submit
                                </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default GameSetupModal;
