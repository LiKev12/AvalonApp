import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import GameChat from '../../../Chat/Chat';
import GameVotingRecord from './GameVotingRecord/GameVotingRecord';
import classes from './GameNav.module.css';
import classnames from 'classnames';

export class GameNav extends Component {
    state = {
        activeTab: 'Chat'
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
                                this.toggleActiveTab('Chat');
                            }}
                            className={classnames({ active: this.state.activeTab === 'Chat' })}
                        >
                            Chat
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
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="Chat">
                        <GameChat room={this.props.room_id} />
                    </TabPane>
                    <TabPane tabId="Record">
                        <GameVotingRecord voting_record={this.props.voting_record} />
                    </TabPane>
                </TabContent>
            </div>
        );
    }
}

export default GameNav;
