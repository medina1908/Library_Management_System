<?php
/**
 * @OA\Get(
 *      path="/genres",
 *      tags={"genres"},
 *      summary="Get all genres",
 *      @OA\Response(
 *           response=200,
 *           description="Array of all genres in the database"
 *      )
 * )
 */
Flight::route('GET /genres', function(){
    Flight::json(Flight::genreService()->getAllGenres());
});

/**
 * @OA\Get(
 *     path="/genres/{name}",
 *     tags={"genres"},
 *     summary="Get genre by name",
 *     @OA\Parameter(
 *         name="name",
 *         in="path",
 *         required=true,
 *         description="Name of the genre",
 *         @OA\Schema(type="string", example="science")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns the genre with the given name"
 *     )
 * )
 */
Flight::route('GET /genres/@name', function($name){
    Flight::json(Flight::genreService()->getGenreByName($name));
});

/**
 * @OA\Post(
 *     path="/genres",
 *     tags={"genres"},
 *     summary="Add a new genre",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name"},
 *             @OA\Property(property="name", type="string", example="Science Fiction")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="New genre created successfully"
 *     )
 * )
 */
Flight::route('POST /genres', function(){
    $data = Flight::request()->data->getData();
    $result = Flight::genreService()->createGenre($data);
    Flight::json($result);
});
/**
 * @OA\Put(
 *     path="/genres/{id}",
 *     tags={"genres"},
 *     summary="Update an existing genre by ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Genre ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name"},
 *             @OA\Property(property="name", type="string", example="Mystery")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Genre updated successfully"
 *     )
 * )
 */
Flight::route('PUT /genres/@id', function($id){
    $data = Flight::request()->data->getData();
    $result = Flight::genreService()->updateGenreName($id, $data['name']);
    Flight::json($result);
});
/**
 * @OA\Delete(
 *     path="/genres/{name}",
 *     tags={"genres"},
 *     summary="Delete a genre by name",
 *     @OA\Parameter(
 *         name="name",
 *         in="path",
 *         required=true,
 *         description="Name of the genre to delete",
 *         @OA\Schema(type="string", example="Horror")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Genre deleted successfully"
 *     )
 * )
 */
Flight::route('DELETE /genres/@name', function($name){
    $result = Flight::genreService()->deleteGenreByName($name);
    Flight::json($result);
});


?>
