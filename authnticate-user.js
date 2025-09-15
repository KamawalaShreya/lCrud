import passport from "passport";
import AccessTokens from "../../../model/access-token";

export default (req, res, next) => {
  console.log("yes me");
  passport.authenticate("jwt", { session: false }, async (err, user) => {
    console.log("in auth");
    if (!user) {
      console.log("you");
      return res.status(401).send({ messsage: "user unauthorized." });
    }

    console.log("in");
    const exist = await AccessTokens.findOne({
      token: user.jti,
      isRevoked: false,
      userId: user._id,
    });

    if (!exist) {
      return res.status(401).send({ messsage: "user unauthorized." });
    }
    req.user = user;

    return next();
  })(req, res, next);
};
