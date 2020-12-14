server_chat_get_lobby = (io, sock, AvalonInstance) => {
    sock.on('server_get_chat_lobby', msg => {
        if (!msg) {
            io.emit('client_get_chat_lobby', AvalonInstance.get()['chats_record']);
            return;
        }
        msg['timestamp'] = getTimestamp();
        AvalonInstance.chat_add_message_lobby(msg);
        io.emit('client_get_chat_lobby', AvalonInstance.get()['chats_record']);
    });
};

/**
 * data: {flag, room, user_name?, msg?}
 */
server_get_chat = (io, sock, Avalon) => {
    sock.on('server_get_chat', data => {
        const room = data.room;
        sock.join(room);

        const flag = data.flag;
        const chat = Avalon.getChat(room);

        switch (flag) {
            case 'get':
                io.to(room).emit('client_get_chat', chat.getMessages());
                return;
            case 'msg':
                // Add message
                const { msg, user_name } = data;
                chat.addMessage(msg, user_name);
                io.to(room).emit('client_get_chat', chat.getMessages());
                return;
            default:
                return;
        }
    });
};

testbuttonserver = (io, sock, Avalon) => {
    sock.on('testbuttonserver', () => {
        sock.emit('testbuttonclient', Avalon.get());
    });
};

module.exports = {
    server_chat_get_lobby,
    server_get_chat,
    testbuttonserver
};
