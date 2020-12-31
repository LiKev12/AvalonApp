import React from 'react';
import classes from './CharacterCards.module.css';

import {
    Assassin,
    DrunkMerlin,
    LoyalServant,
    Merlin,
    Minion,
    Mordred,
    Morgana,
    Oberon,
    Percival
} from '../../../../media/RoleAvatars';
import CharacterCard from './CharacterCard/CharacterCard';

const CharacterCards = () => {
    const characterCardsProps = getCharacterCardsProps();
    return (
        <div className={classes.CharacterCardsContainer}>
            {characterCardsProps.map(characterCardProps => (
                <CharacterCard {...characterCardProps} />
            ))}
        </div>
    );
};

export default CharacterCards;

const getCharacterCardsProps = () => [
    {
        avatar: LoyalServant,
        name: 'Loyal Servant',
        team: 'Resistance',
        description: ['Has no special powers']
    },
    {
        avatar: Merlin,
        name: 'Merlin',
        team: 'Resistance',
        description: ['Sees all Spies except for Mordred', 'Must stay discrete to Spies']
    },
    {
        avatar: Percival,
        name: 'Percival',
        team: 'Resistance',
        description: ['Sees both Merlin and Morgana as possibly Merlin', 'Must stay vigilant and careful']
    },
    {
        avatar: Minion,
        name: 'Minion',
        team: 'Spy',
        description: ['No extra powers beyond seeing other Spies (besides Oberon)']
    },
    {
        avatar: Assassin,
        name: 'Assassin',
        team: 'Spy',
        description: ['Decides who to assassinate at the end of the game']
    },
    {
        avatar: Morgana,
        name: 'Morgana',
        team: 'Spy',
        description: ['Seen by Percival as a potential Merlin', 'Must try to deceive Percival']
    },
    {
        avatar: Mordred,
        name: 'Mordred',
        team: 'Spy',
        description: ['Remains hidden to Merlin', 'Must try to pass off as Resistance']
    },
    {
        avatar: Oberon,
        name: 'Oberon',
        team: 'Spy',
        description: ['Remains hidden to other Spies but is known by Merlin', 'A wildcard to add extra chaos']
    },
    {
        avatar: DrunkMerlin,
        name: 'Drunk Merlin',
        team: 'Resistance',
        description: ['Sees himself as Merlin', 'Sees the same number of Spies as Merlin', 'Maximum chaos']
    }
];
