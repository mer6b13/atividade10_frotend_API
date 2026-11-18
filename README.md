# Frontend Consumindo a API de Tarefas

## Objetivo

Desenvolver uma página web simples para consumir uma API de tarefas, permitindo a comunicação entre frontend e backend utilizando JavaScript e Fetch API.

## Funcionalidades

- Listar tarefas cadastradas.
- Adicionar novas tarefas.
- Concluir tarefas.
- Excluir tarefas.
- Exibir mensagens de erro quando uma requisição falhar.
- Filtrar tarefas por todas, concluídas ou pendentes.

## Tecnologias utilizadas

- Python
- Flask
- HTML5
- CSS3
- JavaScript
- Fetch API
- SQLite

## Estrutura do projeto

```text
atividade-frontend-api-nova/
├── app.py
├── requirements.txt
├── tarefas.db
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

## Como executar o projeto

### 1. Criar o ambiente virtual

```bash
python3 -m venv venv
```

### 2. Ativar o ambiente virtual

```bash
source venv/bin/activate
```

### 3. Instalar as dependências

```bash
pip install -r requirements.txt
```

### 4. Executar a aplicação

```bash
python3 app.py
```

### 5. Acessar no navegador

```text
http://127.0.0.1:5000
```

## Métodos HTTP utilizados

| Método | Funcionalidade |
|---|---|
| GET | Listar tarefas |
| POST | Adicionar tarefas |
| PUT | Concluir tarefas |
| DELETE | Excluir tarefas |

## Desafio extra

Foi implementado um sistema de filtros que permite visualizar todas as tarefas, somente as concluídas ou somente as pendentes.

## Conclusão

O projeto permitiu praticar a integração entre frontend e backend, utilizando JavaScript e Fetch API para realizar requisições HTTP e manipular informações armazenadas em um banco de dados SQLite.