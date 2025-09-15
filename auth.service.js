import Users from "../../model/users";
import bcrypt from "bcryptjs";
import { BCRYPT_SALT, JWT } from "../common/constants";
import jwt from "jsonwebtoken";
import { generateRandomString } from "../common/helper";
import AccessTokens from "../../model/access-token";
import moment from "moment";
import RefreshTokens from "../../model/refresh-token";

class AuthService {
  static async register(reqData) {
    const isExist = await Users.findOne({ email: reqData.email });

    if (isExist) {
      return { message: "User already exist.", status: 409 };
    } else {
      const hashPassword = await bcrypt.hash(reqData.password, BCRYPT_SALT);
      reqData.password = hashPassword;

      const addUser = await Users.create(reqData);

      const randomString = await generateRandomString();
      const token = await jwt.sign(
        {
          id: addUser._id,
          jti: randomString,
        },
        JWT.SECRET,
        { expiresIn: JWT.EXPIRES_IN }
      );

      const expiryDate = moment(new Date())
        .utc()
        .add(5, "hours")
        .format("YYYY-MM-DD hh:mm:ss");

      await AccessTokens.create({
        token: randomString,
        userId: addUser._id,
        expiresAt: expiryDate,
      });

      const refreshToken = generateRandomString();
      await RefreshTokens.create({
        accessTokenJti: randomString,
        refreshToken: refreshToken,
      });

      delete addUser._doc.password;
      delete addUser._doc.__v;
      return {
        data: {
          ...addUser._doc,
          auth: {
            tokenType: "Bearer",
            accessToken: token,
            refreshToken: refreshToken,
            expiresIn: expiryDate,
          },
        },
        status: 200,
        message: "User Added Successfully",
      };
    }
  }

  static async login(reqData) {
    const isExist = await Users.findOne({ email: reqData.email });

    if (!isExist) {
      return { message: "User not found.", status: 404 };
    } else {
      const matchHashPassword = await bcrypt.compare(
        reqData.password,
        isExist.password
      );
      if (!matchHashPassword) {
        return { message: "Password mismatch", status: 409 };
      }

      const randomString = generateRandomString();
      console.log(isExist._id, "randomString", randomString);
      const token = jwt.sign(
        {
          id: isExist._id,
          jti: randomString,
        },
        JWT.SECRET,
        { expiresIn: JWT.EXPIRES_IN } // must be an object
      );
      console.log("roken");
      const expiryDate = moment(new Date())
        .utc()
        .add(5, "hours")
        .format("YYYY-MM-DD hh:mm:ss");
      await AccessTokens.create({
        token: randomString,
        userId: isExist._id,
        expiresAt: expiryDate,
      });

      const refreshToken = generateRandomString();
      await RefreshTokens.create({
        accessTokenJti: randomString,
        refreshToken: refreshToken,
      });

      delete isExist.__v;
      delete isExist.password;
      return {
        data: {
          ...isExist,
          auth: {
            tokenType: "Bearer",
            accessToken: token,
            refreshToken: refreshToken,
            expiresIn: expiryDate,
          },
        },
        status: 200,
        message: "login successfully",
      };
    }
  }
}

export default AuthService;
