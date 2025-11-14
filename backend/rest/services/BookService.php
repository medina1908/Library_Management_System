<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/BookDao.php';

class BookService extends BaseService {
   public function __construct() {
       $dao = new BookDao();
       parent::__construct($dao);
   } 
    
    public function getAllBooks() {
        return $this->dao->getAll();
    }

    public function getBookById($id) {
        $book = $this->dao->getById($id);
        if (!$book) {
            throw new Exception("Book not found!");
        }
        return $book;
    }
    
    public function addBook($data) {
        if (empty($data['title'])) {
            throw new Exception("Title is required!");
        }
        
        if (empty($data['isbn'])) {
            throw new Exception("ISBN is required!");
        } 
        
        if (empty($data['author'])) {
            throw new Exception("Author is required!");
        }
        
        $existing = $this->dao->getByIsbn($data['isbn']);
        if ($existing) {
            throw new Exception("Book with ISBN {$data['isbn']} already exists!");
        }
        
        if (!isset($data['available_quantity'])) {
            $data['available_quantity'] = 0;
        }
        
        return $this->dao->insert($data);
    }
    
    public function updateBook($id, $data) {
        $book = $this->dao->getById($id);
        if (!$book) {
            throw new Exception("Book not found!");
        }
        
        if (isset($data['isbn']) && $data['isbn'] != $book['isbn']) {
            $existing = $this->dao->getByIsbn($data['isbn']);
            if ($existing) {
                throw new Exception("ISBN already exists!");
            }
        }
        
        return $this->dao->update($id, $data);
    }
    
    public function deleteBook($id) {
        $book = $this->dao->getById($id);
        if (!$book) {
            throw new Exception("Book not found!");
        }
        
        return $this->dao->delete($id);
    }
    
    public function getByGenre($genreId) {
        return $this->dao->getByGenreId($genreId);
    }
    
    public function getByIsbn($isbn) {
        return $this->dao->getByIsbn($isbn);
    }
}
?>