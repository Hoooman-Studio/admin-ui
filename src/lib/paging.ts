function lastPage(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / pageSize));
}

/** A page past the end reads as the last page, and anything below 1 as the first. */
function clampPage(page: number, total: number, pageSize: number) {
  return Math.min(Math.max(1, Math.floor(page)), lastPage(total, pageSize));
}

/** The 1-based positions of the first and last item on a page, for "21–40 of 128". Both 0 when there is nothing. */
function pageBounds(page: number, pageSize: number, total: number) {
  if (total <= 0) {
    return { first: 0, last: 0 };
  }
  const start = (clampPage(page, total, pageSize) - 1) * pageSize;
  return { first: start + 1, last: Math.min(start + pageSize, total) };
}

/** The rows on one page, for lists paged on the client. */
function paginate<Row>(rows: readonly Row[], page: number, pageSize: number) {
  const start = (clampPage(page, rows.length, pageSize) - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

export { pageBounds, paginate };
