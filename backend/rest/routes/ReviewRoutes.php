<?php
/**
 * @OA\Get(
 *     path="/reviews",
 *     tags={"reviews"},
 *     summary="Get all reviews",
 *     @OA\Response(
 *         response=200,
 *         description="Array of all reviews in the database"
 *     )
 * )
 */
Flight::route('GET /reviews', function(){
    Flight::json(Flight::reviewService()->getAllReviews());
});

/**
 * @OA\Get(
 *     path="/reviews/user/{userId}",
 *     tags={"reviews"},A
 *     summary="Get all reviews by a specific user",
 *     @OA\Parameter(
 *         name="userId",
 *         in="path",
 *         required=true,
 *         description="ID of the user",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns all reviews created by the specified user"
 *     )
 * )
 */

Flight::route('GET /reviews/user/@userId', function($userId){
    Flight::json(Flight::reviewService()->getReviewsByUser($userId));
});

/**
 * @OA\Get(
 *     path="/reviews/book/{bookId}",
 *     tags={"reviews"},
 *     summary="Get all reviews for a specific book",
 *     @OA\Parameter(
 *         name="bookId",
 *         in="path",
 *         required=true,
 *         description="ID of the book",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns all reviews for the specified book"
 *     )
 * )
 */
Flight::route('GET /reviews/book/@bookId', function($bookId){
    Flight::json(Flight::reviewService()->getReviewsByBook($bookId));
});
/**
 * @OA\Post(
 *     path="/reviews",
 *     tags={"reviews"},
 *     summary="Add a new review",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"user_id", "book_id", "rating", "text"},
 *             @OA\Property(property="user_id", type="integer", example=1),
 *             @OA\Property(property="book_id", type="integer", example=1),
 *             @OA\Property(property="rating", type="integer", example=5),
 *             @OA\Property(property="text", type="string", example="Great book")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="New review created successfully"
 *     )
 * )
 */
Flight::route('POST /reviews', function(){
    $data = Flight::request()->data->getData();
    $result = Flight::reviewService()->createReview($data);
    Flight::json($result);
});

/**
 * @OA\Put(
 *     path="/reviews/{reviewId}",
 *     tags={"reviews"},
 *     summary="Update an existing review by ID",
 *     @OA\Parameter(
 *         name="reviewId",
 *         in="path",
 *         required=true,
 *         description="Review ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"text"},
 *             @OA\Property(property="text", type="string", example="Updated review text")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Review updated successfully"
 *     )
 * )
 */
Flight::route('PUT /reviews/@reviewId', function($reviewId){
  //  Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $data = Flight::request()->data->getData();
    $result = Flight::reviewService()->updateReviewText($reviewId, $data['text']);
    Flight::json($result);
});
/**
 * @OA\Delete(
 *     path="/reviews/{reviewId}",
 *     tags={"reviews"},
 *     summary="Delete a review by ID",
 *     @OA\Parameter(
 *         name="reviewId",
 *         in="path",
 *         required=true,
 *         description="ID of the review to delete",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Review deleted successfully"
 *     ),
 * )
 */
Flight::route('DELETE /reviews/@reviewId', function($reviewId){
    Flight::auth_middleware()->authorizeRole(Roles::ADMIN);
    $result = Flight::reviewService()->deleteReview($reviewId);
    Flight::json($result);
});
?>
