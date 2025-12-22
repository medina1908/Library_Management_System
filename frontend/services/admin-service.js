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
       $("#addStudentForm").off('submit').on('submit', function(e) {
           e.preventDefault();
           
           var formData = Object.fromEntries(new FormData(this).entries());
           console.log('Adding student:', formData);
           
           AdminService.addStudent(formData);
       });
       
       $("#editStudentForm").off('submit').on('submit', function(e) {
           e.preventDefault();
           
           var formData = Object.fromEntries(new FormData(this).entries());
           console.log('Editing student:', formData);
           
           AdminService.editStudent(formData);
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
       $('#addStudentForm button[type="submit"]').prop('disabled', true).text('Saving...');
       
       console.log('=== ADD STUDENT ===');
       console.log('Data to send:', student);
       
       $.ajax({
           url: Constants.PROJECT_BASE_URL + 'users',
           type: 'POST',
           headers: AdminService.getAuthHeaders(),
           data: JSON.stringify(student),
           success: function(response) {
               console.log('Student added successfully:', response);
               toastr.success("Student added successfully");
               AdminService.closeModal();
               AdminService.getAllStudents();
               
               $('#addStudentForm button[type="submit"]').prop('disabled', false).text('Save changes');
           },
           error: function(xhr) {
               console.error('Add student error:', xhr.responseText);
               toastr.error(xhr.responseJSON?.message || xhr.responseText || "Error adding student");
               $('#addStudentForm button[type="submit"]').prop('disabled', false).text('Save changes');
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
       $('#editStudentForm button[type="submit"]').prop('disabled', true).text('Loading...');
       
       $.ajax({
           url: Constants.PROJECT_BASE_URL + 'users/' + id,
           type: 'GET',
           headers: AdminService.getAuthHeaders(),
           success: function(data) {
               console.log('User loaded for edit:', data);
               $('#editStudentForm input[name="id"]').val(data.id);
               $('#editStudentForm input[name="name"]').val(data.name);
               $('#editStudentForm input[name="email"]').val(data.email);
               $('#editStudentForm button[type="submit"]').prop('disabled', false).text('Save changes');
           },
           error: function(xhr) {
               console.error('Error loading user:', xhr.responseText);
               AdminService.closeModal();
               toastr.error('Error loading user data');
           }
       });
   },
   
   editStudent : function(student){
       console.log('=== EDIT STUDENT ===');
       console.log('Data to send:', student);
       
       $('#editStudentForm button[type="submit"]').prop('disabled', true).text('Saving...');
       
       $.ajax({
           url: Constants.PROJECT_BASE_URL + 'users/' + student.id,
           type: 'PUT',
           headers: AdminService.getAuthHeaders(),
           data: JSON.stringify(student),
           success: function(response) {
               console.log('Student updated:', response);
               toastr.success("Student edited successfully");
               AdminService.closeModal();
               AdminService.getAllStudents();
               $('#editStudentForm button[type="submit"]').prop('disabled', false).text('Save changes');
           },
           error: function(xhr) {
               console.error('Edit error:', xhr.responseText);
               toastr.error(xhr.responseJSON?.message || "Error editing student");
               $('#editStudentForm button[type="submit"]').prop('disabled', false).text('Save changes');
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
       
       $.ajax({
           url: Constants.PROJECT_BASE_URL + 'users/' + id,
           type: 'DELETE',
           headers: AdminService.getAuthHeaders(),
           success: function(response) {
               console.log('Student deleted:', response);
               toastr.success("Student deleted successfully");
               AdminService.closeModal();
               AdminService.getAllStudents();
           },
           error: function(xhr) {
               console.error('Delete error:', xhr.responseText);
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