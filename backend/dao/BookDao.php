<?php
require_once 'BaseDao.php';

class BookDao extends BaseDao {
    public function __construct(){
        parent::__construct("books");
    }
    public function getByGenreId($genreId) {
        $stmt = $this->connection->prepare("SELECT * FROM books WHERE genre_id = :genre_id");
        $stmt->bindParam(':genre_id', $genreId);
        $stmt->execute();
        return $stmt->fetchAll();
}
    public function getByIsbn($isbn) {
        $stmt = $this->connection->prepare("SELECT * FROM books WHERE isbn = :isbn");
        $stmt->bindParam(':isbn', $isbn);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function updateAvailableQuantity($bookId, $quantity) {
        $stmt = $this->connection->prepare("UPDATE books SET available_quantity = :quantity WHERE id = :id");
        $stmt->bindParam(':quantity', $quantity);
        $stmt->bindParam(':id', $bookId);
        return $stmt->execute();
    }

    public function decreaseAvailableQuantity($bookId) {
        $stmt = $this->connection->prepare("UPDATE books SET available_quantity = available_quantity - 1 WHERE id = :id AND available_quantity > 0");
        $stmt->bindParam(':id', $bookId);
        return $stmt->execute();
    }

    public function increaseAvailableQuantity($bookId) {
        $stmt = $this->connection->prepare("UPDATE books SET available_quantity = available_quantity + 1 WHERE id = :id");
        $stmt->bindParam(':id', $bookId);
        return $stmt->execute();
    }

    public function deleteByIsbn($isbn) {
        $stmt = $this->connection->prepare("DELETE FROM books WHERE isbn = :isbn");
        $stmt->bindParam(':isbn', $isbn);
        return $stmt->execute();
    }
}
?>