create database db_name;
create user db_user;
grant all on db_name.* to 'db_user'@'localhost' identified by 'db_password';
