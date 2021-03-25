const express = require("express")
const Boards = require("../schemas/board")
const router = express.Router()

router.post('/boards', async(req, res)=> {
    console.log(req.body)

    const {title, name, password, memo, date} = req.body;

    let boardId = await Boards.find({}).sort("-boardId").limit(1); 
    if (boardId.length == 0) { boardId = 1 } 
    else { boardId = boardId[0]['boardId'] + 1; }

    await Boards.create({boardId, title, name, password, memo, date})

    res.send({result: "success"})
})

router.get('/board', async(req, res)=> {
    try{
        const boards = await Boards.find({}).sort("-date").limit(4);
        console.log(boards)
        res.json({boards: boards})

    }catch (err){
        console.error(err);
        next(err);
    }
})

router.get('/board/:boardId', async(req, res)=>{
    const {boardId} = req.params;
    board = await Boards.findOne({boardId: boardId});
    console.log(board)

    res.json({detail: board})
})

router.post("/board/:boardId", async(req, res)=>{
    try{
        const {boardId} = req.params;
        const {title, name, memo, password} = req.body;
        console.log(password)
    
        const isBoardInDetail = await Boards.find({boardId, password});

        if(isBoardInDetail.length > 0){
            await Boards.updateOne({boardId}, {$set: {title, name, memo}})
            res.send({result: "success"})
        }
        else{
            res.send({result:"비밀번호가 틀렸습니다."})
        }
        
    }catch(err){
        
    }

})

router.post("/board/:boardId/delete", async(req, res)=>{
    try{
        const {boardId} = req.params;
        const {password} = req.body;

        const isBoardInDetail = await Boards.find({boardId, password});

        if(isBoardInDetail.length > 0){
            await Boards.deleteOne({boardId})
            res.send({result: "success"})
        }
        else{
            res.send({result:"비밀번호가 틀렸습니다."})
        }
    }catch(err){

    }

})

module.exports = router;