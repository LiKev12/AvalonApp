import React from 'react';
import classes from './AboutStatsGames.module.css';

import { LineChart, Line, Label, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const AboutStatsGames = props => {
    const { gamesOverTimeData } = props;
    return (
        <div className={classes.ChartOuterContainer}>
            <div className={classes.ChartInnerContainer}>
                <LineChart
                    width={800}
                    height={400}
                    data={gamesOverTimeData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Date"></XAxis>
                    <YAxis yAxisId="left" allowDecimals={false}>
                        <Label value="Total Games" angle={-90} position="center" dx={-20} />
                    </YAxis>
                    <Line yAxisId="left" type="monotone" dataKey="Total Games" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <YAxis yAxisId="right" orientation="right" allowDecimals={false}>
                        <Label value="New Games" angle={90} position="center" dx={20} />
                    </YAxis>
                    <Line yAxisId="right" type="monotone" dataKey="New Games" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                </LineChart>
            </div>
        </div>
    );
};

export default AboutStatsGames;
