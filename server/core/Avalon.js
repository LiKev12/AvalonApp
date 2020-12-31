const Chat = require('./chat/Chat');
const Game = require('./game/Game');
const {
    CLEAN_REQUEST_TIME_AFTER_CREATE,
    CLEAN_REQUEST_TIME_AFTER_END,
    CLEAN_REQUEST_TIME_LOBBY_CHAT
} = require('../constants');

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
        // Clean up games
        const current_time = Date.now();
        Array.from(this.games_record.keys()).forEach(room_id => {
            const game = this.games_record.get(room_id);
            const { creation_time, end_time } = game.get();
            const isExpiredAfterCreation =
                creation_time && current_time - creation_time > CLEAN_REQUEST_TIME_AFTER_CREATE && !end_time;
            const isExpiredAfterEnd = end_time && current_time - end_time > CLEAN_REQUEST_TIME_AFTER_END;
            if (isExpiredAfterCreation) {
                console.log('[isExpiredAfterCreation]', room_id);
                game.cleanUpExpiredAfterCreation();
                this.games_record.delete(room_id);
                this.chats_record.delete(room_id);
            } else if (isExpiredAfterEnd) {
                console.log('[isExpiredAfterEnd]', room_id);
                this.games_record.delete(room_id);
                this.chats_record.delete(room_id);
            }
        });

        // Clean up chats in lobby
        const lobbyChat = this.chats_record.get('lobby');
        if (lobbyChat) {
            const { messages } = lobbyChat.get();
            if (messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                const last_lobby_msg_time = lastMessage['time'];
                const isLobbyChatExpired = current_time - last_lobby_msg_time > CLEAN_REQUEST_TIME_LOBBY_CHAT;
                if (isLobbyChatExpired) {
                    this.chats_record.delete('lobby');
                }
            }
        }
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
