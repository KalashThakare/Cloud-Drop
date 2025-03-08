import User from "../models/user.Model.js"
import bcrypt from "bcrypt";

export const signup =async(req,res)=>{

    const {email,password} = req.body;

    try {

        if(!email || !password){
            return res.status(400).json({message:"fields should not be empty"});
        }

        const ifUserAlredyExist = await User.findOne({email});

        if(ifUserAlredyExist){
            return res.status(400).json({message:"User alredy exist try Login"});
        }

        const salt = await bcrypt.genSalt(11);
        const hashedPass = await bcrypt.hash(password,salt);

        const newUser = new User({
            email,
            password:hashedPass
        });

        if(newUser){
            await newUser.generateAuthToken();
            await newUser.save();

            res.status(200).json({
                email:newUser.email,
                id:newUser._id
            })
        }
        else{
            return res.status(400).json({message:"error in generating token and saving user in database"});
        }

        
    } catch (error) {
        res.status(500).json({message:"error in signup controller"})
        console.log(error);
    }
}

export const login =async(req,res)=>{

    const {email,password} = req.body;

    try {

        if(!email || !password){
            return res.status(400).json({message:"Fields should not be empty"});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"No user found"});
        }

        const comparePass = await bcrypt.compare(password,user.password)

        if(!comparePass){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const token = await user.generateAuthToken();

        res.status(200).json({
            email:user.email,
            id:user._id,
            token
        })
        
    } catch (error) {
        res.status(500).json({message:"Error in Login controller"});
        console.log(error);
    }

}

export const logout =(req,res)=>{

    try {
        res.clearCookie('token');
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Logout controller error"});
        
    }

}