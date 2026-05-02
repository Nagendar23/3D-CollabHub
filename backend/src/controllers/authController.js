import User from "../models/userModel.js";
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/generateToken.js';

export const register = async(req,res)=>{
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            console.log("Please fill all the fields to register")
            return res.status(400).json({message:"All fields required to register"})
        }

        const existingUser = await User.findOne({email}) // ✅ renamed
        if(existingUser){
            console.log("User with this email already exists")
            return res.status(400).json({message:"User already exists with this email"})
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        })

        console.log("User registered successfully ",user)
        return res.status(200).json({
            token:generateToken(user._id),
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            },
            message:"User registered successfully"})
    }catch(err){
        console.log("Some error while registering")
        return res.status(500).json({message:"Server error while registering"})
    }
}

export const login = async(req, res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            console.log("Both email and password are required")
            return res.status(400).json({message:"Both email and password are required"})
        }
        const user = await User.findOne({email})
        if(!user){
            console.log("User doesn't exist with this email")
            return res.status(404).json({message:"User doesn't exist with this email"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Invalid credentials")
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("Login successful ",user)
        res.json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }catch(err){
        console.log("Server error while login ",err)
        return res.status(500).json({message:"Server error while login ",err})
    } 
}

export const logout = async(req,res)=>{
    try{
        console.log("User loggedout successfully")
        return res.status(200).json({message:"User logged out successfully"})
    }catch(err){
        console.log("some error while logging out ",err)
        return res.status(500).json({message:"Some error while logging out ",err})
    }
}