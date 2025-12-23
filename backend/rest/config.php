<?php
class Config {
   public static function DB_NAME() {
       return Config::get_env("DB_NAME", "library_management_system");
   }
   public static function DB_PORT() {
       return Config::get_env("DB_PORT", 3306);
   }
   public static function DB_USER() {
       return Config::get_env("DB_USER", 'root');
   }
   public static function DB_PASSWORD() {
       return Config::get_env("DB_PASSWORD", '');
   }
   public static function DB_HOST() {
       return Config::get_env("DB_HOST", '127.0.0.1');
   }
   public static function JWT_SECRET() {
       return Config::get_env("JWT_SECRET", 'a-string-secret-at-least-256-bits-long');
   }
   public static function get_env($name, $default){
       return isset($_ENV[$name]) && trim($_ENV[$name]) != "" ? $_ENV[$name] : $default;
   }
}
