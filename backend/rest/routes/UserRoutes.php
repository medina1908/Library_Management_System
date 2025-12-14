<?php
/**
* @OA\Get(
*      path="/users",
*      tags={"users"},
*      security={
*         {"ApiKey": {}}
*      },
*      summary="Get all users",
*      @OA\Response(
*           response=200,
*           description="Array of all users in the database"
*      ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
* )
*/
Flight::route('GET /users', function(){
    Flight::auth_middleware()->authorizeRoles([Roles::STUDENT,Roles::ADMIN]);
    $user = Flight::get('user');
    $result;

    if($user->role == Roles::ADMIN){
        // PROMIJENITE: get_all() -> getAllUsers()
        $result = Flight::userService()->getAllUsers();
        foreach($result as &$user){
            unset($user['password']);
        }
    }else{
        // PROMIJENITE: get_by_id() -> getUserById()
        $result = Flight::userService()->getUserById($user->id);
    }

    Flight::json($result);
});

/**
 * @OA\Get(
 *     path="/users/{id}",
 *     tags={"users"},
 *     security={
 *         {"ApiKey": {}}
 *     },
 *     summary="Fetch individual user by ID.",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="User ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Fetch individual user."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('GET /users/@id', function($id){
   $user = Flight::get('user'); 

    if($user->role == Roles::STUDENT && $user->id != $id){
        Flight::halt(403, "Access denied");
    }

    $result = Flight::userService()->getUserById($id);
    unset($result['password']);
    Flight::json($result);
});

/**
 * @OA\Put(
 *     path="/users/{id}",
 *     summary="Update a user",
 *     description="Update user information.",
 *     tags={"users"},
 *     security={
 *         {"ApiKey": {}}
 *     },
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="User ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\RequestBody(
 *         description="Updated user information",
 *         required=false,
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="name",
 *                 type="string",
 *                 example="John Doe",
 *                 description="User full name"
 *             ),
 *             @OA\Property(
 *                 property="email",
 *                 type="string",
 *                 example="john.doe@gmail.com",
 *                 description="User email"
 *             ),
 *             @OA\Property(
 *                 property="password",
 *                 type="string",
 *                 example="password123",
 *                 description="User password"
 *             ),
 *             @OA\Property(
 *                 property="role",
 *                 type="string",
 *                 enum={"Admin", "Student", "Librarian"},
 *                 example="Student",
 *                 description="User role"
 *             ),
 *             @OA\Property(
 *                 property="status",
 *                 type="string",
 *                 enum={"Active", "Nonactive"},
 *                 example="Active",
 *                 description="User status"
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User has been updated successfully."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('PUT /users/@id', function($id){
    Flight::auth_middleware()->authorizeRoles([Roles::STUDENT,Roles::ADMIN]);
    $user = Flight::get('user');
    $data = Flight::request()->data->getData();
    $result;
    
    if($user->role == Roles::ADMIN){        
        
        if(!$data['id']){
            Flight::halt(400, "Please provide user id");
        }

        $user_id = $data['id'];

        if($data['id'] != $user->id){
            unset($data['room_id']);
            unset($data['password']);
            unset($data['phone']);
            unset($data['year']);
            unset($data['id']);
        }

        // PROMIJENITE: update() -> updateUser()
        $result = Flight::userService()->updateUser($user_id, $data);
    }else{
        unset($data['id']);
        unset($data['role']);
        unset($data['room_id']);
        unset($data['is_active']);
        // PROMIJENITE: update() -> updateUser()
        $result = Flight::userService()->updateUser($user->id, $data);
    }
    
    Flight::json($result);
});

/**
 * @OA\Post(
 *     path="/users",
 *     summary="Create a new user",
 *     description="Add a new user to the database.",
 *     tags={"users"},
 *     security={
 *         {"ApiKey": {}}
 *     },
 *     @OA\RequestBody(
 *         description="New user information",
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name", "email", "password"},
 *             @OA\Property(property="name", type="string", example="John Doe"),
 *             @OA\Property(property="email", type="string", example="john.doe@gmail.com"),
 *             @OA\Property(property="password", type="string", example="password123"),
 *             @OA\Property(property="role", type="string", enum={"Admin", "Student", "Librarian"}, example="Student"),
 *             @OA\Property(property="status", type="string", enum={"Active", "Nonactive"}, example="Active")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User created successfully."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('POST /users', function(){
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $data = Flight::request()->data->getData();
    $result = Flight::userService()->addUser($data);
    Flight::json($result);
});

/**
 * @OA\Delete(
 *     path="/users/{id}",
 *     summary="Delete a user by ID.",
 *     description="Delete a user from the database using their ID.",
 *     tags={"users"},
 *     security={
 *         {"ApiKey": {}}
 *     },
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="User ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User deleted successfully."
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error."
 *     )
 * )
 */
Flight::route('DELETE /users/@id', function($id){
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $result = Flight::userService()->deleteUser($id);
    Flight::json($result);
});

/**
 * @OA\Post(
 *     path="/login",
 *     tags={"users"},
 *     summary="User login",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"email", "password"},
 *             @OA\Property(property="email", type="string", example="john.doe@gmail.com"),
 *             @OA\Property(property="password", type="string", example="password123")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User logged in successfully"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Internal server error"
 *     )
 * )
 */
Flight::route('POST /login', function(){
    $data = Flight::request()->data->getData();
    $result = Flight::userService()->login($data['email'], $data['password']);
    unset($result['password']);
    Flight::json($result);
});
?>