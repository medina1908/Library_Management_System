let AdminService = {
   init: function () {
       const token = localStorage.getItem('user_token');
       
       if (!token) {
           window.location.replace("#login");
           return;
       }
       
       try {
           const user = Utils.parseJwt(token).user;
           
           if (user.role !== Constants.ADMIN_ROLE) {
               toastr.error('You can not enter!');
               setTimeout(function() {
                   if (user.role === Constants.STUDENT_ROLE) {
                       window.location.replace("#dashboard");
                   } else {
                       window.location.replace("#login");
                   }
               }, 1500);
               return;
           }
           
           $('.user-info').html(`Welcome, <strong>${user.name}</strong>`);
           
       } catch (e) {
           console.error('Token parsing error:', e);
           localStorage.clear();
           window.location.replace("#login");
           return;
       }
       
       AdminService.initForms();
       AdminService.getAllStudents();
   },
   initForms: function() {
    $("#addStudentForm").validate({
        rules: {
            name: {
                required: true,
                minlength: 2,
                maxlength: 40  
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 8
            },
            role: {
                required: true
            }
        },
        messages: {
            name: {
                required: "Please enter first and last name",
                minlength: "Name must be at least 2 characters long",
                maxlength: "Name cannot exceed 40 characters"  
            }, 
            email: {
                required: "Please enter an email address",
                email: "Please enter a valid email address" 
            },
            password: {
                required: "Please enter a password",
                minlength: "Password must be at least 8 characters" 
            },
            role: {
                required: "Please choose role"
            }
        }
    });
    
  $("#editStudentForm").validate({  
        rules: {
            name: {
                required: true,
                minlength: 2,
                maxlength: 40
            },
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            name: {
                required: "Please enter student name",
                minlength: "Name must be at least 2 characters",
                maxlength: "Name cannot exceed 40 characters"
            },
            email: {
                required: "Please enter email address",
                email: "Please enter a valid email address"
            }
        }
    });
},

   
   getAuthHeaders: function() {
       const token = localStorage.getItem('user_token');
       return {
           'Authorization': 'Bearer ' + token,
           'Content-Type': 'application/json'
       };
   },
   
   openAddModal : function() {
       $('#addStudentModal').show();
       $('#addStudentForm')[0].reset();
   },
   
   addStudent: function (student) {
     $.blockUI({ message: '<h3>Adding student...</h3>' });
       console.log('=== ADD STUDENT ===');
       console.log('Data to send:', student);
       
       $.ajax({
           url: Constants.PROJECT_BASE_URL + 'users',
           type: 'POST',
           headers: AdminService.getAuthHeaders(),
           data: JSON.stringify(student),
           success: function(response) {
               console.log('Student added successfully:', response);
                $.unblockUI(); 
               toastr.success("Student added successfully");
               AdminService.closeModal();
               AdminService.getAllStudents();
               
               $('#addStudentForm button[type="submit"]').prop('disabled', false).text('Save changes');
           },
           error: function(xhr) {
               console.error('Add student error:', xhr.responseText);
                $.unblockUI();
               toastr.error(xhr.responseJSON?.message || xhr.responseText || "Error adding student");
              // $('#addStudentForm button[type="submit"]').prop('disabled', false).text('Save changes');
           }
       });
   },
   
   getAllStudents : function(){
       console.log('=== Fetching all students ===');
       
       $.ajax({
           url: Constants.PROJECT_BASE_URL + 'users',
           type: 'GET',
           headers: AdminService.getAuthHeaders(),
           success: function(data) {
               console.log('Students loaded successfully:', data);
               
               if (!Array.isArray(data)) {
                   console.error('Data is not an array:', data);
                   toastr.error('Invalid data format received');
                   return;
               }
               
               Utils.datatable('students-table', [
                   { data: 'name', title: 'Name' },
                   { data: 'email', title: 'Email' },
                   { data: 'role', title: 'Role' },
                   {
                       title: 'Actions',
                       render: function (data, type, row) {
                           return `<div class="d-flex justify-content-center gap-2 mt-3">
                               <button class="btn btn-primary btn-sm" onclick="AdminService.openEditModal(${row.id})">Edit</button>
                               <button class="btn btn-danger btn-sm" onclick="AdminService.openDeleteModal(${row.id}, '${row.name}')">Delete</button>
                           </div>`;
                       }
                   }
               ], data, 10);
           },
           error: function(xhr, status, error) {
               console.error('=== ERROR LOADING STUDENTS ===');
               console.error('Status:', xhr.status);
               console.error('Response:', xhr.responseText);
               
               if (xhr.status === 401) {
                   toastr.error('Session expired. Please login again.');
                   localStorage.clear();
                   window.location.replace("#login");
               } else {
                   toastr.error('Error loading users');
               }
           }
       });
   },
   
   openEditModal : function(id) {
       $('#editStudentModal').show();
       $.blockUI({ message: '<h3>Loading...</h3>' });
      // $('#editStudentForm button[type="submit"]').prop('disabled', true).text('Loading...');
       
       $.ajax({
           url: Constants.PROJECT_BASE_URL + 'users/' + id,
           type: 'GET',
           headers: AdminService.getAuthHeaders(),
           success: function(data) {
               console.log('User loaded for edit:', data);
               $('#editStudentForm input[name="id"]').val(data.id);
               $('#editStudentForm input[name="name"]').val(data.name);
               $('#editStudentForm input[name="email"]').val(data.email);
               //$('#editStudentForm button[type="submit"]').prop('disabled', false).text('Save changes');
               $.unblockUI();
           },
           error: function(xhr) {
               console.error('Error loading user:', xhr.responseText);
               $.unblockUI();
               AdminService.closeModal();
               toastr.error('Error loading user data');
           }
       });
   },
   
   editStudent : function(student){
       console.log('=== EDIT STUDENT ===');
       console.log('Data to send:', student);
       
       $.blockUI({ message: '<h3>Updating student...</h3>' });
      // $('#editStudentForm button[type="submit"]').prop('disabled', true).text('Saving...');
       
       $.ajax({
           url: Constants.PROJECT_BASE_URL + 'users/' + student.id,
           type: 'PUT',
           headers: AdminService.getAuthHeaders(),
           data: JSON.stringify(student),
           success: function(response) {
               console.log('Student updated:', response);
               toastr.success("Student edited successfully");
               $.unblockUI();
               AdminService.closeModal();
               AdminService.getAllStudents();
               //$('#editStudentForm button[type="submit"]').prop('disabled', false).text('Save changes');
           },
           error: function(xhr) {
               console.error('Edit error:', xhr.responseText);
               $.unblockUI();
               toastr.error(xhr.responseJSON?.message || "Error editing student");
               //$('#editStudentForm button[type="submit"]').prop('disabled', false).text('Save changes');
           }
       });
   },
   
   openDeleteModal: function(id, name) {
       $("#deleteStudentModal").modal("show");
       $("#delete-student-body").html("Do you want to delete user: <strong>" + name + "</strong>?");
       $("#delete_student_id").val(id);
   },
   
   deleteStudent: function () {
       const id = $("#delete_student_id").val();
       
       console.log('=== DELETE STUDENT ===');
       console.log('User ID:', id);
       $.blockUI({ message: '<h3>Deleting student...</h3>' });
       $.ajax({
           url: Constants.PROJECT_BASE_URL + 'users/' + id,
           type: 'DELETE',
           headers: AdminService.getAuthHeaders(),
           success: function(response) {
               console.log('Student deleted:', response);
               $.unblockUI();
               toastr.success("Student deleted successfully");
               AdminService.closeModal();
               AdminService.getAllStudents();
           },
           error: function(xhr) {
               console.error('Delete error:', xhr.responseText);
               $.unblockUI();
               toastr.error(xhr.responseJSON?.message || "Error deleting student");
           }
       });
   },
   
   closeModal : function() {
       $('#addStudentModal').hide();
       $('#editStudentModal').hide();
       $("#deleteStudentModal").modal("hide");
       
       $('#addStudentForm')[0].reset();
       $('#editStudentForm')[0].reset();
   }
};