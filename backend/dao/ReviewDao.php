<?php
require_once 'BaseDao.php';

class ReviewDao extends BaseDao {
    public function __construct() {
        parent::__construct("reviews");
    }

    public function getByUserId($userId) {
        $stmt = $this->connection->prepare("SELECT * FROM reviews WHERE user_id = :user_id");
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    public function getAverageRating($bookId) {
        $stmt = $this->connection->prepare("SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE book_id = :book_id");
        $stmt->bindParam(':book_id', $bookId);
        $stmt->execute();
        return $stmt->fetch();
    }
    public function updateReviewText($reviewId, $newText) {
        $stmt = $this->connection->prepare("UPDATE reviews SET review_text = :review_text WHERE id = :id");
        $stmt->bindParam(':review_text', $newText);
        $stmt->bindParam(':id', $reviewId);
        return $stmt->execute();
    }
}

?>