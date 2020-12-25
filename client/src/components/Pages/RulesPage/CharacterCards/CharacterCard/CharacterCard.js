import React from 'react';
import classes from './CharacterCard.module.css';
import PropTypes from 'prop-types';

const CharacterCard = props => {
    const { avatar, name, team, description } = props;
    return (
        <div className={classes.CharacterCardContainer}>
            <div className={classes.CharacterCardImageContainer}>
                <img src={avatar} alt="Avatar" className={classes.CharacterCardImage} />
            </div>
            <div className={classes.CharacterCardTextContainer}>
                <h4>
                    <b>{name}</b>
                </h4>
                <ul>
                    <li key={'team'}>Team: {team}</li>
                    {description.map((descriptionPoint, idx) => (
                        <li key={idx}>{descriptionPoint}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

CharacterCard.propTypes = {
    avatar: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    team: PropTypes.string.isRequired,
    description: PropTypes.array.isRequired
};

export default CharacterCard;
