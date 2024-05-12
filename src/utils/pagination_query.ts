import { PaginationInterface } from "../interface/pagination_interface";

export const paginationQuery = ({ pagee, limitt }: { pagee?: string; limitt?: string }): PaginationInterface => {
  let page: number = 1;
  let limit: number = 10;

  if (pagee) {
    page = parseInt(pagee as string);
  }

  if (limitt) {
    limit = parseInt(limitt as string);
  }

  return { page, limit };
};
