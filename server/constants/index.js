const HOUR = 3600000;
const CLEAN_REQUEST_TIME_CALL = HOUR; // (1hr): CleanRequest is called every hour
const CLEAN_REQUEST_TIME_UPDATE = HOUR; // (1hr): Lobby reflects actual game states every hour
const CLEAN_REQUEST_TIME_AFTER_CREATE = 4 * HOUR; // (4hr): Game gets deleted 4 hours after creation
const CLEAN_REQUEST_TIME_AFTER_END = 0.5 * HOUR; // (30min): Game gets deleted 30 minutes after ending
const CLEAN_REQUEST_TIME_LOBBY_CHAT = 4 * HOUR; //(4hr): Lobby chat gets deleted 4 hours after last message

const ABOUT_START_DATE = '2020-11-01';
const ABOUT_END_DATE = new Date().toISOString().split('T')[0]; // Usually set to today

module.exports = {
    CLEAN_REQUEST_TIME_CALL,
    CLEAN_REQUEST_TIME_UPDATE,
    CLEAN_REQUEST_TIME_AFTER_CREATE,
    CLEAN_REQUEST_TIME_AFTER_END,
    CLEAN_REQUEST_TIME_LOBBY_CHAT,
    ABOUT_START_DATE,
    ABOUT_END_DATE
};
