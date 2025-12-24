let BookAdminService = {
    initForms: function () {
        console.log('BookAdminService.initForms() called');
        
        $("#addBookForm").validate({
        rules: {
                title: {
                    required: true,
                    minlength: 2
                },
                author: {
                    required: true,
                    minlength: 2
                },
                isbn: {
                    required: true,
                    minlength: 10,
                    maxlength: 17
                },
                available_quantity: {
                    min: 0
                },
                publication_year: {
                    min: 1000,
                    max: 2026
                },
                genre_id: {
                    required: true
                }
            },
            messages: {
                title: {
                    required: "Please enter book title",
                    minlength: "Title must be at least 2 characters"
                },
                author: {
                    required: "Please enter author name",
                    minlength: "Author name must be at least 2 characters"
                },
                isbn: {
                    required: "Please enter ISBN",
                    minlength: "ISBN must be at least 10 characters",
                    maxlength: "ISBN cannot exceed 17 characters"
                },
                available_quantity: {
                    min: "Quantity cannot be negative"
                },
                publication_year: {
                    min: "Year must be after 1000",
                    max: "Year cannot be in the future"
                },
                genre_id: {
                    required: "Please select a genre"
                }
            },
            submitHandler: function(form, event) {  
                if (event) event.preventDefault();
                var book = Object.fromEntries(new FormData(form).entries());
                console.log('Book data:', book);
                BookAdminService.addBook(book);
                return false;
            }
        });
        
        $("#editBookForm").validate({
            rules: {
                title: {
                    required: true,
                    minlength: 2
                },
                author: {
                    required: true,
                    minlength: 2
                },
                genre_id: {
                    required: true
                },
                isbn: {
                    required: true,
                    minlength: 10,
                    maxlength: 17
                },
                available_quantity: {
                    min: 0
                },
                publication_year: {
                    min: 1000,
                    max: 2026
                }
            },
            messages: {
                title: {
                    required: "Please enter book title",
                    minlength: "Title must be at least 2 characters"
                },
                author: {
                    required: "Please enter author name",
                    minlength: "Author name must be at least 2 characters"
                },
                genre_id: {
                    required: "Please select a genre"
                },
                isbn: {
                    required: "Please enter ISBN",
                    minlength: "ISBN must be at least 10 characters",
                    maxlength: "ISBN cannot exceed 17 characters"
                },
                available_quantity: {
                    min: "Quantity cannot be negative"
                },
                publication_year: {
                    min: "Year must be after 1000",
                    max: "Year cannot be in the future"
                }
            },
            submitHandler: function(form) {
                var book = Object.fromEntries(new FormData(form).entries());
                console.log('Book data:', book);
                BookAdminService.editBook(book);
            }
        });
    },

    openAddModal: function() {
        console.log('Opening add book modal');
        $('#addBookModal').addClass('show');
        BookAdminService.loadGenresForDropdown();
    },

    loadGenresForDropdown: function() {
        console.log('loadGenresForDropdown() started');
        console.log('URL will be:', Constants.PROJECT_BASE_URL() + 'genres');
        
        RestClient.get("genres", function(data){
            console.log('Genres received for dropdown:', data);
            
            let options = '<option value="">Select genre...</option>';
            data.forEach(genre => {
                options += `<option value="${genre.id}">${genre.name}</option>`;
            });
            $('#genreSelectAdd').html(options);
            $('#genreSelectEdit').html(options);
        }, function(xhr, status, error) {
            console.error('Error fetching genres for dropdown');
            console.error('Status:', status);
            console.error('XHR:', xhr);
        });
    },

    addBook: function (book) {
        console.log('Adding book:', book);

        book.publication_year = parseInt(book.publication_year);
        book.genre_id = parseInt(book.genre_id);
        book.available_quantity = parseInt(book.available_quantity);

        $.blockUI({ message: '<h3>Adding book...</h3>' }); 

        RestClient.post('books', book, function(response){
            console.log('Book added successfully:', response);
            $.unblockUI();
            toastr.success("Book added successfully");
            BookAdminService.getAllBooks();
            BookAdminService.closeModal();
        }, function(response){
            console.error('Error adding book:', response);
            $.unblockUI();
            toastr.error(response.responseJSON ? response.responseJSON.message : 'Error adding book');
        });
    },

    getAllBooks: function(){
        console.log('getAllBooks() started');
        console.log('URL will be:', Constants.PROJECT_BASE_URL() + 'books');
        
        RestClient.get("books", function(data){
            console.log('Books received:', data);
            console.log('First book:', data[0]);
            
            if (!data || data.length === 0) {
                console.warn('No books found');
                $('#books-table tbody').html('<tr><td colspan="5" class="text-center">No books found</td></tr>');
                return;
            }
            
            Utils.datatable('books-table', [
                { data: 'title', title: 'Title' },
                { data: 'author', title: 'Author' },
                { data: 'isbn', title: 'ISBN' },
                { data: 'available_quantity', title: 'Available' },
                {
                    title: 'Actions',
                    render: function (data, type, row, meta) {
                        return `<div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-primary btn-sm" onclick="BookAdminService.openEditModal(${row.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="BookAdminService.openDeleteModal(${row.id}, '${row.title}')">Delete</button>
                        </div>`;
                    }
                }
            ], data, 10);
        }, function (xhr, status, error) {
            console.error('Error fetching books');
            console.error('Status:', status);
            console.error('XHR status code:', xhr.status);
            console.error('XHR response:', xhr.responseText);
        });
    },

    getBookById: function(id) {
        console.log('Getting book by id:', id);
        
        RestClient.get('books/' + id, function (data) {
            console.log('Book loaded:', data);
            $('#editBookForm input[name="id"]').val(data.id);
            $('#editBookForm input[name="title"]').val(data.title);
            $('#editBookForm input[name="author"]').val(data.author);
            $('#editBookForm select[name="genre_id"]').val(data.genre_id);
            $('#editBookForm input[name="isbn"]').val(data.isbn);
            $('#editBookForm input[name="available_quantity"]').val(data.available_quantity);

            $('#editBookForm input[name="publication_year"]').val(data.publication_year);
        }, function (xhr, status, error) {
            console.error('Error fetching book:', error);
        });
    },

    openEditModal: function(id) {
        console.log('Opening edit modal for book:', id);
        $('#editBookModal').addClass('show');
        BookAdminService.loadGenresForDropdown();
        BookAdminService.getBookById(id);
    },

    closeModal: function() {
        console.log('Closing modals');
        $('#editBookModal').removeClass('show');
        $('#addBookModal').removeClass('show');
        $('#deleteBookModal').removeClass('show');
    },

    editBook: function(book){
        console.log('Editing book:', book);

        book.publication_year = parseInt(book.publication_year);
        book.genre_id = parseInt(book.genre_id);
        book.available_quantity = parseInt(book.available_quantity);
        
        $.blockUI({ message: '<h3>Updating book...</h3>' });

        RestClient.put('books/' + book.id, book, function (data) {
            console.log('Book updated:', data);
            $.unblockUI();
            toastr.success("Book updated successfully");
            BookAdminService.closeModal();
            BookAdminService.getAllBooks();
        }, function (xhr, status, error) {
            console.error('Error updating book:', error);
            $.unblockUI();
            toastr.error("Error updating book");
        });
    },

    openDeleteModal: function (id, title) {
        console.log('Opening delete modal for book:', id, title);
        $('#deleteBookModal').addClass('show');
        $("#delete-book-body").html("Do you want to delete book: " + title + "?");
        $("#delete_book_id").val(id);
    },

    deleteBook: function () {
        var bookId = $("#delete_book_id").val();
        console.log('Deleting book:', bookId);
        
        $.blockUI({ message: '<h3>Deleting book...</h3>' }); 

        RestClient.delete('books/' + bookId, null, function(response){
            console.log('Book deleted:', response);
            $.unblockUI()
            BookAdminService.closeModal();
            toastr.success("Book deleted successfully");
            BookAdminService.getAllBooks();
        }, function(response){
            console.error('Error deleting book:', response);
            $.unblockUI()
            toastr.error(response.responseJSON ? response.responseJSON.message : 'Error deleting book');
        });
    }
};
