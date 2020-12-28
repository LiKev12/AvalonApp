const getRowAboutStatsUsers = (date, newUsers, totalUsers) => {
    return {
        Date: date,
        'New Users': newUsers,
        'Total Users': totalUsers
    };
};

const getRowAboutStatsGames = (date, newGames, totalGames) => {
    return {
        Date: date,
        'New Games': newGames,
        'Total Games': totalGames
    };
};

export const mockAboutStatsUsersData = [
    getRowAboutStatsUsers('2020-12-05', 1, 6),
    getRowAboutStatsUsers('2020-12-06', 2, 10),
    getRowAboutStatsUsers('2020-12-07', 4, 12),
    getRowAboutStatsUsers('2020-12-08', 5, 13),
    getRowAboutStatsUsers('2020-12-09', 7, 16),
    getRowAboutStatsUsers('2020-12-11', 15, 42),
    getRowAboutStatsUsers('2020-12-12', 25, 53),
    getRowAboutStatsUsers('2020-12-13', 37, 72)
];

export const mockAboutStatsGamesData = [
    getRowAboutStatsGames('2020-12-05', 1, 6),
    getRowAboutStatsGames('2020-12-06', 2, 10),
    getRowAboutStatsGames('2020-12-07', 4, 12),
    getRowAboutStatsGames('2020-12-08', 5, 13),
    getRowAboutStatsGames('2020-12-10', 11, 29),
    getRowAboutStatsGames('2020-12-11', 15, 42),
    getRowAboutStatsGames('2020-12-12', 25, 53),
    getRowAboutStatsGames('2020-12-13', 37, 72)
];

export const getDataWithPaddedDates = dataOverTime => {
    // Sanity check
    if (!dataOverTime || (dataOverTime && dataOverTime.length === 0)) {
        return [];
    }
    if (dataOverTime.length === 1) {
        return dataOverTime;
    }

    // 1) Get all dates in between
    const startDate = dataOverTime[0]['Date'];
    const endDate = dataOverTime[dataOverTime.length - 1]['Date'];
    const arrInBetweenDates = getArrInBetweenDates(startDate, endDate);

    // 2) Add all the dates in between that are not in original array
    const setOfIncludedDates = new Set(dataOverTime.map(singleDayData => singleDayData.Date));
    arrInBetweenDates.forEach(inBetweenDate => {
        if (!setOfIncludedDates.has(inBetweenDate)) {
            dataOverTime.push({ Date: inBetweenDate, 'New Games': 0 });
        }
    });

    // 3) Sort the dataOverTime array with the additional inbetween dates
    dataOverTime.sort((dataDayA, dataDayB) => dataDayA.Date.localeCompare(dataDayB.Date));
    return dataOverTime;
};

const getArrInBetweenDates = (startDate, endDate) => {
    const arrInBetweenDates = [];
    let nextDate = getNextDateYMD(startDate);
    arrInBetweenDates.push(nextDate);
    while (nextDate !== endDate) {
        nextDate = getNextDateYMD(nextDate);
        arrInBetweenDates.push(nextDate);
    }
    return arrInBetweenDates;
};

const getNextDateYMD = dateYMD => {
    const date = getDateFromYMD(dateYMD);
    date.setDate(date.getDate() + 1);
    const nextDateYMD = getYMDFromDate(date);
    return nextDateYMD;
};

const getDateFromYMD = ymd => {
    const year = ymd.substring(0, 4);
    const month = ymd.substring(5, 7);
    const day = ymd.substring(8, 10);
    const date = new Date(year, month - 1, day);
    return date;
};

const getYMDFromDate = date => {
    const ymd = new Date(date).toISOString().split('T')[0];
    return ymd;
};
