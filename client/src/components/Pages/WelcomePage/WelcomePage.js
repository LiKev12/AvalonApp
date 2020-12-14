import React from 'react';

import classes from './WelcomePage.module.css';

import { mockGameBoardData } from '../../Mocks/MockGameBoard';
import GameBoard from '../../GameRoom/GameBoard/GameBoard';
const welcomePage = () => {
    return (
        // <div className={classes.WelcomePage}>
        //     <div className={classes.InnerContainer}>
        //         <br></br>
        //         <br></br>
        //         <br></br>
        //         <br></br>
        //         <br></br>
        //         <div className={classes.InnerText}>
        //             Welcome to The Resistance: Avalon.
        //             <br></br>
        //             <div className={classes.SubText}>Please register and log in to play.</div>
        //         </div>
        //     </div>
        // </div>
        <div>
            <GameBoard {...mockGameBoardData} />
        </div>
    );
};

export default welcomePage;
