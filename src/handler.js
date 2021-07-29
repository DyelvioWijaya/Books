const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBooks = {
        name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt,
      };

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
          });
          response.code(400);
          return response;
    }
    if (readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
          });
          response.code(400);
          return response;
    }
    books.push(newBooks);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
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

const getAllBook = (request, h) => {
const { name, reading, finished } = request.query;

if(name !== undefined) {
  books.filter((showBookName) => {
return  showBookName.name.toLowerCase().includes(name.toLowerCase())})
}

if(reading !== undefined) {
  books.filter((showBook) => {
    return showBook.reading === !!Number(reading);
  })
}

if(finished !== undefined) {
  books.filter((showFinished)=> {
     return showFinished.reading === !!Number(finished);
  })
}
  const optionBook= books.map((show) => ({
    id:show.id,
    name:show.name,
    publisher:show.publisher,
  }));
  const response = h.response({
    status: 'success',
    data: {
      books: optionBook,
     },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const matchBook = books.filter((bookId) => bookId.id === id)[0];

    if (matchBook !== undefined) {
        return {
          status: 'success',
          data: {
            book: matchBook,
          },
        };
      }
      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;
  };

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
   
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
          });
          response.code(400);
          return response;
    }
    if (readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
          });
          response.code(400);
          return response;
    }
    if (index !== -1) {
        books[index] = {
          ...books[index],
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
          updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
          });

          response.code(200);
          return response;
    }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
}

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
   
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
  };

module.exports = { addBook, getAllBook, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };