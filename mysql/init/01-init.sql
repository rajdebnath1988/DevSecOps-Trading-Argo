CREATE DATABASE IF NOT EXISTS tradingapp
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'tradinguser'@'%'
  IDENTIFIED BY 'TradingPass@2024!';

GRANT ALL PRIVILEGES ON tradingapp.* TO 'tradinguser'@'%';

-- Read-only user for browser/tool access
CREATE USER IF NOT EXISTS 'readonly'@'%'
  IDENTIFIED BY 'ReadOnly@2024!';
GRANT SELECT ON tradingapp.* TO 'readonly'@'%';

FLUSH PRIVILEGES;
