export const MAKEMAINTABLES = `
  CREATE SCHEMA IF NOT EXISTS members_only;

  CREATE TABLE IF NOT EXISTS members_only.users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    username VARCHAR(150) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS members_only.membership_status (
    code SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS members_only.membership (
    user_id INTEGER PRIMARY KEY UNIQUE,
    status_code INTEGER NOT NULL,
    CONSTRAINT membership_user_fk FOREIGN KEY (user_id) REFERENCES members_only.users(id) ON DELETE CASCADE,
    CONSTRAINT membership_status_fk FOREIGN KEY (status_code) REFERENCES members_only.membership_status(code) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS members_only.messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
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

export const INSERTDEFAULTUSERS = `
  INSERT INTO members_only.users(first_name, last_name, username, email, password, created_at)
  VALUES
    ('Alice',   'Johnson', 'alice01', 'alice01@example.com', '$2b$10$Xh3R0uNfIIIVv2zat48Td.17WdyTIbK1I5ciiMPA3He1/T1h.jNta', '2025-07-20 10:15:00'),
    ('Bob',     'Smith', 'bobster', 'bobster@example.com', '$2b$10$ESF9IKZ3Hmf/UG.RK6Zjfuc46mm015iChx4J6tc1OeKvHuqX.ScLC', '2025-07-20 10:16:00'),
    ('Charlie', 'Daniels', 'charlie.dev', 'charlie.dev@example.com', '$2b$10$j4y8r2EUtw5JtfyzQFjVk.mY8//s9v/PekIFRIUNWKQYBsfMvlwUe', '2025-07-20 10:17:00'),
    ('Dana',    'Kim', 'dana_k', 'dana_k@example.com', '$2b$10$PDQkCM9tD.jzxpsIyBvKuOByjIksLYeTif1.XVeFGA1X96TTZ2Jim', '2025-07-20 10:18:00'),
    ('Eliot',   'Xu', 'eliot_x', 'eliot_x@example.com', '$2b$10$2YZSPzpW.Anqai.tOvDPUOpxzw.Go7rUMBT3RopFaJdBDDKhLEyHu', '2025-07-20 10:19:00'),
    ('Frankie', 'Torres', 'frankie.tech', 'frankie.tech@example.com', '$2b$10$VZQ835GivfmgVXKpsyEkfe0wj/TcZTvFRDekl0jGOS0MvFnMn3Po6', '2025-07-20 10:20:00'),
    ('Grace',   'Miller', 'grace_77', 'grace_77@example.com', '$2b$10$W4ipuMp1lsgFcJ77OKdti.stV9qzwV0i6thKCfjhpOkvgLuV81Dy2', '2025-07-20 10:21:00'),
    ('Henry',   'Hawk', 'henryhawk', 'henryhawk@example.com', '$2b$10$TkQ1q87U2a7AhHc6HGYKWuwGFFBMeRaixCASI2F3mvTs8soZcnVzu', '2025-07-20 10:22:00'),
    ('Isabella','Quinn', 'isabella_q', 'isabella_q@example.com', '$2b$10$4CxbRLm0x9ph8qGUbTROk.96tqkh4sX6vy.dkNQ2gjPEEPBuLmz7C', '2025-07-20 10:23:00'),
    ('Jake',    'Devlin', 'jake_dev', 'jake_dev@example.com', '$2b$10$WVOq0PFCG/dkDEIPbQCqqur7Pyes9.Zc8XNa5s8e.ksABkgWg3SB.', '2025-07-20 10:24:00');
`;

export const INSERTDEFAULTMEMBERSSTAT = `
  INSERT INTO members_only.membership(user_id, status_code)
  VALUES
    (1,3),
    (2,3),
    (3,3),
    (4,2),
    (5,2),
    (6,3),
    (7,2),
    (8,3),
    (9,2),
    (10,2)
  ON CONFLICT (user_id) DO UPDATE SET status_code = EXCLUDED.status_code;
`;

export const INSERTFIRSTMESSAGES = `
  INSERT INTO members_only.messages (user_id, title, message, created_at)
  VALUES
    (1, 'Welcome!', 'Just joined the community—excited to be here!', '2025-07-20 11:00:00'),
    (2, 'Question about rules', 'Are there any posting guidelines?', '2025-07-20 11:01:00'),
    (3, 'First Post', 'Hey everyone, just testing the waters.', '2025-07-20 11:02:00'),
    (4, 'Nice to meet you all', 'Looking forward to some great discussions.', '2025-07-20 11:03:00'),
    (5, 'Tip for new members', 'Check out the FAQ before posting!', '2025-07-20 11:04:00'),
    (6, 'Site Feedback', 'Dark mode would be amazing!', '2025-07-20 11:05:00'),
    (7, 'Weekly Check-in', 'Hope everyone is having a good week.', '2025-07-20 11:06:00'),
    (8, 'Need help with setup', 'Having trouble logging in from mobile.', '2025-07-20 11:07:00'),
    (9, 'Shoutout!', 'Big thanks to the mods for keeping things clean.', '2025-07-20 11:08:00'),
    (10, 'See you soon', 'Taking a short break, be back next week.', '2025-07-20 11:09:00');
`;

export const CLEARALLDB = `
    DROP TABLE IF EXISTS 
      members_only.messages, 
      members_only.users, 
      members_only.membership_status 
      CASCADE;
`;