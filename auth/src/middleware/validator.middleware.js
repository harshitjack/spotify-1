import {body, validationResult} from 'express-validator'



async function validate(req,res,next){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
    }
    next()


}

 export const registerValidation = [
    body('email').isEmail().withMessage("Invalid email address"),
    body('password').isLength({min:6}).withMessage("Password must be at least 6 characters long"),  
    body('fullname.firstname').notEmpty().withMessage("First name is required"),
    body('fullname.lastname').notEmpty().withMessage("Last name is required"),
    validate
]

export const loginValidator = [
    body('email').isEmail().withMessage("Invalid email address"),
    body('password').notEmpty().withMessage("Password is required"),
    validate
]