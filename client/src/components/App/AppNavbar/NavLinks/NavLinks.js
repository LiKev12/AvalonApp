import React from 'react';
import { NavLink } from 'reactstrap';

export function HomeLink() {
    return (
        <div>
            <NavLink href="/">Home</NavLink>
        </div>
    );
}

export function AboutLink() {
    return (
        <div>
            <NavLink href="/about">About</NavLink>
        </div>
    );
}

export function RulesLink() {
    return (
        <div>
            <NavLink href="/rules">Rules</NavLink>
        </div>
    );
}

export function StatsLink() {
    return (
        <div>
            <NavLink href="/stats">Stats</NavLink>
        </div>
    );
}
