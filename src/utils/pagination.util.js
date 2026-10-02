// Turn ?page=&limit= into Prisma skip/take.
// When neither is given, everything is returned (keeps old clients working).
export const toPaging = ({ page, limit }) => {
  if (!page && !limit) return {};
  const take = limit ?? 20;
  return { skip: ((page ?? 1) - 1) * take, take };
};

export const paginationMeta = ({ page, limit }, total) => {
  if (!page && !limit) {
    return { page: 1, limit: total, total, totalPages: 1 };
  }
  const take = limit ?? 20;
  return {
    page: page ?? 1,
    limit: take,
    total,
    totalPages: Math.ceil(total / take),
  };
};
