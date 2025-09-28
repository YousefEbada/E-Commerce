import { UserModel } from "../../db/models/user.model.js";


export const checkEmail = async(req, res, next) => {
    const exist = await UserModel.findOne({ email: req.body.email });
      if (exist) {
        return res.status(409).json({ message: "User Already Exist, Please Login" });
      }
      next();
}

