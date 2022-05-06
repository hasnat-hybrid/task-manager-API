const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth')


router.post('/tasks', auth, async (req, res) => {

    const task = new Task ({
        ...req.body,
        owner: req.user._id
    });

    try {
        const response = await task.save();
        res.status(201).send(response)
        
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort [parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });
        res.send(req.user.tasks);

    } catch (error) {
        res.status(500).send(error)
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const id = req.params.id;
    
    try {
        const task = await Task.findOne({ _id: id, owner: req.user._id});
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

router.patch('/tasks/:id', auth, async (req, res) => {

    const requested = Object.keys(req.body);
    const updates = ['description', 'completed'];
    const isValidated = requested.every((request) => updates.includes(request));

    if (!isValidated) {
        return res.status(400).send('Invalid Fields!')
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
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

router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
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