var Dashboard = {
    init: function () {
        const token = UserService.getToken();
        if (!token) {
            window.location.replace("#login");
            return;
        }

        this.showWelcome(token);
        this.loadBooks(token);
        this.loadGenres(token);
        this.loadReviews(token);
    },

    showWelcome: function(token) {
        const user = Utils.parseJwt(token).user;
        const welcome = document.getElementById("welcomeMessage");
        if (welcome) {
            welcome.innerText = `Welcome, ${user.name}! (${user.role})`;
        }
    },

    getAuthHeader: function(token) {
        return { "Authorization": "Bearer " + token };
    },

    loadBooks: function(token) {
        $.ajax({
            url: Constants.PROJECT_BASE_URL() + "books",
            type: "GET",
            headers: this.getAuthHeader(token),
            success: function(data) { console.log("Books:", data); },
            error: function(xhr) { console.error("Failed to load books:", xhr.responseText); }
        });
    },

    loadGenres: function(token) {
        $.ajax({
            url: Constants.PROJECT_BASE_URL() + "genres",
            type: "GET",
            headers: this.getAuthHeader(token),
            success: function(data) { console.log("Genres:", data); },
            error: function(xhr) { console.error("Failed to load genres:", xhr.responseText); }
        });
    },

    loadReviews: function(token) {
        $.ajax({
            url: Constants.PROJECT_BASE_URL() + "reviews",
            type: "GET",
            headers: this.getAuthHeader(token),
            success: function(data) { console.log("Reviews:", data); },
            error: function(xhr) { console.error("Failed to load reviews:", xhr.responseText); }
        });
    }
};
