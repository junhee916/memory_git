const express = require('express')
const app = express()
const port = 3000

const connect = require('./schemas')
connect()

const boardRouter = require("./routers/board");

//body
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//router 
app.use("/api", [boardRouter]);

// ejs setting
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')

app.get('/', (req, res)=> {
    res.render('main')
})

app.get('/search', (req, res)=> {
    res.render('search')
})

app.get('/detail', (req, res)=>{
    res.render('detail')
})


app.listen(port, ()=>{
    console.log(`listening at http://localhost:${port}`)
})