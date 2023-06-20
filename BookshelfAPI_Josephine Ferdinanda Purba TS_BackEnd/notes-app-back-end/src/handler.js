const { nanoid } = require('nanoid');
const books = require('./buku');

const addBukuHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      },
    );
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      },
    );
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  let finished = false;
  if (readPage === pageCount) {
    finished = true;
  }

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    insertedAt,
    updatedAt,
    finished,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
        books,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBukuHandler = (request, h) => {
  const {
    name,
    reading,
    finished,
  } = request.query;

  if (!name && !reading && !finished) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => (
          {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          }
        )),
      },
    });
    response.code(200);
    return response;
  }
  let filteredBukuu = books;

  if (name) {
    filteredBukuu = filteredBukuu.filter(
      (book) => book.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  if (reading) {
    filteredBukuu = filteredBukuu.filter(
      (book) => book.reading === (reading === '1'),
    );
  } else if (reading === '0') {
    filteredBukuu = filteredBukuu.filter((book) => !book.reading);
  }

  if (finished) {
    filteredBukuu = filteredBukuu.filter(
      (book) => book.finished === (finished === '1'),
    );
  } else if (finished === '0') {
    filteredBukuu = filteredBukuu.filter((book) => !book.finished);
  }
  const response = h.response(
    {
      status: 'success',
      data: {
        books: filteredBukuu.map((book) => (
          {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          }
        )),
      },
    },
  );
  response.code(200);
  return response;
};

const getBukuByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((m) => m.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBukuByIdHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    reading,
    readPage,
    pageCount,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      },
    );
    response.code(400);
    return response;
  }

  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      },
    );
    response.code(404);
    return response;
  }

  const updatedAt = new Date().toISOString();
  books[index] = {
    ...books[index],
    name,
    readPage,
    pageCount,
    year,
    author,
    summary,
    publisher,
    reading,
    updatedAt,
  };

  const response = h.response(
    {
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: {
        books,
      },
    },
  );
  response.code(200);
  return response;
};

const deleteBukuHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      },
    );
    response.code(404);
    return response;
  }
  books.splice(index, 1);
  const response = h.response(
    {
      status: 'success',
      message: 'Buku berhasil dihapus',
    },
  );
  response.code(200);
  return response;
};

module.exports = {
  addBukuHandler,
  getAllBukuHandler,
  getBukuByIdHandler,
  updateBukuByIdHandler,
  deleteBukuHandler,
};
