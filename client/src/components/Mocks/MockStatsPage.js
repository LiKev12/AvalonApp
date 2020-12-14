const getHistoryRow = (time, num_players, role, team, result) => {
    return {
        time,
        num_players,
        role,
        team,
        result
    };
};

const mockStatsIndividualHistoryData = () => {
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

const getOverallRow = (team, games_won, games_played) => {
    return {
        team,
        games_won,
        games_played
    };
};

const mockStatsIndividualOverallData = () => {
    const data = [getOverallRow('TOTAL', 6, 14), getOverallRow('RESISTANCE', 2, 6), getOverallRow('SPY', 4, 8)];
    return data;
};

const getByRoleRow = (team, role, games_won, games_played) => {
    return {
        team,
        role,
        games_won,
        games_played
    };
};
const mockStatsIndividualByRoleData = () => {
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

export const mockStatsPageData = {
    history: mockStatsIndividualHistoryData(),
    overall: mockStatsIndividualOverallData(),
    byRole: mockStatsIndividualByRoleData()
};

const baseMockData = {
    history: {
        record: { FILL: null },
        summary: { FILL: null },
        result: { FILL: null }
    },
    metadata: {
        meta: { FILL: null },
        num_players: 0
    },
    players: [
        { user_id: 'id1', user_name: 'user1' },
        { user_id: 'id2', user_name: 'user2' },
        { user_id: 'id3', user_name: 'user3' },
        { user_id: 'id3', user_name: 'user3' },
        { user_id: 'id3', user_name: 'user3' }
    ],
    winningTeam: 'RESISTANCE'
};
// users: {1,2,3,4,5}
const mockGamesData1 = () => {
    const data = JSON.parse(JSON.stringify(baseMockData));
    data['metadata']['map_id_to_role'] = {
        id1: { role: 'Percival', team: 'RESISTANCE' },
        id2: { role: 'Assassin', team: 'SPY' },
        id3: { role: 'Morgana', team: 'SPY' },
        id4: { role: 'Merlin', team: 'RESISTANCE' },
        id5: { role: 'Loyal Servant', team: 'RESISTANCE' }
    };
    data['players'] = [
        { user_id: 'id1', user_name: 'user1' },
        { user_id: 'id2', user_name: 'user2' },
        { user_id: 'id3', user_name: 'user3' },
        { user_id: 'id4', user_name: 'user4' },
        { user_id: 'id5', user_name: 'user5' }
    ];
    data['date'] = new Date('2020-05-10T00:00:00');
    return data;
};

// users: {1,2,3,4,5}
const mockGamesData2 = () => {
    const data = JSON.parse(JSON.stringify(baseMockData));
    data['metadata']['map_id_to_role'] = {
        id1: { role: 'Merlin', team: 'RESISTANCE' },
        id2: { role: 'Assassin', team: 'SPY' },
        id3: { role: 'Loyal Servant', team: 'RESISTANCE' },
        id4: { role: 'Loyal Servant', team: 'RESISTANCE' },
        id5: { role: 'Loyal Servant', team: 'RESISTANCE' }
    };
    data['players'] = [
        { user_id: 'id1', user_name: 'user1' },
        { user_id: 'id2', user_name: 'user2' },
        { user_id: 'id3', user_name: 'user3' },
        { user_id: 'id4', user_name: 'user4' },
        { user_id: 'id5', user_name: 'user5' }
    ];
    data['winningTeam'] = 'SPY';
    return data;
};

// users: {1,2,3,4,5}
const mockGamesData3 = () => {
    const data = JSON.parse(JSON.stringify(baseMockData));
    data['metadata']['map_id_to_role'] = {
        id1: { role: 'Assassin', team: 'SPY' },
        id2: { role: 'Merlin', team: 'RESISTANCE' },
        id3: { role: 'Loyal Servant', team: 'RESISTANCE' },
        id4: { role: 'Loyal Servant', team: 'RESISTANCE' },
        id5: { role: 'Loyal Servant', team: 'RESISTANCE' }
    };
    data['players'] = [
        { user_id: 'id1', user_name: 'user1' },
        { user_id: 'id2', user_name: 'user2' },
        { user_id: 'id3', user_name: 'user3' },
        { user_id: 'id4', user_name: 'user4' },
        { user_id: 'id5', user_name: 'user5' }
    ];
    return data;
};

// users: {2,3,4,5,6}
const mockGamesData4 = () => {
    const data = JSON.parse(JSON.stringify(baseMockData));
    data['metadata']['map_id_to_role'] = {
        id2: { role: 'Merlin', team: 'RESISTANCE' },
        id3: { role: 'Loyal Servant', team: 'RESISTANCE' },
        id4: { role: 'Loyal Servant', team: 'RESISTANCE' },
        id5: { role: 'Loyal Servant', team: 'RESISTANCE' },
        id6: { role: 'Assassin', team: 'SPY' }
    };
    data['players'] = [
        { user_id: 'id2', user_name: 'user2' },
        { user_id: 'id3', user_name: 'user3' },
        { user_id: 'id4', user_name: 'user4' },
        { user_id: 'id5', user_name: 'user5' },
        { user_id: 'id6', user_name: 'user6' }
    ];
    return data;
};

export const mockGamesData = {
    1: mockGamesData1(),
    2: mockGamesData2(),
    3: mockGamesData3(),
    4: mockGamesData4()
};
