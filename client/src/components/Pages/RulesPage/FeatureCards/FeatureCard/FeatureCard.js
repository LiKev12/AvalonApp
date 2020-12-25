import React from 'react';
import classes from './FeatureCard.module.css';
import PropTypes from 'prop-types';

const FeatureCard = props => {
    const { name, description } = props;
    return (
        <div className={classes.FeatureCardContainer}>
            <div className={classes.FeatureCardHeaderContainer}>
                {/* <img src={avatar} alt="Avatar" className={classes.CharacterCardImage} /> */}
                {/* <div>Excalibur</div> */}
                <h1>{name}</h1>
            </div>
            <div className={classes.FeatureCardTextContainer}>
                <ul>
                    {description.map((descriptionPoint, idx) => (
                        <li key={idx}>{descriptionPoint}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

FeatureCard.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.array.isRequired
};

export default FeatureCard;
