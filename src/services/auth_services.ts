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
  }: RegisterType): Promise<ResponseInterface> {
    if (!username || !password || !name || !role) {
      return {
        success: false,
        message: "username, password, name and role is required",
        data: null,
      };
    }

    const user = await User.findOne({ username });
    if (user) {
      return {
        success: false,
        message: "Username already exists",
        data: null,
      };
    }

    const passwordHash = await Authentication.passwordHash(password);

    const newUser = new User({
      name,
      username,
      password: passwordHash,
      role,
    });

    await newUser.save();
    return {
      success: true,
      message: "Register Success",
      data: null,
    };
  }
  async logout(): Promise<ResponseInterface> {
    return {
      success: true,
      message: "Logout Success",
      data: null,
    };
  }
}

export default AuthServices;
