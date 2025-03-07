import app from "./app.js";
import http from "http";

const server = http.createServer(app);
const Port  = process.env.PORT

server.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`);
})

export default server;