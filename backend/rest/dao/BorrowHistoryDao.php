<?php
require_once 'BaseDao.php';

class BorrowHistoryDao extends BaseDao {
    public function __construct() {
        parent::__construct("borrow_history");
    }

    public function getByUserId($userId) {
        $stmt = $this->connection->prepare("SELECT * FROM borrow_history WHERE user_id = :user_id");
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getByStatus($status) {
        $stmt = $this->connection->prepare("SELECT * FROM borrow_history WHERE status = :status");
        $stmt->bindParam(':status', $status);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    public function updateStatus($id, $status) {
        $stmt = $this->connection->prepare("UPDATE borrow_history SET status = :status WHERE id = :id");
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function markAsReturned($id, $returnDate) {
        $stmt = $this->connection->prepare("UPDATE borrow_history SET return_date = :return_date, status = 'RETURNED' WHERE id = :id");
        $stmt->bindParam(':return_date', $returnDate);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}


?>