const LoyalServant = {
    Name: 'Loyal Servant',
    Sees: {},
    Knows: {},
    Team: 'RESISTANCE'
};

const Merlin = {
    Name: 'Merlin',
    Sees: { Minion: 'SPY', Assassin: 'SPY', Oberon: 'SPY', Morgana: 'SPY' },
    Knows: { Oberon: 'Oberon' },
    Team: 'RESISTANCE'
};

const Assassin = {
    Name: 'Assassin',
    Sees: { Minion: 'SPY', Morgana: 'SPY', Mordred: 'SPY' },
    Knows: {},
    Team: 'SPY'
};

const Minion = {
    Name: 'Minion',
    Sees: { Assassin: 'SPY', Morgana: 'SPY', Mordred: 'SPY' },
    Knows: {},
    Team: 'SPY'
};

const Percival = {
    Name: 'Percival',
    Sees: { Merlin: 'RESISTANCE', Morgana: 'RESISTANCE' },
    Knows: { Merlin: 'Merlin', Morgana: 'Merlin' },
    Team: 'RESISTANCE'
};

const Morgana = {
    Name: 'Morgana',
    Sees: { Minion: 'SPY', Assassin: 'SPY', Mordred: 'SPY' },
    Knows: {},
    Team: 'SPY'
};

const Oberon = {
    Name: 'Oberon',
    Sees: {},
    Knows: {},
    Team: 'SPY'
};

const Mordred = {
    Name: 'Mordred',
    Sees: { Assassin: 'SPY', Minion: 'SPY', Morgana: 'SPY' },
    Knows: {},
    Team: 'SPY'
};

const DrunkMerlin = {
    Name: 'Drunk Merlin',
    Sees: {}, // Sees the same number of SPIES as Merlin does in any setup
    Knows: {},
    Team: 'RESISTANCE'
};

module.exports = {
    Assassin,
    LoyalServant,
    Merlin,
    Minion,
    Mordred,
    Morgana,
    Percival,
    Oberon,
    DrunkMerlin
};
