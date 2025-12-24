let GenreAdminService = {
    initForms: function () {
    console.log('GenreAdminService.initForms() called');
    
    $("#addGenreForm").validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                description: {
                    minlength: 5
                }
            },
            messages: {
                name: {
                    required: "Please enter genre name",
                    minlength: "Genre name must be at least 2 characters"
                },
                description: {
                    minlength: "Description must be at least 5 characters"
                }
            },
            submitHandler: function(form, event) {
                if (event) event.preventDefault();
                var genre = Object.fromEntries(new FormData(form).entries());
                console.log('Genre data:', genre);
                GenreAdminService.addGenre(genre);
                return false;
            }
        });
    
    $("#editGenreForm").validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                description: {
                    minlength: 5
                }
            },
            messages: {
                name: {
                    required: "Please enter genre name",
                    minlength: "Genre name must be at least 2 characters"
                },
                description: {
                    minlength: "Description must be at least 5 characters"
                }
            },
            submitHandler: function(form, event) {
                if (event) event.preventDefault();
                var genre = Object.fromEntries(new FormData(form).entries());
                console.log('Genre data:', genre);
                GenreAdminService.addGenre(genre);
                return false;
            }
        });
    },
    openAddModal: function() {
        console.log('Opening add genre modal');
        $('#addGenreModal').addClass('show');
    },

    addGenre: function (genre) {
        console.log('Adding genre:', genre);
        $.blockUI({ message: '<h3>Adding genre...</h3>' });
        
        RestClient.post('genres', genre, function(response){
            console.log('Genre added successfully:', response);
            $.unblockUI();
            toastr.success("Genre added successfully");
            GenreAdminService.getAllGenres();
            GenreAdminService.closeModal();
        }, function(response){
            console.error('Error adding genre:', response);
            $.unblockUI();
            toastr.error(response.responseJSON ? response.responseJSON.message : 'Error adding genre');
        });
    },

    getAllGenres: function(){
        console.log('getAllGenres() started');
        console.log('URL will be:', Constants.PROJECT_BASE_URL() + 'genres');
        
        RestClient.get("genres", function(data){
            console.log('Genres received:', data);
            
            if (!data || data.length === 0) {
                console.warn('No genres found');
                $('#genres-table tbody').html('<tr><td colspan="3" class="text-center">No genres found</td></tr>');
                return;
            }
            
            Utils.datatable('genres-table', [
                { data: 'name', title: 'Genre Name' },
                { data: 'description', title: 'Description' },
                {
                    title: 'Actions',
                    render: function (data, type, row, meta) {
                        return `<div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-primary btn-sm" onclick="GenreAdminService.openEditModal(${row.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="GenreAdminService.openDeleteModal(${row.id}, '${row.name}')">Delete</button>
                        </div>`;
                    }
                }
            ], data, 10);
        }, function (xhr, status, error) {
            console.error('Error fetching genres');
            console.error('Status:', status);
            console.error('XHR status code:', xhr.status);
            console.error('XHR response:', xhr.responseText);
        });
    },

    getGenreById: function(id) {
        console.log('Getting genre by id:', id);
        $.blockUI({ message: '<h3>Loading genre data...</h3>' });
        
        RestClient.get('genres/' + id, function (data) {
            console.log('Genre loaded:', data);
            $('#editGenreForm input[name="id"]').val(data.id);
            $('#editGenreForm input[name="name"]').val(data.name);
            $('#editGenreForm textarea[name="description"]').val(data.description);
            $.unblockUI();
        }, function (xhr, status, error) {
            console.error('Error fetching genre:', error);
            $.unblockUI();
        });
    },

    openEditModal: function(id) {
        console.log('Opening edit modal for genre:', id);
        $('#editGenreModal').addClass('show');
        GenreAdminService.getGenreById(id);
    },

    closeModal: function() {
        console.log('Closing genre modals');
        $('#editGenreModal').removeClass('show');
        $('#addGenreModal').removeClass('show');
        $('#deleteGenreModal').removeClass('show');
    },

    editGenre: function(genre){
        console.log('Editing genre:', genre);
        
        $.blockUI({ message: '<h3>Updating genre...</h3>' });

        RestClient.put('genres/' + genre.id, genre, function (data) {
            console.log('Genre updated:', data);
            $.unblockUI();
            toastr.success("Genre updated successfully");
            GenreAdminService.closeModal();
            GenreAdminService.getAllGenres();
        }, function (xhr, status, error) {
            console.error('Error updating genre:', error);
            $.unblockUI();
            toastr.error("Error updating genre");
        });
    },

    openDeleteModal: function (id, name) {
        console.log('Opening delete modal for genre:', id, name);
        $('#deleteGenreModal').addClass('show');
        $("#delete-genre-body").html("Do you want to delete genre: " + name + "?");
        $("#delete_genre_id").val(id);
    },

    deleteGenre: function () {
        var genreId = $("#delete_genre_id").val();
        console.log('Deleting genre:', genreId);
        $.blockUI({ message: '<h3>Deleting genre...</h3>' });

        
        RestClient.delete('genres/' + genreId, null, function(response){
            console.log('Genre deleted:', response);
            $.unblockUI();
            GenreAdminService.closeModal();
            toastr.success("Genre deleted successfully");
            GenreAdminService.getAllGenres();
        }, function(response){
            console.error('Error deleting genre:', response);
            $.unblockUI();
            toastr.error(response.responseJSON ? response.responseJSON.message : 'Error deleting genre');
        });
    }
};