const { DATABASE_TEST, DATABASE_PROD } = require('./server/constants');
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const http = require('http');
const socketio = require('socket.io');

const app = express();

// Socket
const server = http.createServer(app);
const io = socketio(server);

// Socket listeners
const socketChatListener = require('./server/socket_listeners/chatListener');
const socketGameListener = require('./server/socket_listeners/gameListener');

// Bodyparser Middleware
app.use(express.json());

// DB Config
const db = require('./server/secrets/keys').getMongoURI(DATABASE_TEST);
// const db = config.get('mongoURI');

// Connect to Mongo
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use('/api/items', require('./server/routes/api/items'));
app.use('/api/users', require('./server/routes/api/users'));
app.use('/api/auth', require('./server/routes/api/auth'));
app.use('/api/rooms', require('./server/routes/api/rooms'));
app.use('/api/games', require('./server/routes/api/games'));
app.use('/api/mock_games', require('./server/routes/api/mock_games'));

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server started on port ${port}`));

const AvalonClass = require('./server/core/Avalon');
const Avalon = new AvalonClass();

const players_on_server = [];
io.on('connection', sock => {
    players_on_server.push(sock);
    console.log(`Someone connected. ${players_on_server.length} players on.`);

    socketChatListener.server_get_chat(io, sock, Avalon);
    socketChatListener.testbuttonserver(io, sock, Avalon);

    socketGameListener.server_game_handle_CREATE(io, sock, Avalon);
    socketGameListener.server_game_handle_INITIALIZE(io, sock, Avalon);
    socketGameListener.server_game_handle_SPECTATE(io, sock, Avalon);
    socketGameListener.server_game_handle_ENTER(io, sock, Avalon);
    socketGameListener.server_game_handle_LEAVE(io, sock, Avalon);
    socketGameListener.server_game_handle_LOCK(io, sock, Avalon);
    socketGameListener.server_game_handle_SETUP(io, sock, Avalon);
    socketGameListener.server_game_handle_START(io, sock, Avalon);
    socketGameListener.server_game_handle_SELECT(io, sock, Avalon);
    socketGameListener.server_game_handle_PROPOSE(io, sock, Avalon);
    socketGameListener.server_game_handle_ROUND(io, sock, Avalon);
    socketGameListener.server_game_handle_MISSION(io, sock, Avalon);
    socketGameListener.server_game_handle_ASSASSINATE(io, sock, Avalon);
    socketGameListener.server_game_handle_GIVE_EXCALIBUR(io, sock, Avalon);
    socketGameListener.server_game_handle_USE_EXCALIBUR(io, sock, Avalon);
    socketGameListener.server_game_handle_CONFIRM_EXCALIBUR(io, sock, Avalon);
    socketGameListener.server_game_handle_USE_LOTL(io, sock, Avalon);
    socketGameListener.server_game_handle_CONFIRM_LOTL(io, sock, Avalon);

    socketGameListener.server_game_lobby_data(io, sock, Avalon);
    socketGameListener.server_game_view_data(io, sock, Avalon);

    sock.on('disconnect', () => {
        // TODO: Handle popping off socket users
        console.log('User has left!');
    });
});
