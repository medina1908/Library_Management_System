<?php
require_once __DIR__ . '/BaseDao.php';


class AuthDao extends BaseDao {
   protected $table;


   public function __construct() {
       $this->table = "users";
       parent::__construct($this->table);
   }


   public function get_user_by_email($email) {
       $query = "SELECT * FROM " . $this->table . " WHERE email = :email";
       return $this->query_unique($query, ['email' => $email]);
   }
}
