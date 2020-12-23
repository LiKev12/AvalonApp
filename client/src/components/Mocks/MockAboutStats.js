const getRowAboutStats = (date, num_games_played, num_users) => {
    return {
        Date: date,
        'Games Played': num_games_played,
        Users: num_users
    };
};

// by day

export const mockAboutStatsData = [
    getRowAboutStats('2020-12-05', 1, 6),
    getRowAboutStats('2020-12-06', 2, 10),
    getRowAboutStats('2020-12-07', 4, 12),
    getRowAboutStats('2020-12-08', 5, 13),
    getRowAboutStats('2020-12-09', 7, 16),
    getRowAboutStats('2020-12-10', 11, 29),
    getRowAboutStats('2020-12-11', 15, 42),
    getRowAboutStats('2020-12-12', 25, 53),
    getRowAboutStats('2020-12-13', 37, 72)
];
