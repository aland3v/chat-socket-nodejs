const path = require('path')
const express = require('express');
const app = express();
const SocketIO = require('socket.io');

// settings
app.set('port', process.env.PORT || 3000);

// static files
//app.use(express.static(__dirname + '/public')); en windows \, en linux /, para evitar problemas: path.join
app.use(express.static(path.join(__dirname, 'public')))

// start the server
const server = app.listen(app.get('port'), () =>  {
    console.log('Server on port', app.get('port'));
})

// websockets
const io = SocketIO(server); // io es la conexion

io.on('connection', (socket) => {
    console.log("new connection", socket.id);
    // Recibimos datos y reenviamos a todos los clientes
    socket.on('chat:message', (data) => {
        io.sockets.emit('chat:message', data)
    })

    // emitir a todos excepto yo
    socket.on('chat:typing', (data) => {
        socket.broadcast.emit('chat:typing', data);
    });
});
