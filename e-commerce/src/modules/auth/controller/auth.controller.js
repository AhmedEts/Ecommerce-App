import userModel from "../../../DB/models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateToken, verifyToken } from "../../../utils/GenerateAndVerfiyToken.js"
import sendEmail from "../../../utils/email.js"
import { compare, hash } from "../../../utils/HashAndCompare.js"
import { asyncHandler } from "../../../utils/asyncHandler.js"



//1- signUp

export const signUp = asyncHandler(async (req, res, next) => {

    const { email,password } = req.body
  
    const emailExist = await userModel.findOne({ email })
    if (emailExist) {
        return next(new Error("email already exist", {cause: 409}))
    }
    const hashPassword = bcrypt.hashSync(password, +process.env.SALT_ROUND)
    req.body.password = hashPassword
    const token = generateToken ({payload :{ email }, signature:process.env.EMAIL_SIGNETURE, expiresIn: 60 * 30 })
    const rf_token = generateToken ({payload :{ email }, signature:process.env.EMAIL_SIGNETURE, expiresIn: 60 * 60 })

    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
    const rf_link = `${req.protocol}://${req.headers.host}/auth/refreshToken/${rf_token}`

    const html = 
    `<a href='${link}'>confirm email</a>d
  <br>
  <br>
  <a href='${rf_link}'>send refresh token</a>
  `
// this will return true or false
    if (!  sendEmail({ to:email, subject:'confirm email', html})) {
        return next (new Error('fail to send '), {cause : 400})
    }
    req.body.password = hash({ plaintext: req.body.password})
    const user = await userModel.create(req.body)
    return res.json ({message: "done", _id: user._id})
})

//2- confirmEmail

export const confirmEmail= asyncHandler(
    async( req, res, next ) => {
        const {token} = req.params
        const {email}= verifyToken({token, signature:process.env.EMAIL_SIGNETURE });
        const user= await userModel.findOne({email})
        if(!user) {
            return res.redirect('https://www.facebook.com//')
        }

        if(!user.confirmEmail){
            return res.redirect('https://www.linkedin.com/in/ahmed-hesham-586223174/')
        }
        await updateOne({ email }, { confirmEmail: true })
        return res.redirect('https://www.linkedin.com/in/ahmed-hesham-586223174/')
    }
)


//3- refreshToken

export const refreshToken= asyncHandler (
    async(req,res,next) => {
    const {token}= req.params
    const {email}= verifyToken({token, signature:process.env.EMAIL_SIGNETURE})
    const user= await userModel.findOne({email})
    if(!user) {
        return res.redirect('https://www.facebook.com/')
        }
    if(!user.confirmEmail){
        return res.redirect('https://www.linkedin.com/in/ahmed-hesham-586223174/')
        }
    const newToken = generateToken ({payload :{ email }, signature:process.env.EMAIL_SIGNETURE, expiresIn: 60 * 10 })
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`
    const html = `<a href='${link}'>confirm email</a>`
        // this will return true or false
    if (!  sendEmail({ to:email, subject:'confirm email', html})) {
     return next (new Error('fail to send '), {cause : 400})
        }
    return res.send('<h1>Check your email</h1>')
    }
)

//4- login

export const logIn= asyncHandler(async (req, res, next) => {
        //get data from req
        const { email, password, mobileNumber } = req.body;
        //if no email or password
        if (!email && !mobileNumber) {
          return next(new Error("please enter email or mobileNumber"), {cause: 400,});
        }
        //signIn with email or number
        const user = await userModel.findOne({
          $or: [{ email }, { mobileNumber }],
        });
        //check if exist
        if (!user) {
          return next(new Error(" wrong email or mobileNumber or password "), {cause: 400,});
        }
        //check if email confirmed
        // if (!user.confirmEmail) {
        //   return next(new Error("please confirm email first"), { cause: 400 });
        // }
        //check if password correct
        const match = compare({ plaintext: password, hashValue: user.password });
        if (!match) {
          return next(new Error("wrong email or mobileNumber or password"), {
            cause: 400,
          });
        }
        //change is deleted
        if (user.isDeleted) {
          user.isDeleted = false;
        }
        //change status
        user.status = "Online";
        //save changes
        await user.save();
        //generate token and refreshToken
        const token = generateToken({
          payload: { email, _id: user._id, role: user.role },
          expiresIn: 60 * 30,
        });
        const refreshToken = generateToken({
          payload: { email, _id: user._id, role: user.role },
          expiresIn: 60 * 60 * 24 * 30,
        });
        return res.json({ message: "login successfully", token, refreshToken });
      });
      


//forget password
export const sendCode = 
asyncHandler(async (req, res, next) => {
        //get data from req
        const { email } = req.body;
        //check user exist
        const userExist = await userModel.findOne({ email });
        if (!userExist) {
          return next(new Error("email not found"), { cause: 400 });
        }
        if (!userExist.confirmEmail) {
          return next(new Error("confirm email first"), { cause: 400 });
        }
        //generate code
        const nanoId = customAlphabet("1234567890", 5);
        const code = nanoId();
        //sendEmail
        if (
          !sendEmail({
            to: email,
            subject: "forget password",
            html: `<h1>${code}</h1>`,
          })
        ) {
          return next(new Error("failed to send email"), { cause: 400 });
        }
        //store code
        await userModel.updateOne({ email }, { code });
        return res.status(200).json({ message: "check email" });
      });

export const forgetPassword = 
asyncHandler(async (req, res, next) => {
  //get data from req
  const { email, code, newPassword } = req.body;
  //check email exist
  const userExist = await userModel.findOne({ email });
  if (!userExist) {
    return next(new Error("email not found"), { cause: 400 });
  }
  //check code
  if (code !== userExist.code || code == null) {
    return next(new Error("wrong code"), { cause: 400 });
  }
  //hash new password
  let password = hash({ plaintext: newPassword });
  //update user
  const updateUser = await userModel.findOneAndUpdate(
    { email },
    { password, code: null, status: "Offline " },
    { new: true }
  );
  return res.status(200).json({ message: "done", updateUser });
});      

//Update password
export const updatePassword = 
asyncHandler(async (req, res, next) => {
    //get data from req
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;
    //check old password
    const user = await userModel.findById({ _id: userId });
    if (!user) {
      return next(new Error("user not found"), { cause: 404 });
    }
    if (userId != req.user._id) {
      return next(new Error("you are not the owner of account", { cause: 400 }));
    }
    //compare passwords
    const match = compare({ plaintext: oldPassword, hashValue: user.password });
    if (!match) {
      return next(new Error("password not correct"), { cause: 400 });
    }
    //hash new password
    const hashedPassword = hash({ plaintext: newPassword });
    //update password
    await userModel.findByIdAndUpdate(
      { _id: userId },
      { password: hashedPassword }
    );
    return res.status(200).json({ message: "password updated" });
  });


//update account

export const updateAccount = 
asyncHandler(async (req, res, next) => {
    //get data from req
    const { email, mobileNumber, lastName, firstName } = req.body;
    const { userId } = req.params;
    //check if there is data in req
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new Error("no data to be updated", { cause: 400 }));
    }
    //check user exist
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return next(new Error("user not found", { cause: 404 }));
    }
    //check if you're the owner
    if (userId != req.user._id) {
      return next(new Error("you are not the owner of account", { cause: 400 }));
    }
    //check userName exist
    let userName;
    if (firstName) {
      userName = `${firstName}${user.lastName}`;
    }
    if (lastName) {
      userName = `${user.firstName}${lastName}`;
    }
    if (firstName && lastName) {
      userName = `${firstName}${lastName}`;
    }
    const nameExist = await userModel.findOne({ userName, _id: { $ne: userId } });
    if (nameExist) {
      return next(new Error("userName already exist", { cause: 400 }));
    }
    req.body.userName = userName;
    //check email
    if (email) {
      const emailExist = await userModel.findOne({
        email,
        _id: { $ne: userId },
      });
      if (emailExist) {
        return next(new Error("email already exist", { cause: 400 }));
      }
      //check mobileNumber
      if (mobileNumber) {
        const mobileExist = await userModel.findOne({
          mobileNumber,
          _id: { $ne: userId },
        });
        if (mobileExist) {
          return next(new Error(" mobileNumber already exist", { cause: 400 }));
        }
      }
    }
    //update user
  const update = await userModel.findByIdAndUpdate({ _id: userId }, req.body, {
    new: true,
  });
  res.status(200).json({ message: "updated successfully", update });
});

//Delete account
export const deleteAccount = 
asyncHandler(async (req, res, next) => {
    //get data from req
    const { userId } = req.params;
    //check user exist
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return next(new Error("user not found", { cause: 404 }));
    }
    //check if you're the owner
    if (userId != req.user._id) {
      return next(new Error("you are not the owner of account", { cause: 400 }));
    }
    //delete account
    const deleteAccount = await userModel.findByIdAndDelete({ _id: userId });
    res.status(200).json({ message: "deleted successfully" });
  });