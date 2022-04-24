const express = require('express');
const User = require('../models/user');
const router = new express.Router()
const auth = require('../middleware/auth')


router.post('/users/signup', async (req, res) => {

    const user = new User(req.body);
    
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user, token})
        
    } catch (error) {
        res.status(400).send(error) 
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter((arrayOfTokens) => {
            return arrayOfTokens.token !== req.token;
        })

        await req.user.save()
        res.send()
        
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
});

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        res.send(user);

    } catch (error) {
        if (error.name == 'CastError') {
            return res.status(404).send();
         }
            res.status(500).send(error)
    }
})

router.patch('/users/:id', async (req, res) => {

    const requested = Object.keys(req.body);
    const allowed = ['name', 'email', 'password'];
    const isValidated = requested.every((request) => allowed.includes(request));

    if (!isValidated) {
        return res.status(400).send('Invalid Fields!')
    }

    try {
        const user = await User.findById(req.params.id);
        requested.forEach((request) => user[request] = req.body[request])

        await user.save();
        res.send(user)

    } catch (error) {
        if (error.name == 'CastError') {
            return res.status(404).send();
         }
        else{
            res.status(500).send(error)
        }
    }

})

router.delete('/users/:id', async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send()
        }

        res.send(user);

    } catch (error) {
        if (error.name == 'CastError') {
            return res.status(404).send()
        }
        return res.status(500).send(error)
    }
})

module.exports = router;