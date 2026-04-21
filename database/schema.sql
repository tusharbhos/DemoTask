-- Admin Panel Database Schema
-- Run this file to set up the database

CREATE DATABASE IF NOT EXISTS admin_panel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE admin_panel;

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(191)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- States table
CREATE TABLE IF NOT EXISTS states (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  state_name  VARCHAR(100)  NOT NULL,
  status      ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_state_name (state_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  state_id    INT UNSIGNED  NOT NULL,
  city_name   VARCHAR(100)  NOT NULL,
  status      ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_city_per_state (state_id, city_name),
  CONSTRAINT fk_cities_state FOREIGN KEY (state_id)
    REFERENCES states(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed admin user (password: Admin@123)
-- bcrypt hash generated with 10 rounds
INSERT INTO admins (name, email, password) VALUES
('Super Admin', 'admin@demo.com', '$2a$10$harj0K.MEo1Z9/LzoHzAfOyIUIz3NcANzoDuhqM45fWr/2FX68T8C')
ON DUPLICATE KEY UPDATE id=id;
