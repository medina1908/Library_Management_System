<?php
require_once 'BaseDao.php';

class GenreDao extends BaseDao { 
    public function __construct(){
        parent::__construct("genres");
    }

    public function getByName($name) {
        $stmt = $this->connection->prepare("SELECT * FROM genres WHERE name = :name");
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    public function updateName($genreId, $newName) {
        $stmt = $this->connection->prepare("UPDATE genres SET name = :name WHERE id = :id");
        $stmt->bindParam(':name', $newName);
        $stmt->bindParam(':id', $genreId);
        return $stmt->execute();
    }
    public function deleteByName($name) {
        $stmt = $this->connection->prepare("DELETE FROM genres WHERE name = :name");
        $stmt->bindParam(':name', $name);
        return $stmt->execute();
    }
}
?>