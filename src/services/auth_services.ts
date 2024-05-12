import User from "../models/user_model";
import Authentication from "../utils/authentication";
import {
  AuthInterface,
  LoginType,
  RegisterType,
} from "../interface/auth_interface";
import { ResponseInterface } from "../interface/response_interface";

const errorResponse: ResponseInterface = {
  success: false,
  message: "Wrong username or password!",
  data: null,
};

class AuthServices implements AuthInterface {
  async login({ username, password }: LoginType): Promise<ResponseInterface> {
    const user = await User.findOne({ username });

    if (user != null) {
      const isPasswordMatch = await Authentication.passwordCompare(
        password,
        user.password
      );
      if (isPasswordMatch) {
        const token = Authentication.generateToken(
          user.id,
          user.name,
          user.role
        );
        return {
          success: true,
          message: "Login Success",
          data: {
            token: token,
            user: user,
          },
        };
      } else {
        return errorResponse;
      }
    } else {
      return errorResponse;
    }
  }
  async register({
    username,
    password,
    name,
    role,
  }: RegisterType): Promise<any> {
    if (!username) {
      return {};
    }
  }
  async logout(): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

export default AuthServices;
