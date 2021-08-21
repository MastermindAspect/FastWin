
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username TEXT,
    passHash TEXT,
    email TEXT
);

CREATE TABLE hubs (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    hubName TEXT,
    description TEXT,
    game TEXT,
    creationDate TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE tournaments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    tournamentName TEXT,
    description TEXT,
    game TEXT,
    maxPlayers INT NOT NULL,
    creationDate TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE tournament_info (
    tournamentId INT NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (tournamentId) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE hub_subscriptions (
    hubId INT NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (hubId) REFERENCES hubs(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE posts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    hubId INT,
    userId INT,
    author TEXT,
    title TEXT,
    content TEXT,
    creationDate TEXT,
    FOREIGN KEY (hubId) REFERENCES hubs(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

