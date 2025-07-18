export const MAKEMAINTABLES = `
  CREATE SCHEMA IF NOT EXISTS members_only;

  CREATE TABLE IF NOT EXISTS members_only.users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    username VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(150) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS members_only.membership_status (
    code SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS members_only.membership (
    user_id INTEGER PRIMARY KEY,
    status_code INTEGER NOT NULL,
    CONSTRAINT membership_user_fk FOREIGN KEY (user_id) REFERENCES members_only.users(id) ON DELETE CASCADE,
    CONSTRAINT membership_status_fk FOREIGN KEY (status_code) REFERENCES members_only.membership_status(code) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS members_only.messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT messages_user_fk FOREIGN KEY (user_id) REFERENCES members_only.users(id) ON DELETE CASCADE
  );

  -- Add helpful indexes for faster joins and usually on FKs
  CREATE INDEX IF NOT EXISTS idx_membership_user_id ON members_only.membership(user_id);
  CREATE INDEX IF NOT EXISTS idx_membership_status_code ON members_only.membership(status_code);
  CREATE INDEX IF NOT EXISTS idx_messages_user_id ON members_only.messages(user_id);
`;

export const INSERTMEMBERSHIPSTATUS =`
  INSERT INTO members_only.membership_status(name)
  VALUES
    ('Admin'),
    ('Guest'),
    ('Member')
`;


export const CLEARALLDB = `
    DROP TABLE IF EXISTS 
      members_only.messages, 
      members_only.users, 
      members_only.membership_status 
      CASCADE;
`;