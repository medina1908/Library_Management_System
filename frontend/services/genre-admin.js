let GenreAdminService = {
    initForms: function () {
    console.log('GenreAdminService.initForms() called');
    
    $("#addGenreForm").off('submit').on('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();  
        console.log('Add genre form submitted');
        
        var genre = Object.fromEntries(new FormData(this).entries());
        console.log('Genre data:', genre);
        GenreAdminService.addGenre(genre);
        this.reset();
        return false;  
    });
    
    $("#editGenreForm").off('submit').on('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();  
        console.log('Edit genre form submitted');
        
        var genre = Object.fromEntries(new FormData(this).entries());
        GenreAdminService.editGenre(genre);
        return false;  
    });
},
    openAddModal: function() {
        console.log('Opening add genre modal');
        $('#addGenreModal').addClass('show');
    },

    addGenre: function (genre) {
        console.log('Adding genre:', genre);
        
        RestClient.post('genres', genre, function(response){
            console.log('Genre added successfully:', response);
            toastr.success("Genre added successfully");
            GenreAdminService.getAllGenres();
            GenreAdminService.closeModal();
        }, function(response){
            console.error('Error adding genre:', response);
            GenreAdminService.closeModal();
            toastr.error(response.responseJSON ? response.responseJSON.message : 'Error adding genre');
        });
    },

    getAllGenres: function(){
        console.log('getAllGenres() started');
        console.log('URL will be:', Constants.PROJECT_BASE_URL + 'genres');
        
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
        
        RestClient.get('genres/' + id, function (data) {
            console.log('Genre loaded:', data);
            $('#editGenreForm input[name="id"]').val(data.id);
            $('#editGenreForm input[name="name"]').val(data.name);
            $('#editGenreForm textarea[name="description"]').val(data.description);
        }, function (xhr, status, error) {
            console.error('Error fetching genre:', error);
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
        
        RestClient.put('genres/' + genre.id, genre, function (data) {
            console.log('Genre updated:', data);
            toastr.success("Genre updated successfully");
            GenreAdminService.closeModal();
            GenreAdminService.getAllGenres();
        }, function (xhr, status, error) {
            console.error('Error updating genre:', error);
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
        
        RestClient.delete('genres/' + genreId, null, function(response){
            console.log('Genre deleted:', response);
            GenreAdminService.closeModal();
            toastr.success("Genre deleted successfully");
            GenreAdminService.getAllGenres();
        }, function(response){
            console.error('Error deleting genre:', response);
            GenreAdminService.closeModal();
            toastr.error(response.responseJSON ? response.responseJSON.message : 'Error deleting genre');
        });
    }
};