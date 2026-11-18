from flask import Flask, jsonify, request, render_template
import sqlite3

app = Flask(__name__)

# Conectar ao banco de dados
def conectar_banco():
    conexao = sqlite3.connect("tarefas.db")
    conexao.row_factory = sqlite3.Row
    return conexao


# Criar a tabela de tarefas
def criar_tabela():
    conexao = conectar_banco()

    conexao.execute("""
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao TEXT NOT NULL,
            concluida INTEGER DEFAULT 0
        )
    """)

    conexao.commit()
    conexao.close()


# Página inicial
@app.route("/")
def inicio():
    return render_template("index.html")


# Listar tarefas
@app.route("/api/tarefas", methods=["GET"])
def listar_tarefas():
    conexao = conectar_banco()

    tarefas = conexao.execute(
        "SELECT * FROM tarefas ORDER BY id DESC"
    ).fetchall()

    conexao.close()

    return jsonify([dict(tarefa) for tarefa in tarefas])


# Adicionar tarefa
@app.route("/api/tarefas", methods=["POST"])
def adicionar_tarefa():
    dados = request.get_json()

    if not dados or not dados.get("descricao", "").strip():
        return jsonify({"erro": "Digite uma tarefa."}), 400

    descricao = dados["descricao"].strip()

    conexao = conectar_banco()

    conexao.execute(
        "INSERT INTO tarefas (descricao) VALUES (?)",
        (descricao,)
    )

    conexao.commit()
    conexao.close()

    return jsonify({"mensagem": "Tarefa adicionada com sucesso!"}), 201


# Concluir tarefa
@app.route("/api/tarefas/<int:id>/concluir", methods=["PUT"])
def concluir_tarefa(id):
    conexao = conectar_banco()

    resultado = conexao.execute(
        "UPDATE tarefas SET concluida = 1 WHERE id = ?",
        (id,)
    )

    conexao.commit()
    conexao.close()

    if resultado.rowcount == 0:
        return jsonify({"erro": "Tarefa não encontrada."}), 404

    return jsonify({"mensagem": "Tarefa concluída!"})


# Excluir tarefa
@app.route("/api/tarefas/<int:id>", methods=["DELETE"])
def excluir_tarefa(id):
    conexao = conectar_banco()

    resultado = conexao.execute(
        "DELETE FROM tarefas WHERE id = ?",
        (id,)
    )

    conexao.commit()
    conexao.close()

    if resultado.rowcount == 0:
        return jsonify({"erro": "Tarefa não encontrada."}), 404

    return jsonify({"mensagem": "Tarefa excluída!"})


# Iniciar o sistema
if __name__ == "__main__":
    criar_tabela()
    app.run(debug=True)