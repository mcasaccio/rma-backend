/*
    Path: '/api/login'
*/
const { Router } = require('express');
const { check } = require('express-validator');

// middlewares
const { isValidToken } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validate-fields');

// controllers
const { login, googleSignIn, renewToken } = require('../controllers/auth');

const router = Router();

router.post( '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validateFields
    ],
    login
);

router.post( '/google',
    [
        check('token', 'El token de Google es obligatorio').not().isEmpty(),
        validateFields
    ],
    googleSignIn
)

router.get( '/renew',
    isValidToken,
    renewToken
)






module.exports = router;
