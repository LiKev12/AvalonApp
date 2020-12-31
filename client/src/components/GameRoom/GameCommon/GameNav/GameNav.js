import React, { Component } from 'react';
import classes from './GameNav.module.css';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

import GameChat from '../../../Chat/Chat';
import GameTranscript from './GameTranscript/GameTranscript';
import GameVotingRecord from './GameVotingRecord/GameVotingRecord';

export class GameNav extends Component {
    state = {
        activeTab: 'Transcript'
    };

    toggleActiveTab = newActiveTab => {
        this.setState({
            activeTab: newActiveTab
        });
    };

    render() {
        return (
            <div className={classes.GameNav}>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            onClick={() => {
                                this.toggleActiveTab('Transcript');
                            }}
                            className={classnames({ active: this.state.activeTab === 'Transcript' })}
                        >
                            Transcript
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            onClick={() => {
                                this.toggleActiveTab('Record');
                            }}
                            className={classnames({ active: this.state.activeTab === 'Record' })}
                        >
                            Record
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            onClick={() => {
                                this.toggleActiveTab('Chat');
                            }}
                            className={classnames({ active: this.state.activeTab === 'Chat' })}
                        >
                            Chat
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="Transcript">
                        <GameTranscript transcript={this.props.transcript} />
                    </TabPane>
                    <TabPane tabId="Record">
                        <GameVotingRecord voting_record={this.props.voting_record} />
                    </TabPane>
                    <TabPane tabId="Chat">
                        <GameChat room={this.props.room} />
                    </TabPane>
                </TabContent>
            </div>
        );
    }
}

GameNav.propTypes = {
    room: PropTypes.string,
    voting_record: PropTypes.object,
    transcript: PropTypes.array
};

export default GameNav;
