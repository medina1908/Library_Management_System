<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/GenreDao.php';

class GenreService extends BaseService {
    public function __construct() {
        $dao = new GenreDao();
        parent::__construct($dao);
    } 

    public function getAllGenres() {
        return $this->dao->getAll();
    }
    
    public function createGenre($data) {
        if (empty($data['name'])) {
            throw new Exception("Genre name is required.");
        }
        if ($this->dao->getByName($data['name'])) {
            throw new Exception("Genre already exists.");
        }

        return $this->dao->add($data);
    }

    public function updateGenreName($genreId, $data) {
        if (empty($data['name'])) {
            throw new Exception("New name cannot be empty.");
        }
        
        $genre = $this->dao->getById($genreId);
        if (!$genre) {
            throw new Exception("Genre not found!");
        } 
        
        $existing = $this->dao->getByName($data['name']);
        if ($existing && $existing['id'] != $genreId) {
            throw new Exception("Genre with this name already exists!");
        }
        
        return $this->dao->update($data, $genreId);
    }

    public function deleteGenre($genreId) {
        $genre = $this->dao->getById($genreId);
        if (!$genre) {
            throw new Exception("Genre not found!");
        }
        return $this->dao->delete($genreId);
    }

    public function deleteGenreByName($name) {
        $genre = $this->dao->getByName($name);
        if (!$genre) {
            throw new Exception("Genre not found!");
        }
        return $this->dao->deleteByName($name);
    }   
    
    public function getGenreByName($name) {
        return $this->dao->getByName($name);
    }
}
?>