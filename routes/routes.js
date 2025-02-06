const express = require('express');
const router = express.Router();
const Model = require('../models/models');

router.post('/post', async (req,res) =>{
    const dataTosave = new Model({
        book:req.body.book
    })
    try{
        const data =  await dataTosave.save()
        res.status(200).json(data)
    }
    catch{
        res.status(400).json({message:error.message})
    }
})

router.get('/getAll', async (req,res) =>{
    try{
        const data = await Model.find();
        res.status(200).json(data);
    }
    catch{
        res.status(400).json({message:error.message})
    }
})

router.patch('/update/:id', async (req,res) =>{
    try{
        const id = req.params.id;
        const updated = req.body;
        const options = {new:true}
        const data = await Model.findByIdAndUpdate(id,updated,options);
        res.send(data)
    }
    catch{
        res.status(400).json({message:error.message})
    }
})
router.delete('/delete/:id', async (req,res) =>{
    try{
        const id = req.params.id
        const data = await Model.findByIdAndDelete(id);
        res.send(`data is deleted ${id.email}`)
    }
    catch{
        res.status(400).json({message:error.message})
    }
})

module.exports = router;