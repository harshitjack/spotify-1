import express from 'express'
import { googleAuthController, registerController } from '../controller/auth.controller.js'
import {registerValidation} from '../middleware/validator.middleware.js'
import passport from "passport";

const router = express.Router()

router.post('/register', registerValidation, registerController)

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),

  googleAuthController
 
);


export default router