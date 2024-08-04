import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utility/utility-class.js";
export const newUser = TryCatch(async (req, res, next) => {
    const { name, email, photo, gender, _id, dob } = req.body;
    // * finding the User.
    let user = await User.findById(_id);
    if (user) {
        res.status(200).json({
            success: true,
            message: ` Welcome , ${user.name}`,
        });
    }
    if (!_id || !name || !email || !photo || !gender || !dob) {
        return next(new ErrorHandler("Neta ho kya ,Puri field Bharo", 400));
    }
    //  * Creating a User..
    user = await User.create({
        name,
        email,
        photo,
        gender,
        _id,
        dob: new Date(dob),
    });
    res.status(201).json({
        success: true,
        message: ` Welcome ${user.name}`,
    });
});
// * Get all user
export const getAllUsers = TryCatch(async (req, res, next) => {
    const users = await User.find({});
    if (!users) {
        return next(new ErrorHandler("Invalid Id", 400));
    }
    return res.status(200).json({
        success: true,
        users,
    });
});
// * Get  a user by ID;
export const getUsers = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("Invalid Id", 400));
    }
    return res.status(200).json({
        success: true,
        user,
    });
});
// * Delete user by ID;
export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("Invald ID", 400));
    }
    await user.deleteOne();
    return res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});
