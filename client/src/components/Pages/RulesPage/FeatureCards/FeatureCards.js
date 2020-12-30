import React from 'react';
import FeatureCard from './FeatureCard/FeatureCard';

const FeatureCards = () => {
    const featureCardsProps = getFeatureCardsProps();
    return (
        <div>
            {featureCardsProps.map(featureCardProps => (
                <FeatureCard {...featureCardProps} />
            ))}
        </div>
    );
};

export default FeatureCards;

const getFeatureCardsProps = () => [
    {
        name: 'Excalibur',
        description: [
            'Leader chooses a member of the proposed team to grant the power of Excalibur',
            'If the team is approved, the player granted Excalibur can choose to flip the vote of a target player after the mission',
            'If the player granted Excalibur chooses to use Excalibur, the player can see the original vote of the target player'
        ]
    },
    {
        name: 'Lady of the Lake',
        description: [
            'At the start of the game, the Lady of the Lake token is granted to the player sitting to the right of the leader',
            'At the end of missions 2, 3, and 4, the player granted the Lady of the Lake selects a player in the game to inquisit',
            'The player inquisited by the Lady of the Lake must reveal their true team to the granted player',
            'No player who used Lady of the Lake may have Lady of the Lake used on them'
        ]
    },
    {
        name: 'Public vs. Private Games',
        description: [
            'Ongoing public games and private games are both shown in the main lobby',
            'Private games require a password to enter',
            'Spectators may spectate both public and private games (can spectate private games if they have the password)'
        ]
    },
    {
        name: 'Rated Games',
        description: [
            'Setting the game as "Rated" will affect every player in the game',
            'Rating system is based on the ELO system, using the average ELO of each team',
            'Rated games that are abandoned will negatively impact the ELO of players of both teams'
        ]
    }
];
