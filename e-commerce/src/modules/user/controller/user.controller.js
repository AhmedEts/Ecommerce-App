import userModel from "../../../DB/models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {asyncHandler} from "../../../utils/asyncHandler.js"
import { generateToken } from "../../../utils/GenerateAndVerfiyToken.js"



//3- updateUser

export const updateUser = async (req, res, next) => {
  const userId = req.userId; // User ID extracted from the token
  const { userName, age } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ message: 'User not found' });
    }

    // Update user information
    if (userName) {
      user.userName = userName;
    }
    if (age) {
      user.age = age;
    }

    await user.save();

    return res.json({ message: 'User updated successfully' });
  } catch (error) {
    return res.json({ message: 'Internal Server Error', error: error.message });
  }
}


//4- updatePassword
export const updatePassword= async (req, res, next) => {
  const { _id } = req.user
  const { oldPassword, newPassword } = req.body;
  const userchange = await userModel.findById({_id});
  const match =verfiy({plainText:oldPassword,hashValue:userchange.password})
  if(!match){
      return  next(new Error('Invalid old password',{cause:404}))

  }    
  
  let password=hash({plainText:newPassword})
  const updateUser = await userModel.findOneAndUpdate({_id},{password,passwordChangedAt: Date.now(),status:"offline"},{new:true})
  return  res.json({ message: 'Password updated successfully' });
}


export const uploadProfilImage = asyncHandler(
  async (req, res, next) => {
      const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, { profileImage: req.file.finalDest }, { new: true })
      return res.json({ messagge: "Done", user })
  }
)



//5- DeleteUser

export const deleteUser= async (req,res,next) => {
  const userId = req.userId; // Logged-in user's ID from token

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await user.remove();

    // You may want to perform additional cleanup actions here (e.g., delete associated tasks, etc.)

    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.json({ message: 'Internal Server Error', error: error.message });
  }
}

//6- Soft delete

export const softDelete = async (req, res) => {
  const userId = req.userId; // Logged-in user's ID from token

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Soft delete the user by updating the 'deleted' field
    user.deleted = true;
    await user.save();

    return res.json({ message: 'User soft-deleted successfully' });
  } catch (error) {
    return res.json({ message: 'Internal Server Error', error: error.message });
  }
};

//7- Logout

export const logout = async (req, res) => {
  // You may want to perform additional cleanup or logging out logic here, if necessary
  
  // Send a response indicating successful logout
  return res.json({ message: 'Logout successful' });
};


//8- Confirm Email

export const confirmEmail = async (req, res, next) => {
  const { token } = req.params
  const payload = jwt.verify(token, process.env.CONFIRM_EMAIL_SIGNETURE)
  const user = await userModel.findByIdAndUpdate({ _id: payload._id }, { confirmEmail: true })
  return res.redirect('http://127.0.0.1:5500/sign-up-login-form/logIn/')
}



//9- forget & unsubscribe

export const forget = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: 'User not found' });
    }

    // Generate a unique token for password reset (you can use a library like 'crypto')
    const resetToken = generateResetToken();

    // Save the reset token and its expiration time in the user document
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // Token expiration time (e.g., 1 hour)
    await user.save();

    // Send an email to the user with a link containing the resetToken

    return res.json({ message: 'Password reset link sent successfully' });
  } catch (error) {
    return res.json({ message: 'Internal Server Error', error: error.message });
  }
};

export const uploadProfileImage=(req, res, next )=> {
  console.log(req.file);

  return res.json({ message: 'Done',file: req.file });
}