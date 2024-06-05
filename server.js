import express from "express";

const server = express();
server.all('/', (req, res)=>{
    res.send('Your code is alive!')
})
function keepAlive(){
    server.listen(3000, ()=>{console.log("Server is Ready!")});
}
export default keepAlive;
