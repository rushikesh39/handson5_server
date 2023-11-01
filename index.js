
const express=require("express")
const socket=require("socket.io")
// const cors=require("cors")
const app =express();

const server=app.listen(5000,()=>{
    console.log("server started on port 5000")
})

const io=socket(server,{
    cors:{
        origin:"*",
    }
})
io.on("connection",(socketClient)=>{
    console.log(socketClient.id)
    socketClient.on("MESSAGE",(clientdata)=>{
        console.log(clientdata)
        socketClient.emit("MESSAGE",`message:-${clientdata}`)
    })
    socketClient.on('BROADCAST',(clientBroadcast)=>{
        console.log(clientBroadcast)
        io.emit("sendBroadcastmsg",`Broadcast message:- ${clientBroadcast}`)
    })
    socketClient.on("room",(ClientRoom)=>{
        console.log(ClientRoom)
        socketClient.join(ClientRoom)
        socketClient.emit("JoinSuccess",`member:-${ClientRoom} ${socketClient.id}`)
        socketClient.on("room",(clientdata)=>{
            io.to(ClientRoom).emit("room",`group name:- ${clientdata} ${socketClient.id}`)
        })
        socketClient.on("groupChat",(data)=>{
            io.to(ClientRoom).emit("groupChat",`group message:- ${data}`)
        })
    })
})
app.get("/",(req,res)=>{
    res.send("Home page")
})

