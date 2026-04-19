import userModel from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { publishToQueue } from "../broker/rabbit.js";

//  REGISTER CONTROLLER
export async function registerController(req, res) {
  try {
    const { email, password, fullname: { firstname, lastname } } = req.body;

    // 🔸 Check if user already exists
    const isUserAlreadyExist = await userModel.findOne({ email });

    if (isUserAlreadyExist) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // 🔸 Create user
    const user = await userModel.create({
      email,
      password: await bcrypt.hash(password, 10),
      fullname: {
        firstname,
        lastname
      }
    });

    // 🔸 Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.JWT_SECRET
    );

    // 🔸 Publish event to RabbitMQ
    await publishToQueue("user_created", {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      role: user.role
    });

    // 🔸 Set cookie
    res.cookie("token", token);

    // 🔸 Response
    res.status(201).json({
      message: "User created successfully",
      user: {
        email: user.email,
        fullname: user.fullname,
        role: user.role
      }
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}



//  GOOGLE AUTH CONTROLLER
export async function googleAuthController(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({
        message: "Google authentication failed"
      });
    }

    // 🔸 Check if user exists
    const isUserAlreadyExist = await userModel.findOne({
      $or: [
        { email: user.emails[0].value },
        { googleId: user.id }
      ]
    });

    // 🔹 LOGIN FLOW
    if (isUserAlreadyExist) {
      const token = jwt.sign(
        {
          id: isUserAlreadyExist._id,
          role: isUserAlreadyExist.role
        },
        config.JWT_SECRET
      );

      res.cookie("token", token);

      // return res.status(200).json({
      //   message: "User logged in successfully",
      //   user: {
      //     email: isUserAlreadyExist.email,
      //     fullname: isUserAlreadyExist.fullname,
      //     role: isUserAlreadyExist.role
      //   }
      // });
      return res.redirect("http://localhost:5173");
    }

    // 🔹 REGISTER FLOW (Google user)
    const newUser = await userModel.create({
      email: user.emails[0].value,
      googleId: user.id,
      fullname: {
        firstname: user.name.givenName,
        lastname: user.name.familyName
      }
    });

    await publishToQueue("user_created", {
      id: newUser._id,
      email: newUser.email,
      fullname: newUser.fullname,
      role: newUser.role
    });

    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role
      },
      config.JWT_SECRET
    );

    res.cookie("token", token);

    // res.status(201).json({
    //   message: "User created successfully",
    //   user: {
    //     email: newUser.email,
    //     fullname: newUser.fullname,
    //     role: newUser.role
    //   }
    // });

    return res.redirect("http://localhost:5173");

  } catch (error) {
    console.error("GOOGLE AUTH ERROR:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

//  LOGIN CONTROLLER

export async function loginController(req, res) {

  const {email,password} = req.body
  const user = await userModel.findOne({email})

  if (!user){
    return res.status(400).json({
      message:"Invalid credentials"
    })
  }
  

  const isPasswordValid = await bcrypt.compare(password,user.password)
  if (!isPasswordValid){
    return res.status(400).json({
      message:"Invalid credentials"
    })
  }

  const token =jwt.sign({id:user.id, role:user.role},config.JWT_SECRET)
  res.cookie("token",token)
  res.status(200).json({
    message:"user logged in successfully",
    user:{
      email:user.email,
      fullname:user.fullname,
      role:user.role
    }
  })

}


