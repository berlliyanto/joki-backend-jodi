import { PaginationInterface } from "../interface/pagination_interface";
import { ResponseInterface } from "../interface/response_interface";
import User from "../models/user_model";

class UserService {
  async index({
    page,
    limit,
  }: PaginationInterface): Promise<ResponseInterface> {
    const data = await User.paginate(
      {},
      { page: page, limit: limit, sort: { _id: -1 } }
    );
    if (!data) {
      return {
        success: false,
        message: "Data not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "Data found",
      data: data,
    };
  }

  async update(id: string, data: any): Promise<ResponseInterface> {
    const user = await User.findById(id);
    if (!user) {
      return {
        success: false,
        message: "User not found",
        data: null,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
    return {
      success: true,
      message: "User updated",
      data: updatedUser,
    };
  }

  async destroy(id: string): Promise<ResponseInterface> {
    const user = await User.findById(id);
    if (!user) {
      return {
        success: false,
        message: "User not found",
        data: null,
      };
    }
    const deletedUser = await User.findByIdAndDelete(id);
    return {
      success: true,
      message: "User deleted",
      data: deletedUser,
    };
  }
}

export default UserService;
