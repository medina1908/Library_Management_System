<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/ReviewDao.php';

class ReviewService extends BaseService {
    public function __construct() {
        $dao = new ReviewDao();
        parent::__construct($dao);
    } 

      public function getAllReviews() {
        return $this->dao->getAll();
    }

    public function getReviewsByUser($userId) {
        return $this->dao->getByUserId($userId);
    }

    public function getReviewsByBook($bookId) {
        return $this->dao->getByBookId($bookId);
    }

    public function getAverageRatingForBook($bookId) {
        $result = $this->dao->getAverageRating($bookId);
        if (!$result || $result['total_reviews'] == 0) {
            return [
                'avg_rating' => 0,
                'total_reviews' => 0
            ];
        }
        return $result;
    }

    public function createReview($data) {
        $existingReviews = $this->dao->getByUserId($data['user_id']);
        foreach ($existingReviews as $rev) {
            if ($rev['book_id'] == $data['book_id']) {
                throw new Exception("User has already reviewed this book.");
            }
        }

        return $this->create($data); 
    }

    public function updateReviewText($reviewId, $newText) {
        if (empty(trim($newText))) {
            throw new Exception("Review text cannot be empty.");
        }
        return $this->dao->updateReviewText($reviewId, $newText);
    }

public function deleteReview($reviewId) {
    $review = $this->dao->getById($reviewId);
    if (!$review) {
        throw new Exception("Review not found!");
    }
    return $this->dao->delete($reviewId);
}
}
?>
