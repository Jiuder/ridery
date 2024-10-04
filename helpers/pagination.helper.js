/*
 * Copyright (c) 2020. 
 * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 */

const limit = 30;

async function pagination(page, count) {
  if (page > Math.ceil(count / limit)) {
    page = page;
  }
  if (page === 0) {
    page = 1;
  }
  let pag = {
    currentPage: Number(page),
    limit: limit,
    maxPages: Math.ceil(count / limit),
    totalItems: count,
    skip: (page - 1) * limit
  };
  return pag;
}

async function query(page, count) {
  if (page > Math.ceil(count / limit)) {
    page = Math.ceil(count / limit);
    if (page === 0) {
      return 1;
    }
    return page;
  }
  if (page === 0) {
    return 1;
  }
  return page;
}

async function max(page, count) {
  return page <= Math.ceil(count / limit);
}

module.exports = {
  pagination,
  query,
  limit,
  max
};
