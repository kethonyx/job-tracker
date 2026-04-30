CREATE TABLE companies (
                           id BIGSERIAL PRIMARY KEY,
                           name VARCHAR(255),
                           position VARCHAR(255),
                           status VARCHAR(50),
                           user_id BIGINT,
                           FOREIGN KEY (user_id) REFERENCES users(id)
);