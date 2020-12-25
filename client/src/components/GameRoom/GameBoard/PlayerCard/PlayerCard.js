import React from 'react';
import classes from './PlayerCard.module.css';
import PropTypes from 'prop-types';
import {
    Assassin,
    DrunkMerlin,
    LoyalServant,
    Merlin,
    Minion,
    Mordred,
    Morgana,
    Oberon,
    Percival,
    Unknown
} from '../../../../media/RoleAvatars';

const playerCard = props => {
    const { player, player_idx, total_num_players, onClickPlayerCard, button } = props;
    const {
        user_name,
        isSelected,
        isLeader,
        isHammer,
        isGivenExcalibur,
        isGivenLOTL,
        activeState,
        roleAppearsAs,
        teamAppearsAs
    } = player;
    const overrideStyle = getStyle(teamAppearsAs, roleAppearsAs, activeState, player_idx, total_num_players, button);
    const displayedUserName = isHammer ? `\u2606${user_name}` : user_name;
    return (
        <div className={classes.PlayerCard} style={overrideStyle} onClick={() => onClickPlayerCard(player_idx)}>
            {isLeader ? <div className={classes.LeaderMarker}></div> : null}
            {isSelected ? <div className={classes.MissionMarker}></div> : null}
            {isGivenExcalibur ? <div className={classes.ExcaliburMarker}></div> : null}
            {isGivenLOTL ? <div className={classes.LadyMarker}></div> : null}
            <div className={classes.NameBanner}>{displayedUserName}</div>
        </div>
    );
};

playerCard.propTypes = {
    /**
     * player:
     * { user_name, isSelected, isLeader, isHammer, isGivenExcalibur, isGivenLOTL, activeState, roleAppearsAs, teamAppearsAs }
     */
    player: PropTypes.object,
    player_idx: PropTypes.number,
    total_num_players: PropTypes.number,
    onClickPlayerCard: PropTypes.func,
    button: PropTypes.string
};

export default playerCard;

const map_name_to_avatar = {
    Assassin,
    DrunkMerlin,
    LoyalServant,
    Percival,
    Merlin,
    Minion,
    Mordred,
    Morgana,
    Oberon,
    Unknown
};
const map_team_to_border = {
    RESISTANCE: '5px solid #7EC8E3',
    SPY: '5px solid #f75454'
};

const mapActiveState = {
    IS_STILL_VOTING: '0 0 20px yellow',
    IS_TARGETED_BY_EXCALIBUR: '0 0 20px purple',
    IS_TARGETED_BY_ASSASSIN: '0 0 20px red',
    IS_TARGETED_BY_LOTL: '0 0 20px #00FFFF'
};

const getDegreeRotation = (player_idx, total_num_players) => {
    let increment = 360 / total_num_players;
    let initial_degree = 270;
    let degree_rotation = initial_degree + increment * player_idx;

    return degree_rotation;
};

const getStyle = (teamAppearsAs, roleAppearsAs, activeState, player_idx, total_num_players) => {
    let overrideStyle = {};
    overrideStyle['border'] = map_team_to_border[teamAppearsAs];
    overrideStyle['backgroundImage'] = `url(${map_name_to_avatar[roleAppearsAs]})`;
    if (activeState) {
        overrideStyle['boxShadow'] = mapActiveState[activeState];
    }

    let degree_rotation = getDegreeRotation(player_idx, total_num_players);
    overrideStyle['transform'] = `rotate(${degree_rotation}deg) translate(320px) rotate(${-degree_rotation}deg)`;
    return overrideStyle;
};
