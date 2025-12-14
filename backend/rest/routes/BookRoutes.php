<?php
/**
  * @OA\Get(
 *      path="/books",
 *      tags={"books"},
 *      summary="Get all books",
 *      @OA\Response(
 *           response=200,
 *           description="Array of all books in the database"
 *      )
 * )
*/
Flight::route('GET /books', function(){
    Flight::json(Flight::bookService()->getAllBooks());
});

/**
 * @OA\Get(
 *     path="/books/{id}",
 *     tags={"books"},
 *     summary="Get book by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the book",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns the book with the given ID"
 *     )
 * )
 */

Flight::route('GET /books/@id', function($id){
    Flight::json(Flight::bookService()->getBookById($id));
});

/**
 * @OA\Get(
 *     path="/books/genre/{id}",
 *     tags={"books"},
 *     summary="Get books by genre ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the genre",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns all books with the given genre ID."
 *     )
 * )
 */

Flight::route('GET /books/genre/@genreId', function($genreId){
    Flight::json(Flight::bookService()->getByGenre($genreId));
});

/**
 *  * @OA\Post(
 *     path="/books",
 *     tags={"books"},
 *     summary="Add a new book",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"title", "isbn", "author"},
 *             @OA\Property(property="title", type="string", example="Derviš i Smrt"),
 *             @OA\Property(property="isbn", type="string", example="978-3-16-148410-0"),
 *             @OA\Property(property="author", type="string", example="Meša Selimović"),
 *             @OA\Property(property="available_quantity", type="integer", example=5)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="New book added successfully"
 *     )
 * )
 */

Flight::route('POST /books', function(){
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $data = Flight::request()->data->getData();
    $result = Flight::bookService()->addBook($data);

    Flight::json($result);
});

/**
 * @OA\Put(
 *     path="/books/{id}",
 *     tags={"books"},
 *     summary="Update an existing book by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Book ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="title", type="string", example="Tvrđava"),
 *             @OA\Property(property="isbn", type="string", example="978-3-16-148410-1"),
 *             @OA\Property(property="author", type="string", example="Meša Selimović"),
 *             @OA\Property(property="available_quantity", type="integer", example=3)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Book updated successfully"
 *     )
 * )
 */
Flight::route('PUT /books/@id', function($id){
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $data = Flight::request()->data->getData();
    $result = Flight::bookService()->updateBook($id, $data);
    Flight::json($result);
});

/**
 * @OA\Delete(
 *     path="/books/{id}",
 *     tags={"books"},
 *     summary="Delete a book by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Book ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Book deleted"
 *     )
 * )
 */
Flight::route('DELETE /books/@id', function($id){
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $result = Flight::bookService()->deleteBook($id);
    Flight::json($result);
});
?>