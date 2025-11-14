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
    $result = Flight::userService()->getAllUsers();

    foreach($result as &$user){
        unset($user['password']);
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
    $user = Flight::userService()->getUserById($id);
    //I will have special if statement when user is requesting his info
    //e.g profile page for changing password
    unset($user['password']);
    Flight::json($user);
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
    $data = Flight::request()->data->getData();
    $result = Flight::userService()->updateUser($id, $data);
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
    //I will add here logic to not delete user if it is admin
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