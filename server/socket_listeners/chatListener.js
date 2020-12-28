/**
 * data: {flag, room, user_name?, msg?}
 */
server_get_chat = (io, sock, Avalon) => {
    sock.on('server_get_chat', data => {
        const { room, flag } = data;
        sock.join(room);
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

module.exports = {
    server_get_chat
};
