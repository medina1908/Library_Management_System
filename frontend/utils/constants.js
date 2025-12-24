let Constants = {
    PROJECT_BASE_URL: function() {
        if(location.hostname === "localhost") {
            return "http://localhost/Library_Management_System/backend/";
        } else {
            return "https://library-backend-app-d9fng.ondigitalocean.app/";
        }
    },
    ADMIN_ROLE: "Admin",
    STUDENT_ROLE: "Student",
}
