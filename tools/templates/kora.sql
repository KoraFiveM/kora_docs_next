-- Kora Framework: create the txAdmin-selected database only.
-- txAdmin replaces KORA_DATABASE_NAME with {{dbName}} before execution.
-- No tables, inserts, deletes, or destructive statements.
CREATE DATABASE IF NOT EXISTS `KORA_DATABASE_NAME`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `KORA_DATABASE_NAME`;
