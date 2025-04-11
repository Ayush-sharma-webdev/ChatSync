const http = require('http');
const socketIO = require('socket.io');
const app = require('./app');
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server)

let waitingusers = [];
let rooms = {};

io.on('connection' , function(socket){
   socket.on('joinroom' , function(){
    try{
        if(waitingusers.length > 0){
            let partner = waitingusers.shift();
            const roomname = `${socket.id}-${partner.id}`;

            socket.join(roomname);
            partner.join(roomname);

            io.to(roomname).emit('joined',roomname);
        }else{
            waitingusers.push(socket);
        };
    }catch(error){
        throw new Error(error);
    };

    socket.on('signalingMessage' , function(data){
        socket.broadcast.to(data.room).emit('signalingMessage', data.message);
    });

    socket.on('message' , function(data){
        socket.broadcast.to(data.room).emit('message',data.message);
    });

    socket.on('startVideoCall' , function({room}){
        socket.broadcast.to(room).emit('incomingCall');
    });

    socket.on('acceptCall' , function({room}){
        socket.broadcast.to(room).emit('callAccepted');
    });

    socket.on('rejectCall', function({room}){
        socket.broadcast.to(room).emit('callRejected');
    });
   });
   socket.on('disconnect' , function(){
    let index = waitingusers.findIndex((waitingUsers)=> waitingUsers.id === socket.id);
    waitingusers.splice(index,1);
    });

})

server.listen( PORT , ()=>{
    console.log(`Server is running on PORT NO : ${PORT}`);
}); 