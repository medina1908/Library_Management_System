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
   
   public function addUser($data) {
       if (empty($data['name'])) {
           throw new Exception("Name is required!");
       }
       
       if (empty($data['email'])) {
           throw new Exception("Email is required!");
       }
       
       if (empty($data['password'])) {
           throw new Exception("Password is required!");
       }
       $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
       $data['created_at'] = date('Y-m-d H:i:s'); 
       if (empty($data['role'])) {
           $data['role'] = 'Student';
       }
       
       return $this->dao->add($data);
   }
   
   public function updateUser($id, $data) {
       $user = $this->dao->getById($id);
       if (!$user) {
           throw new Exception("User not found!");
       }
       
       if (!empty($data['password'])) {
           $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
       } else {
           unset($data['password']); 
       }
       
       return $this->dao->update($data, $id);
   }
   
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