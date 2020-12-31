class Chat {
    constructor(room) {
        this.room = room;
        this.messages = [];
    }

    addMessage(message, user_name) {
        const messageObj = {
            message,
            user_name,
            time: new Date()
        };
        this.messages.push(messageObj);
    }

    getMessages() {
        // return the last 24 hour messages
        const firstMessageIdx = this._getIdxOfTopMessage();
        return this.messages.slice(firstMessageIdx).map(msgObj => {
            const newMsgObj = {
                message: msgObj.message,
                user_name: msgObj.user_name,
                timestamp: this._getReadableTimestamp(msgObj.time)
            };
            return newMsgObj;
        });
    }

    _getIdxOfTopMessage() {
        // Only get last 30 messages
        const idx = Math.max(this.messages.length - 30, 0);
        return idx;
    }

    _getReadableTimestamp(dateTime) {
        const hours = this._formatDateToString(dateTime.getHours());
        const minutes = this._formatDateToString(dateTime.getMinutes());
        const res = `[${hours}:${minutes}] `;
        return res;
    }

    _formatDateToString = before => {
        return before.toString().length === 1 ? '0' + before.toString() : before.toString();
    };

    get() {
        return this;
    }
}

// Make this a queue of last 24 hours

module.exports = Chat;
