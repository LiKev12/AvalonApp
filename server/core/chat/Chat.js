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
        const idx = Math.max(this.messages.length - 30, 0);
        return idx;
    }

    _getReadableTimestamp(dateTime) {
        // const month = this._formatDateToString(dateTime.getMonth() + 1);
        // const day = this._formatDateToString(dateTime.getDate());
        // const year = dateTime.getFullYear();
        const hours = this._formatDateToString(dateTime.getHours());
        const minutes = this._formatDateToString(dateTime.getMinutes());
        // const seconds = this._formatDateToString(dateTime.getSeconds());

        // const res = `[${year}/${month}/${day} @ ${hours}:${minutes}:${seconds}] `;
        const res = `[${hours}:${minutes}] `;
        return res;
    }

    _formatDateToString = before => {
        return before.toString().length === 1 ? '0' + before.toString() : before.toString();
    };
}

// Make this a queue of last 24 hours

module.exports = Chat;
