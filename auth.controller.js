import AuthService from "./auth.service";

class AuthController {
  static async register(req, res) {
    const { data, message, status } = await AuthService.register(req.body);

    return res.json({ message, data }).status(status);
  }

  static async login(req, res) {
    console.log("req.body", req.body);
    const { data, message, status } = await AuthService.login(req.body);

    return res.json({ message, data }).status(status);
  }
}

export default AuthController;
