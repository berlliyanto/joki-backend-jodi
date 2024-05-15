import { PaginationInterface } from "../interface/pagination_interface";

export const paginationQuery = ({ page, limit }: { page?: string; limit?: string }): PaginationInterface => {
  let pagee: number = 1;
  let limitt: number = 10;

  if (page) {
    pagee = parseInt(page as string);
  }

  if (limit) {
    limitt = parseInt(limit as string);
  }

  return { page: pagee, limit: limitt };
};
