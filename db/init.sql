CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username TEXT,
    passHash TEXT,
    email TEXT
);

CREATE TABLE hubs (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ownerId INT,
    hubName TEXT,
    description TEXT,
    game TEXT,
    creationDate TEXT,
    FOREIGN KEY (ownerId) REFERENCES users(id)
);

CREATE TABLE tournaments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ownerId INT,
    tournamentName TEXT,
    description TEXT,
    game TEXT,
    maxPlayers INT NOT NULL,
    creationDate TEXT,
    FOREIGN KEY (ownerId) REFERENCES users(id)
);

CREATE TABLE tournament_info (
    tournamentId INT NOT NULL,
    userId INT NOT NULL,
    PRIMARY KEY (tournamentId, userId)
);


CREATE TABLE teams (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ownerId INT,
    teamName TEXT,
    game TEXT,
    creationDate TEXT,
    FOREIGN KEY (ownerId) REFERENCES users(id)
);

CREATE TABLE hub_subscriptions (
    hubId INT NOT NULL,
    userId INT NOT NULL,
    PRIMARY KEY (hubId, userId)
);

CREATE TABLE posts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    hubId INT,
    userId INT,
    title TEXT,
    content TEXT,
    creationDate TEXT,
    FOREIGN KEY (hubId) REFERENCES hubs(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

INSERT INTO users (username, passHash, email) VALUES ("john", "snow", "a@email.com");
INSERT INTO hubs (hubName,description, game, creationDate) VALUES ("Test", "best hub","csgo", "1-1-1-1");