const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
require('dotenv').config();

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
const dbUsername = process.env.DATABASE_MONGO_URI_TEST_USERNAME;
const dbPassword = process.env.DATABASE_MONGO_URI_TEST_PASSWORD;
const dbName = process.env.DATABASE_MONGO_URI_TEST_DBNAME;
const mongoURI = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0-oqjxe.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// Connect to Mongo
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use('/api/users', require('./server/routes/api/users'));
app.use('/api/auth', require('./server/routes/api/auth'));
app.use('/api/games', require('./server/routes/api/games'));
app.use('/api/ratings', require('./server/routes/api/ratings'));

// Serve static assets if in production
// if (process.env.NODE_ENV === 'production') {
//     // Set static folder
//     app.use(express.static('client/build'));

//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//     });
// }
app.use(express.static('client/build'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server started on port ${port}`));

const AvalonClass = require('./server/core/Avalon');
const Avalon = new AvalonClass();
const CLEAN_TIMER = 3600000; // 1 hour
setInterval(() => Avalon.cleanRequest(), CLEAN_TIMER);

let num_players_on_server = 0;
io.on('connection', sock => {
    num_players_on_server++;
    console.log(`User connected. ${num_players_on_server} users online.`);

    // Socket Listeners: Chat
    socketChatListener.server_get_chat(io, sock, Avalon);

    // Socket Listeners: Game
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

    socketGameListener.server_game_CLEAN_request(io, sock, Avalon);
    socketGameListener.server_game_lobby_data(io, sock, Avalon);
    socketGameListener.server_game_view_data(io, sock, Avalon);

    sock.on('disconnect', () => {
        num_players_on_server--;
        console.log(`User disconnected. ${num_players_on_server} users online.`);
    });
});
