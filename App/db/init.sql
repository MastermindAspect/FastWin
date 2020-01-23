CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username TEXT,
    passHash TEXT,
    email TEXT
);

CREATE TABLE IF NOT EXISTS hubs (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ownerId INT,
    hubName TEXT,
    creationDate TEXT,
    FOREIGN KEY (ownerId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS subscriptions (
    hubId INT,
    userId INT,
    PRIMARY KEY (hubId, userId),
    FOREIGN KEY (hubId) REFERENCES hubs(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS posts (
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