import express from 'express'
import { googleAuthController, registerController ,loginsController} from '../controller/auth.controller.js'
import {registerValidation,loginValidator} from '../middleware/validator.middleware.js'
import passport from "passport";

const router = express.Router()

router.post('/register', registerValidation, registerController)
router.post('/login', loginValidator, loginsController)

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),

  googleAuthController
 
);


export default router