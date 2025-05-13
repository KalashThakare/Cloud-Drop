import app from "./app.js";
import http from "http";
import {server} from "../src/lib/socket.js";

const Port  = process.env.PORT

server.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`);
})

export default server;