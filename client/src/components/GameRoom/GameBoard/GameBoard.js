import React from 'react';
import classes from './GameBoard.module.css';
import PropTypes from 'prop-types';

import PlayerCard from './PlayerCard/PlayerCard';
import RoundTracker from './RoundTracker/RoundTracker';
import MissionTracker from './MissionTracker/MissionTracker';
import GameButtons from './GameButtons/GameButtons';

const gameBoard = props => {
    // PlayerCards
    let renderedPlayerCards = getPlayerCards(props);

    // GameButtons
    let renderedGameButtons = getGameButtons(props);

    return (
        <div className={classes.GameBackground}>
            <div className={classes.GameBoard}>
                {renderedPlayerCards}
                <MissionTracker data={props.MISSION_TRACKER} />
                <RoundTracker data={props.ROUND_TRACKER} />
                {renderedGameButtons}
            </div>
        </div>
    );
};

gameBoard.propTypes = {
    /**
     * board:
     * [{ isLeader, isSelected, isGivenExcalibur, activeState, roleAppearsAs, teamAppearsAs }]
     */
    board: PropTypes.object,
    button: PropTypes.string,
    team: PropTypes.string,
    /**
     * MISSION_TRACKER:
     * {
            1: { isPassed, num_spots_on_mission, num_fails_required }
            2: { isPassed, num_spots_on_mission, num_fails_required }
            3: { isPassed, num_spots_on_mission, num_fails_required }
            4: { isPassed, num_spots_on_mission, num_fails_required }
            5: { isPassed, num_spots_on_mission, num_fails_required }
        };
     */
    MISSION_TRACKER: PropTypes.object,
    ROUND_TRACKER: PropTypes.number,
    onClickPlayerCard: PropTypes.func,
    onHandleButtonClick: PropTypes.func
};

export default gameBoard;

const getPlayerCards = props => {
    const viewBoard = props.board;
    const renderedPlayerCards = viewBoard.map((player, player_idx) => {
        let playerCardsData = {
            player,
            player_idx,
            total_num_players: viewBoard.length,
            onClickPlayerCard: props.onClickPlayerCard
        };
        return <PlayerCard {...playerCardsData} />;
    });
    return renderedPlayerCards;
};

const getGameButtons = props => {
    const { button, team } = props;
    const { onHandleButtonClick } = props;
    const gameButtonsData = {
        button,
        team,
        onHandleButtonClick
    };
    return <GameButtons {...gameButtonsData} />;
};
