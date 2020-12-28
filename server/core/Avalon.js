const Chat = require('./chat/Chat');
const Game = require('./game/Game');

class Avalon {
    constructor() {
        this.games_record = new Map();
        this.chats_record = new Map();
    }

    getChat(room_id) {
        if (!this.chats_record.has(room_id)) {
            this.chats_record.set(room_id, new Chat(room_id));
        }
        return this.chats_record.get(room_id);
    }

    getGame(room_id) {
        return this.games_record.get(room_id);
    }

    createGame(room_id, room_pwd, is_public, is_rated) {
        // Ensures that a game with the same ID as another active game won't be created
        if (!this.games_record.has(room_id)) {
            this.games_record.set(room_id, new Game(room_id, room_pwd, is_public, is_rated));
        }
    }

    /**
     * Automatically cleans up games
     * Delete game if :
     * - creation_time was over a day ago
     * - end_time was over half an hour ago
     */
    cleanRequest() {
        Array.from(this.games_record.keys()).forEach(room_id => {
            const game = this.games_record.get(room_id);
            const { creation_time, end_time } = game.get();

            const CREATION_TIME_BUFFER = 86400000; // 1 day
            const END_TIME_BUFFER = 1800000; // 30 minutes
            const current_time = Date.now();

            const expiredAfterCreation =
                creation_time && current_time - creation_time > CREATION_TIME_BUFFER && !end_time; // long time since creation AND no end time set
            const expiredAfterEnd = end_time && current_time - end_time > END_TIME_BUFFER; //
            if (expiredAfterCreation) {
                console.log('[expiredAfterCreation]', room_id);
                game.cleanUpExpiredAfterCreation();
                this.games_record.delete(room_id);
            } else if (expiredAfterEnd) {
                console.log('[expiredAfterEnd]', room_id);
                this.games_record.delete(room_id);
            }
        });
    }

    getLobbyData() {
        // Iterate and get all games (including those that finished)
        const allGameLobbyData = [];
        Array.from(this.games_record.values()).forEach(game => {
            const gameLobbyData = game.getLobbyData();
            allGameLobbyData.push(gameLobbyData);
        });

        // Sort by creation date
        allGameLobbyData.sort((gameA, gameB) => gameB.creation_time - gameA.creation_time);
        return allGameLobbyData;
    }

    get() {
        return {
            games_record: Object.fromEntries(this.games_record),
            chats_record: Object.fromEntries(this.chats_record)
        };
    }
}

module.exports = Avalon;
