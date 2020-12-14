// Name: 'LoyalServant',
// Sees - highlights
// Knows - name exposed
// Team - Spy or Resistance

let LoyalServant = {
    Name: 'LoyalServant',
    Sees: {},
    Knows: {},
    Team: 'RESISTANCE'
};

let Merlin = {
    Name: 'Merlin',
    Sees: { Minion: 'SPY', Assassin: 'SPY', Oberon: 'SPY', Morgana: 'SPY' },
    Knows: { Oberon: 'Oberon' },
    Team: 'RESISTANCE'
};

let Assassin = {
    Name: 'Assassin',
    Sees: { Minion: 'SPY', Morgana: 'SPY', Mordred: 'SPY' },
    Knows: {},
    Team: 'SPY'
};

let Minion = {
    Name: 'Minion',
    Sees: { Assassin: 'SPY', Morgana: 'SPY', Mordred: 'SPY' },
    Knows: {},
    Team: 'SPY'
};

let Percival = {
    Name: 'Percival',
    Sees: { Merlin: 'RESISTANCE', Morgana: 'RESISTANCE' },
    Knows: { Merlin: 'Merlin', Morgana: 'Merlin' },
    Team: 'RESISTANCE'
};

let Morgana = {
    Name: 'Morgana',
    Sees: { Minion: 'SPY', Assassin: 'SPY', Mordred: 'SPY' },
    Knows: {},
    Team: 'SPY'
};

let Oberon = {
    Name: 'Oberon',
    Sees: {},
    Knows: {},
    Team: 'SPY'
};

let Mordred = {
    Name: 'Mordred',
    Sees: { Assassin: 'SPY', Minion: 'SPY', Morgana: 'SPY' },
    Knows: {},
    Team: 'SPY'
};

module.exports = {
    LoyalServant,
    Merlin,
    Assassin,
    Minion,
    Percival,
    Morgana,
    Oberon,
    Mordred
};
