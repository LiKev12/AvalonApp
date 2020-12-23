const getMockBoardPlayerData = (
    user_name,
    isSelected,
    isLeader,
    isHammer,
    isGivenExcalibur,
    isGivenLady,
    activeState,
    roleAppearsAs,
    teamAppearsAs
) => {
    return {
        user_name,
        isSelected,
        isLeader,
        isHammer,
        isGivenExcalibur,
        isGivenLady,
        activeState,
        roleAppearsAs,
        teamAppearsAs
    };
};

const IS_STILL_VOTING = 'IS_STILL_VOTING';
const IS_TARGETED_BY_EXCALIBUR = 'IS_TARGETED_BY_EXCALIBUR';
const IS_TARGETED_BY_ASSASSIN = 'IS_TARGETED_BY_ASSASSIN';

const getMockBoard = () => {
    return [
        getMockBoardPlayerData('P1', true, true, true, true, true, IS_STILL_VOTING, 'Unknown', 'RESISTANCE'),
        getMockBoardPlayerData('P2', true, false, false, false, true, IS_TARGETED_BY_EXCALIBUR, 'Merlin', 'RESISTANCE'),
        getMockBoardPlayerData('P3', true, true, true, false, false, IS_TARGETED_BY_ASSASSIN, 'Percival', 'RESISTANCE'),
        getMockBoardPlayerData('P4', true, false, false, false, false, null, 'LoyalServant', 'RESISTANCE'),
        getMockBoardPlayerData('P5', true, true, true, false, false, null, 'Mordred', 'SPY'),
        getMockBoardPlayerData('P6', true, false, true, false, false, null, 'Oberon', 'SPY'),
        getMockBoardPlayerData('P7', true, false, true, false, false, null, 'Morgana', 'SPY'),
        getMockBoardPlayerData('P8', true, true, false, false, true, null, 'Minion', 'SPY'),
        getMockBoardPlayerData('P9', true, false, true, false, false, null, 'LoyalServant', 'RESISTANCE'),
        getMockBoardPlayerData('P10', true, false, false, false, false, null, 'LoyalServant', 'RESISTANCE')
        // getMockBoardPlayerData('P11', true, false, true, false, false, null, 'LoyalServant', 'RESISTANCE'),
        // getMockBoardPlayerData('P12', true, false, true, false, true, null, 'LoyalServant', 'RESISTANCE')
    ];
};

const getMockMissionTracker = () => {
    return {
        1: { isPassed: true, num_spots_on_mission: 2, num_fails_required: 1 },
        2: { isPassed: true, num_spots_on_mission: 3, num_fails_required: 1 },
        3: { isPassed: false, num_spots_on_mission: 4, num_fails_required: 1 },
        4: { isPassed: false, num_spots_on_mission: 3, num_fails_required: 2 },
        5: { isPassed: null, num_spots_on_mission: 4, num_fails_required: 1 }
    };
};

export const mockGameBoardData = {
    onClickPlayerCard: () => {},
    onHandleButtonClick: () => {},
    board: getMockBoard(),
    button: 'propose',
    team: 'SPY',
    MISSION_TRACKER: getMockMissionTracker(),
    ROUND_TRACKER: 1
};
