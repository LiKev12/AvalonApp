import React from 'react';
import { NavLink } from 'reactstrap';

export function HomeLink() {
    return (
        <div>
            <NavLink href='/AvalonApp/#'>Home</NavLink>
        </div>
    );
}

export function AboutLink() {
    return (
        <div>
            <NavLink href='/AvalonApp/#/about'>About</NavLink>
        </div>
    );
}

export function RulesLink() {
    return (
        <div>
            <NavLink href='/AvalonApp/#/rules'>Rules</NavLink>
        </div>
    );
}

export function StatsLink() {
    return (
        <div>
            <NavLink href='/AvalonApp/#/stats'>Stats</NavLink>
        </div>
    );
}
