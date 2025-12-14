if (typeof toastr !== 'undefined') {
    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "timeOut": "2000",
        "showDuration": "300",
        "hideDuration": "500",
        "extendedTimeOut": "1000"
    };
}

var UserService = {
    init: function () {
        $("#authLoginForm").on("submit", function(e) {
            e.preventDefault();
            
            var entity = Object.fromEntries(new FormData(this).entries());
            UserService.login(entity);
        });
    },

    getToken: function() {
        return localStorage.getItem("user_token");
    },

    login: function (entity) {
        $.ajax({
            url: Constants.PROJECT_BASE_URL + "auth/login",
            type: "POST",
            data: JSON.stringify(entity),
            contentType: "application/json",
            dataType: "text",
            success: function (responseText) {
                console.log("Raw response:", responseText);

                var cleanResponse = responseText.substring(responseText.indexOf('{'));
                console.log("Cleaned response:", cleanResponse);

                try {
                    var result = JSON.parse(cleanResponse);
                    console.log("Parsed result:", result);

                    localStorage.setItem("user_token", result.data.token);

                    var user = Utils.parseJwt(result.data.token).user;
                    localStorage.setItem("user_role", user.role);

                    if (window.location.hash === "#dashboard" && typeof Dashboard !== 'undefined') {
                        Dashboard.init();
                    }

                  
                    if (user.role === Constants.ADMIN_ROLE) {
                        window.location.replace("#admin");
                    } else if (user.role === Constants.STUDENT_ROLE) {
                        window.location.replace("#dashboard");
                    } else {
                        toastr.error("Unknown user role");
                        localStorage.clear();
                    }

                } catch (e) {
                    console.error("Parse error:", e);
                    toastr.error("Invalid server response");
                }
            },

            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("Server error response:", XMLHttpRequest.responseText);

                var text = XMLHttpRequest.responseText;
                if (text.includes('"message":"User logged in successfully"')) {
                    var cleanResponse = text.substring(text.indexOf('{'));
                    try {
                        var result = JSON.parse(cleanResponse);
                        localStorage.setItem("user_token", result.data.token);
                        
                        var user = Utils.parseJwt(result.data.token).user;
                        
                        if (user.role === Constants.ADMIN_ROLE) {
                            window.location.replace("#admin");
                        } else if (user.role === Constants.STUDENT_ROLE) {
                            window.location.replace("#dashboard");
                        }
                        return;
                    } catch(e) {
                        console.error("Error parsing fallback response:", e);
                    }
                }

                let msg = "Error";
                try {
                    var cleanResponse = text.substring(text.indexOf('{'));
                    const res = JSON.parse(cleanResponse);
                    msg = res.message || res.error || msg;
                } catch {}
                toastr.error(msg);
            }
        });
    },

    logout: function () {
        localStorage.clear();
        window.location.replace("#login");
    },

    generateMenuItems: function () {
        const navDesktop = document.getElementById("navmenu-desktop");
        const navMobile = document.getElementById("navmenu-mobile");
        
        if (!navDesktop) return; 
        
        navDesktop.innerHTML = "";
        const token = localStorage.getItem("user_token");
        const currentView = window.location.hash;

        if (!token && (currentView === "#login" || currentView === "#register")) return;
        else if (!token) return window.location.replace("#login");
        else if (token && (currentView === "#login" || currentView === "#register")) return window.location.replace("#dashboard");

        const user = Utils.parseJwt(token).user;

        navDesktop.innerHTML += `
            <li><a href="#home">Home</a></li>
            <li><a href="#about"><span>About</span></a></li>
            <li><a href="#announcements">Announcements</a></li>
        `;

        if (user.role === Constants.ADMIN_ROLE) {
            navDesktop.innerHTML += `<li><a href="#admin">Admin Dashboard</a></li>`;
        }
        if (user.role === Constants.STUDENT_ROLE) {
            navDesktop.innerHTML += `<li><a href="#dashboard">Student Dashboard</a></li>`;
        }

        navDesktop.innerHTML += `
            <li class="nav-item mx-0 mx-lg-1">
                <button class="btn btn-danger ms-3" onclick="UserService.logout()">Logout</button>
            </li>
        `;

        if (navMobile) {
            navMobile.innerHTML = navDesktop.innerHTML;
        }
    },

    checkAuth: function () {
        const token = localStorage.getItem("user_token");
        if (!token) return window.location.replace("#login");

        try {
            const user = Utils.parseJwt(token).user;
            const currentView = window.location.hash;

            if (currentView.startsWith("#admin") && user.role !== Constants.ADMIN_ROLE) {
                toastr.warning("Access denied. Redirecting to student dashboard...");
                return window.location.replace("#dashboard");
            }
            if (currentView.startsWith("#dashboard") && user.role !== Constants.STUDENT_ROLE) {
                toastr.warning("Access denied. Redirecting to admin dashboard...");
                return window.location.replace("#admin");
            }

        } catch (e) {
            console.error("Auth check error:", e);
            localStorage.clear();
            return window.location.replace("#login");
        }
    }
};