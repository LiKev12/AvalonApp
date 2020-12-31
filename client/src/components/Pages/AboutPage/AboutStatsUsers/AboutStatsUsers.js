import React from 'react';
import classes from './AboutStatsUsers.module.css';
import PropTypes from 'prop-types';
import { LineChart, Line, Label, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const AboutStatsUsers = props => {
    const { usersOverTimeData } = props;
    return (
        <div className={classes.ChartOuterContainer}>
            <div className={classes.ChartInnerContainer}>
                <LineChart
                    width={800}
                    height={400}
                    data={usersOverTimeData}
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
                        <Label value="Total Users" angle={-90} position="center" dx={-20} />
                    </YAxis>
                    <Line yAxisId="left" type="monotone" dataKey="Total Users" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <YAxis yAxisId="right" orientation="right" allowDecimals={false}>
                        <Label value="New Users" angle={90} position="center" dx={20} />
                    </YAxis>
                    <Line yAxisId="right" type="monotone" dataKey="New Users" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                </LineChart>
            </div>
        </div>
    );
};

AboutStatsUsers.propTypes = {
    usersOverTimeData: PropTypes.array
};

export default AboutStatsUsers;

//http://recharts.org/en-US/examples/BiaxialLineChart
