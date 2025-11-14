<?php

/**
 * @OA\Get(
 *     path="/borrow/user/{id}",
 *     tags={"borrow"},
 *     summary="Get borrowed books by user ID",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID of the user",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Returns all borrowed books for the given user ID"
 *     )
 * )
 */
Flight::route('GET /borrow/user/@userId', function($userId){
    Flight::json(Flight::borrowHistoryService()->getUserBorrowHistory($userId));
});

/**
 * @OA\Get(
 *     path="/borrow/borrowed",
 *     tags={"borrow"},
 *     summary="Get all active borrowed books",
 *     @OA\Response(
 *         response=200,
 *         description="Returns all books that are currently borrowed (active loans)"
 *     )
 * )
 */
Flight::route('GET /borrow/borrowed', function(){
    Flight::json(Flight::borrowHistoryService()->getActiveBorrows());
});

/**
 * @OA\Get(
 *     path="/borrow/returned",
 *     tags={"borrow"},
 *     summary="Get all returned books",
 *     @OA\Response(
 *         response=200,
 *         description="Returns all books that have been returned"
 *     )
 * )
 */

Flight::route('GET /borrow/returned', function(){
    Flight::json(Flight::borrowHistoryService()->getReturnedBorrows());
});

/**
 * @OA\Get(
 *     path="/borrow/overdue",
 *     tags={"borrow"},
 *     summary="Get all overdue books",
 *     @OA\Response(
 *         response=200,
 *         description="Returns all books that are overdue"
 *     )
 * )
 */
Flight::route('GET /borrow/overdue', function(){
    Flight::json(Flight::borrowHistoryService()->getOverdueBorrows());
});

/**
 * @OA\Post(
 *     path="/borrow/{bookId}",
 *     tags={"borrow"},
 *     summary="Borrow a book",
 *     @OA\Parameter(
 *         name="bookId",
 *         in="path",
 *         required=true,
 *         description="ID of the book to borrow",
 *         @OA\Schema(type="integer", example=5)
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"user_id"},
 *             @OA\Property(property="user_id", type="integer", example=1)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Book successfully borrowed"
 *     )
 * )
 */
Flight::route('POST /borrow/@bookId', function($bookId){
    $data = Flight::request()->data->getData();
    $userId = $data['user_id']; 
    Flight::json(Flight::borrowHistoryService()->borrowBook($userId, $bookId));
});

/**
 * @OA\Post(
 *     path="/borrow/{borrowId}/return",
 *     tags={"borrow"},
 *     summary="Return a borrowed book",
 *     @OA\Parameter(
 *         name="borrowId",
 *         in="path",
 *         required=true,
 *         description="ID of the borrow record",
 *         @OA\Schema(type="integer", example=10)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Book successfully returned"
 *     )
 * )
 */
Flight::route('POST /borrow/@borrowId/return', function($borrowId){
    Flight::json(Flight::borrowHistoryService()->returnBook($borrowId));
});
?>
