const mockRoundObj1 = {
    leader: 0,
    team: [true, false, true, false, false],
    votesRound: [true, false, true, false, true]
};

const mockRoundObj2 = {
    leader: 1,
    team: [false, true, false, true, false],
    votesRound: [true, true, true, true, true]
};

const mockRoundObj3 = {
    leader: 2,
    team: [true, true, false, false, true],
    votesRound: [false, false, false, false, false]
};

export const mockVotingRecord = {
    players: ['user1', 'user2', 'user3', 'user4', 'user5'],
    record: {
        1: { 1: mockRoundObj1, 2: mockRoundObj2, 3: mockRoundObj3, 4: null, 5: null },
        2: { 1: mockRoundObj2, 2: mockRoundObj1, 3: mockRoundObj3, 4: null, 5: null },
        3: { 1: mockRoundObj2, 2: mockRoundObj3, 3: mockRoundObj1, 4: null, 5: null },
        4: { 1: mockRoundObj3, 2: mockRoundObj2, 3: mockRoundObj1, 4: null, 5: null },
        5: { 1: mockRoundObj1, 2: mockRoundObj3, 3: mockRoundObj2, 4: null, 5: null }
    }
};
