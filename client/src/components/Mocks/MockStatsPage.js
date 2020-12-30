const getMockStatsIndividualHistoryData = () => {
    const SECONDS_IN_DAY = 86400000;
    const data = [
        getHistoryRow(new Date(Date.now() - 0 * SECONDS_IN_DAY), 5, 'Loyal Servant', 'RESISTANCE', 'WIN'),
        getHistoryRow(new Date(Date.now() - 1 * SECONDS_IN_DAY), 6, 'Merlin', 'RESISTANCE', 'LOSS'),
        getHistoryRow(new Date(Date.now() - 2 * SECONDS_IN_DAY), 7, 'Morgana', 'SPY', 'WIN'),
        getHistoryRow(new Date(Date.now() - 3 * SECONDS_IN_DAY), 5, 'Assassin', 'SPY', 'LOSS'),
        getHistoryRow(new Date(Date.now() - 4 * SECONDS_IN_DAY), 5, 'Percival', 'RESISTANCE', 'WIN')
    ];
    return data;
};

const getMockStatsIndividualOverallData = () => {
    const data = [getOverallRow('TOTAL', 6, 14), getOverallRow('RESISTANCE', 2, 6), getOverallRow('SPY', 4, 8)];
    return data;
};
const getMockStatsIndividualByRoleData = () => {
    const data = [
        getByRoleRow('RESISTANCE', 'Drunk Merlin', 1, 1),
        getByRoleRow('RESISTANCE', 'Loyal Servant', 1, 1),
        getByRoleRow('RESISTANCE', 'Merlin', 1, 2),
        getByRoleRow('RESISTANCE', 'Percival', 0, 1),
        getByRoleRow('SPY', 'Assassin', 1, 1),
        getByRoleRow('SPY', 'Minion', 0, 1),
        getByRoleRow('SPY', 'Mordred', 0, 1),
        getByRoleRow('SPY', 'Morgana', 2, 3),
        getByRoleRow('SPY', 'Oberon', 0, 1)
    ];
    return data;
};

const mockHeadToHead = () => [
    {
        Player: 'PlayerX',
        Same: { 'Your Games Won': 5, 'Total Games Played': 9 },
        Different: { 'Your Games Won': 4, 'Total Games Played': 5 }
    },
    {
        Player: 'PlayerY',
        Same: { 'Your Games Won': 7, 'Total Games Played': 7 },
        Different: { 'Your Games Won': 3, 'Total Games Played': 4 }
    },
    {
        Player: 'PlayerZ',
        Same: { 'Your Games Won': 6, 'Total Games Played': 9 },
        Different: { 'Your Games Won': 2, 'Total Games Played': 2 }
    }
];

export const mockStatsPageData = {
    history: getMockStatsIndividualHistoryData(),
    overall: getMockStatsIndividualOverallData(),
    byRole: getMockStatsIndividualByRoleData(),
    headToHead: mockHeadToHead()
};

const getHistoryRow = (time, num_players, role, team, result) => {
    return {
        time,
        num_players,
        role,
        team,
        result
    };
};

const getOverallRow = (team, games_won, games_played) => {
    return {
        team,
        games_won,
        games_played
    };
};

const getByRoleRow = (team, role, games_won, games_played) => {
    return {
        team,
        role,
        games_won,
        games_played
    };
};
