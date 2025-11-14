<?php
require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/UserDao.php';


class UserService extends BaseService {
   public function __construct() {
       $dao = new UserDao();
       parent::__construct($dao);
   }
    public function getAllUsers() {
        return $this->dao->getAll();
    }
    public function getUserById($id) {
        $user = $this->dao->getById($id);
        if (!$user) {
            throw new Exception("User not found!");
        }
        return $user;
    }
//////
        public function addUser($data) {
        if (empty($data['name'])) {
            throw new Exception("Name is required!");
        }
        
        if (empty($data['email'])) {
            throw new Exception("Email is required!");
        }
        return $this->dao->insert($data);
    }
    
    public function updateUser($id, $data) {
        $user = $this->dao->getById($id);
        if (!$user) {
            throw new Exception("User not found!");
        }
         return $this->dao->update($id, $data);
    }

////
   public function login($email, $password) {
    $user = $this->dao->getByEmail($email);

    if (!$user) {
        throw new Exception("User not found.");
    }

    if (!password_verify($password, $user['password'])) {
    throw new Exception("Incorrect password");
    }

    return $user;
    }

        public function deleteUser($id) {
        $user = $this->dao->getById($id);
        if (!$user) {
            throw new Exception("User not found!");
        }
        
        return $this->dao->delete($id);
    }
}

?>