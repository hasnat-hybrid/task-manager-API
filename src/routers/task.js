const express = require('express');
const router = new express.Router();
const Task = require('../models/task');

router.post('/tasks', async (req, res) => {

    const task = new Task (req.body);

    try {
        const response = await task.save();
        res.status(201).send(response)
        
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/tasks', async (req, res) => {

    try {
        const response = await Task.find({});
        res.send(response);

    } catch (error) {
        res.status(500).send(error)
    }
});

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    
    try {
        const task = await Task.findById(_id);
        res.send(task);

    } catch (error) {
        if (error.name == 'CastError') {
            return res.status(404).send()
        }
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', async (req, res) => {

    const requested = Object.keys(req.body);
    const updates = ['description', 'completed'];
    const isValidated = requested.every((request) => updates.includes(request));

    if (!isValidated) {
        return res.status(400).send('Invalid Fields!')
    }

    try {
        const task = await Task.findById(req.params.id)
        requested.forEach((request) => task[request] = req.body[request])

        await task.save();
        res.send(task);

    } catch (error) {
        if (error.name == 'CastError') {
            return res.status(404).send()
        }
        return res.status(500).send(error)
    }
})

router.delete('/tasks/:id', async (req, res) => {

    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send()
        }
        res.send(task);

    } catch (error) {
        if (error.name == 'CastError') {
            return res.status(404).send()
        }
        res.status(500).send(error)
    }
})

module.exports = router;