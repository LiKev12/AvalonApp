const map_role_to_team = {
    Merlin: 'RESISTANCE',
    Percival: 'RESISTANCE',
    DrunkMerlin: 'RESISTANCE',
    LoyalServant: 'RESISTANCE',
    Assassin: 'SPY',
    Morgana: 'SPY',
    Oberon: 'SPY',
    Mordred: 'SPY',
    Minion: 'SPY'
};

export const isRolesValid = setup => {
    // 1) Check to see if there is at least 1 RESISTANCE and 1 SPY in the game
    const { roles, num_players } = setup;
    let numResistanceRoles = 0;
    let numSpyRoles = 0;
    roles.forEach(role => {
        if (map_role_to_team[role] === 'RESISTANCE') {
            numResistanceRoles++;
        } else if (map_role_to_team[role] === 'SPY') {
            numSpyRoles++;
        }
    });
    const isTwoTeams = numResistanceRoles > 0 && numSpyRoles > 0;

    // 2) Check to see if less than half (strictly) of the players are SPY
    const isLessThanHalfSPY = numSpyRoles < (num_players + 1) / 2;

    // 3) Check to see if Percival and Morgana are included together (must include Merlin as well)
    let isPercivalAndMorganaValid = true;
    const isPercivalSelected = roles.includes('Percival');
    const isMorganaSelected = roles.includes('Morgana');
    const isMerlinSelected = roles.includes('Merlin');
    if (isPercivalSelected || isMorganaSelected) {
        isPercivalAndMorganaValid = isPercivalSelected && isMorganaSelected && isMerlinSelected;
    }

    // 4) DrunkMerlin can only be included when Merlin is included
    let isDrunkMerlinValid = true;
    const isDrunkMerlinSelected = roles.includes('DrunkMerlin');
    if (isDrunkMerlinSelected) {
        isDrunkMerlinValid = isMerlinSelected;
    }

    const isRolesValidCheck = isTwoTeams && isLessThanHalfSPY && isPercivalAndMorganaValid && isDrunkMerlinValid;
    return isRolesValidCheck;
};

export const isFeaturesValid = setup => {
    return true; // for now, maybe need to limit Excalibur and LOTL
};
