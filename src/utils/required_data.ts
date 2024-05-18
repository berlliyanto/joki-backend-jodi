import { ResponseInterface } from "../interface/response_interface";

export const requiredData = (data: any, required: string[]): ResponseInterface => {
  for (const key in data) {
    if (!required.includes(key)) {
      return {
        success: false,
        message: `${key} is required`,
        data: null,
      };
    }
  }

  return {
    success: true,
    message: "Data found",
    data: data,
  }
};
