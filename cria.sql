CREATE TABLE campanhas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    sistema_regras VARCHAR(50), -- D&D 5e, Pathfinder, etc.
    mestre_id INT, -- usuário que é o mestre
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE jogadores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE
);


CREATE TABLE personagens (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    classe VARCHAR(50),
    nivel INT DEFAULT 1,
    raca VARCHAR(50),
    pontos_vida INT,
    atributos JSONB, -- força, destreza, etc. (mais flexível)
    inventario JSONB,
    jogador_id INT REFERENCES jogadores(id),
    campanha_id INT REFERENCES campanhas(id)
);


CREATE TABLE missoes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    status VARCHAR(20) DEFAULT 'pendente', -- pendente, em andamento, concluída
    campanha_id INT REFERENCES campanhas(id)
);


CREATE TABLE locais (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50), -- cidade, dungeon, floresta...
    campanha_id INT REFERENCES campanhas(id)
);


CREATE TABLE sessoes (
    id SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    resumo TEXT,
    campanha_id INT REFERENCES campanhas(id)
);


CREATE TABLE personagem_missao (
    personagem_id INT REFERENCES personagens(id),
    missao_id INT REFERENCES missoes(id),
    PRIMARY KEY (personagem_id, missao_id)
);
