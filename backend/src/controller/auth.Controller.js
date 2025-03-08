
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
        res.status(400).json({message:"error in signup controller"})
        console.log(error);
    }
}

export const login =()=>{

}

export const logout =()=>{

}