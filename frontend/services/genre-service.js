var GenreService = {
    BASE_URL: Constants.PROJECT_BASE_URL() + "genres",
    BOOKS_URL: Constants.PROJECT_BASE_URL() + "books",

    init: function () {
        console.log("Initializing GenreService...");
        this.loadGenres();
    },

    loadGenres: function () {
        const container = $("#genres-container");
        container.html('<p class="text-center">Loading genres...</p>');

        $.ajax({
            url: this.BASE_URL,
            type: "GET",
            success: function (genres) {
                container.empty();
                if (!genres || genres.length === 0) {
                    container.html('<p class="text-center">No genres found.</p>');
                    return;
                }

                genres.forEach(genre => {
                    const card = `
                        <div class="col-md-4 col-lg-3">
                            <div class="genre-card" data-genre-id="${genre.id}" data-genre-name="${genre.name}">
                                <i class="fas fa-book fs-1"></i>
                                <h5>${genre.name}</h5>
                                <p>${genre.description || 'No description'}</p>
                            </div>
                        </div>
                    `;
                    container.append(card);
                });

                $(".genre-card").on("click", function () {
                    const genreId = $(this).data("genre-id");
                    const genreName = $(this).data("genre-name");

                    $(".genre-card").removeClass("active");
                    $(this).addClass("active");

                    GenreService.loadBooksByGenre(genreId, genreName);
                });
            },
            error: function (xhr) {
                console.error("Error loading genres:", xhr);
                container.html('<p class="text-danger text-center">Error loading genres.</p>');
            }
        });
    },

    loadBooksByGenre: function (genreId, genreName) {
        const container = $("#books-container");
        container.html('<p class="text-center">Loading books...</p>');

        $.ajax({
            url: `${this.BOOKS_URL}/genre/${genreId}`,
            type: "GET",
            success: function (books) {
                container.empty();
                if (!books || books.length === 0) {
                    container.html(`<p class="text-center">No books found in ${genreName} genre.</p>`);
                    return;
                }

                let html = `<h3>Books in ${genreName} (${books.length})</h3>`;
                books.forEach(book => {
                    html += `
                        <div class="book-card mb-3 p-2 border rounded">
                            <h6>${book.title}</h6>
                            <p>Author: ${book.author}</p>
                            <p>ISBN: ${book.isbn}</p>
                            <p>Available: ${book.available_quantity}</p>
                        </div>
                    `;
                });

                container.html(html);
            },
            error: function (xhr) {
                console.error("Error loading books:", xhr);
                container.html(`<p class="text-danger text-center">Error loading books for ${genreName}</p>`);
            }
        });
    }
};

$(document).ready(function () {
    GenreService.init();
});
