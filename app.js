const express = require("express");
const app = express();
const port = 3000;
const userRouter = require('./routers/users')
const boardRouter = require('./routers/boards')

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use("/api", [userRouter])
app.use("/api", [boardRouter])

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
    res.render('login')
})

app.get('/signUp', (req, res)=>{
    res.render('signUp')
})

app.get('/board', (req, res)=>{
    res.render('board')
})

app.get('/detail', (req, res)=>{
    res.render('boardDetail')
})

app.listen(port, ()=>{
    console.log(`listening at http://localhost:${port}`)
})