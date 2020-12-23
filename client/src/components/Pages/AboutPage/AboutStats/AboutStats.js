import React, { Component } from 'react';
import classes from './AboutStats.module.css';
import { LineChart, Line, Label, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

import { mockAboutStatsData } from '../../../Mocks/MockAboutStats';

class AboutStats extends Component {
    // 1) Handle empty data (graph looks weird)
    //
    render() {
        return <div className={classes.ChartOuterContainer}>{renderLineChart}</div>;
    }
}

export default AboutStats;

const renderLineChart = (
    <div className={classes.ChartInnerContainer}>
        <LineChart
            width={800}
            height={400}
            data={mockAboutStatsData}
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
                <Label value="Total Number Users" angle={-90} position="center" dx={-20} />
            </YAxis>
            <YAxis yAxisId="right" orientation="right" allowDecimals={false}>
                <Label value="Total Games Played" angle={90} position="center" dx={20} />
            </YAxis>
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="Users" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line yAxisId="right" type="monotone" dataKey="Games Played" stroke="#82ca9d" />
        </LineChart>
    </div>
);

//http://recharts.org/en-US/examples/BiaxialLineChart
