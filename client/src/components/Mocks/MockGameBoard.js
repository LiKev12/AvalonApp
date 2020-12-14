const getMockBoardPlayerData = (
    user_name,
    isSelected,
    isLeader,
    isHammer,
    isGivenExcalibur,
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
        getMockBoardPlayerData('Player1', true, true, true, true, IS_STILL_VOTING, 'Unknown', 'RESISTANCE'),
        getMockBoardPlayerData('Player2', true, false, false, false, IS_TARGETED_BY_EXCALIBUR, 'Merlin', 'RESISTANCE'),
        getMockBoardPlayerData('Player3', true, false, false, false, IS_TARGETED_BY_ASSASSIN, 'Percival', 'RESISTANCE'),
        getMockBoardPlayerData('Player4', true, false, false, false, null, 'LoyalServant', 'RESISTANCE'),
        getMockBoardPlayerData('Player5', true, false, true, false, null, 'Mordred', 'SPY')
        // getMockBoardPlayerData('id6', 'Player6', true, false, 'SPY', 'Oberon'),
        // getMockBoardPlayerData('id7', 'Player7', true, false, 'SPY', 'Morgana'),
        // getMockBoardPlayerData('id7', 'Player8', true, false, 'SPY', 'Minion'),
        // getMockBoardPlayerData('id7', 'Player9', true, false, 'RESISTANCE', 'LoyalServant'),
        // getMockBoardPlayerData('id7', 'Player10', true, false, 'RESISTANCE', 'LoyalServant'),
        // getMockBoardPlayerData('id7', 'Player11', true, false, 'RESISTANCE', 'LoyalServant'),
        // getMockBoardPlayerData('id7', 'Player12', true, false, 'RESISTANCE', 'LoyalServant')
    ];
};

const getMockMissionTracker = () => {
    return {
        1: { isPassed: null, num_spots_on_mission: 2, num_fails_required: 1 },
        2: { isPassed: null, num_spots_on_mission: 3, num_fails_required: 1 },
        3: { isPassed: null, num_spots_on_mission: 4, num_fails_required: 1 },
        4: { isPassed: null, num_spots_on_mission: 3, num_fails_required: 2 },
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
