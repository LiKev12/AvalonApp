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

    createGame(room_id, is_public, is_rated) {
        if (!this.games_record.has(room_id)) {
            this.games_record.set(room_id, new Game(room_id, is_public, is_rated));
        }
    }

    getLobbyData() {
        // Iterate and get all games that haven't ended yet
        const allGameLobbyData = [];
        Array.from(this.games_record.values()).forEach(game => {
            const gameLobbyData = game.getLobbyData();
            if (!game.hasGameEnded()) {
                allGameLobbyData.push(gameLobbyData);
            }
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
