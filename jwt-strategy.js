import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { JWT } from "../common/constants";
import Users from "../../model/users";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT.SECRET,
};

passport.use(
  new JWTStrategy(options, async (jwtPayload, cb) => {
    console.log("yes");
    try {
      const user = await Users.findById(jwtPayload.id);
      if (!user) {
        return cb(null, user);
      }
      delete user._doc.password;
      console.log("yes");

      return cb(null, { ...user._doc, jti: jwtPayload.jti });
    } catch (error) {
      return cb(error);
    }
  })
);
