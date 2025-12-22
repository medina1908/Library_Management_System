<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/BorrowHistoryDao.php';
require_once __DIR__ . '/../dao/BookDao.php';
require_once __DIR__ . '/../dao/UserDao.php';

class BorrowHistoryService extends BaseService {

    private $bookDao;
    private $userDao; 

   public function __construct() {
       $dao = new BorrowHistoryDao();
       $this->bookDao = new BookDao();
       $this->userDao = new UserDao();
       parent::__construct($dao);
   }
        public function getAllBorrows() {
            return $this->dao->getAll();
        }

        public function borrowBook($userId, $bookId) {
        $user = $this->userDao->getById($userId);
        if (!$user) {
            throw new Exception("User not found!");
        }
        
        $book = $this->bookDao->getById($bookId);
        if (!$book) {
            throw new Exception("Book not found!");
        }
        
        if ($book['available_quantity'] <= 0) {
            throw new Exception("No available copies!");
        }
        
        $activeLoans = $this->dao->getByUserId($userId);
        foreach ($activeLoans as $loan) {
            if ($loan['book_id'] == $bookId && $loan['status'] == 'BORROWED') {
                throw new Exception("You already borrowed this book!");
            }
        }
        $this->bookDao->decreaseAvailableQuantity($bookId);
               
        
                $data = [
                    'user_id' => $userId,
                    'book_id' => $bookId,
                    'borrow_date' => date('Y-m-d'),
                    'due_date' => date('Y-m-d', strtotime('+14 days')),
                    'status' => 'BORROWED'
                ];
                
                return $this->dao->insert($data);
         }
        public function returnBook($borrowId) {
        $borrow = $this->dao->getById($borrowId);
        if (!$borrow) {
            throw new Exception("Borrow record not found!");
        }

        if ($borrow['status'] == 'RETURNED') {
            throw new Exception("Book already returned!");
        }
        
        $this->dao->markAsReturned($borrowId, date('Y-m-d'));
        $this->bookDao->increaseAvailableQuantity($borrow['book_id']);
        return true;
    }
     public function getUserBorrowHistory($userId) {
        return $this->dao->getByUserId($userId);
    }
    
    public function getActiveBorrows() {
        return $this->dao->getByStatus('BORROWED');
    }
    
    public function getReturnedBorrows() {
        return $this->dao->getByStatus('RETURNED');
    }
    
    public function getOverdueBorrows() {
        return $this->dao->getByStatus('OVERDUE');
    }

}
?>
