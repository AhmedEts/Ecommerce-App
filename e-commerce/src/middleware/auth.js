import jwt from "jsonwebtoken";
import userModel from "../DB/models/user.model.js";
import dotenv from "dotenv";

// export const roles = {
// 	Admin: "Admin",
// 	User: "User",
// };
// dotenv.config();
 const auth = (role) => {
	return async (req, res, next) => {
		try {
			const { authorization } = req.headers;
			// console.log(authorization);
			if (!authorization) {
				return next(new Error("please login", { cause: 400 }));
			}
			if (!authorization?.startsWith(process.env.BEARER_KEY)) {
				// console.log(process.env.BEARER_KEY);

				return next(new Error("invalid bearer key", { cause: 400 }));
			}

			const token = authorization.split(process.env.BEARER_KEY)[1];
			// console.log("=======\n", token);
			if (!token) {
				return next(new Error("invalid Bearer key"));
			}

			const payload = jwt.verify(token, process.env.TOKEN_SIGNETURE); //TOKEN_SIGNETURE
			if (!payload?._id) {
				return next(new Error("invalid payload"));
			}

			const user = await userModel
				.findById({ _id: payload._id })
				.select("userName email status role passwordChangedAt");
			if (!user) {
				return next(new Error("account not register", { cause: 404 }));
			}

			const date = new Date(user.passwordChangedAt);
			const timestamp = date.getTime();

			if (payload.iniateAt < timestamp) {
				return next(new Error("not valid token"));
			}

			if (user.status == "offline") {
				return next(new Error("please login", { cause: 400 }));
			}
			if (!role.includes(user.role)) {
				return next(new Error("you do not have access", { cause: 401 }));
			}
			req.user = user;

			return next();
		} catch (error) {
			return next(new Error(error.message, { cause: 400 }));
		}
	};
};

export default auth