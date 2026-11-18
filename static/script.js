const API_URL = "/api/tarefas";

const formulario = document.getElementById("form-tarefa");
const campoDescricao = document.getElementById("descricao");
const listaTarefas = document.getElementById("lista-tarefas");
const mensagem = document.getElementById("mensagem");

let tarefas = [];
let filtroAtual = "todas";

// Exibir mensagens na tela
function mostrarMensagem(texto, erro = false) {
    mensagem.textContent = texto;
    mensagem.style.color = erro ? "#dc2626" : "#16a34a";

    setTimeout(() => {
        mensagem.textContent = "";
    }, 3000);
}

// Listar tarefas utilizando GET
async function carregarTarefas() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar as tarefas.");
        }

        tarefas = await resposta.json();

        mostrarTarefas();

    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}

// Mostrar tarefas na página
function mostrarTarefas() {
    listaTarefas.innerHTML = "";

    const tarefasFiltradas = tarefas.filter(tarefa => {
        if (filtroAtual === "pendentes") {
            return tarefa.concluida === 0;
        }

        if (filtroAtual === "concluidas") {
            return tarefa.concluida === 1;
        }

        return true;
    });

    if (tarefasFiltradas.length === 0) {
        listaTarefas.innerHTML = "<li>Nenhuma tarefa encontrada.</li>";
        return;
    }

    tarefasFiltradas.forEach(tarefa => {
        const item = document.createElement("li");

        const descricao = document.createElement("span");
        descricao.textContent = tarefa.descricao;
        descricao.className = "descricao";

        if (tarefa.concluida === 1) {
            descricao.classList.add("concluida");
        }

        const acoes = document.createElement("div");
        acoes.className = "acoes";

        if (tarefa.concluida === 0) {
            const botaoConcluir = document.createElement("button");

            botaoConcluir.textContent = "Concluir";
            botaoConcluir.className = "btn-concluir";

            botaoConcluir.addEventListener("click", () => {
                concluirTarefa(tarefa.id);
            });

            acoes.appendChild(botaoConcluir);
        }

        const botaoExcluir = document.createElement("button");

        botaoExcluir.textContent = "Excluir";
        botaoExcluir.className = "btn-excluir";

        botaoExcluir.addEventListener("click", () => {
            excluirTarefa(tarefa.id);
        });

        acoes.appendChild(botaoExcluir);

        item.appendChild(descricao);
        item.appendChild(acoes);

        listaTarefas.appendChild(item);
    });
}

// Adicionar tarefa utilizando POST
formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const descricao = campoDescricao.value.trim();

    if (!descricao) {
        mostrarMensagem("Digite uma tarefa.", true);
        return;
    }

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                descricao: descricao
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || "Erro ao adicionar tarefa.");
        }

        campoDescricao.value = "";

        mostrarMensagem(dados.mensagem);

        await carregarTarefas();

    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
});

// Concluir tarefa utilizando PUT
async function concluirTarefa(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}/concluir`, {
            method: "PUT"
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || "Erro ao concluir tarefa.");
        }

        mostrarMensagem(dados.mensagem);

        await carregarTarefas();

    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}

// Excluir tarefa utilizando DELETE
async function excluirTarefa(id) {
    const confirmar = confirm("Deseja realmente excluir esta tarefa?");

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || "Erro ao excluir tarefa.");
        }

        mostrarMensagem(dados.mensagem);

        await carregarTarefas();

    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}

// Configurar os filtros
const botoesFiltro = document.querySelectorAll(".filtro");

botoesFiltro.forEach(botao => {
    botao.addEventListener("click", () => {
        filtroAtual = botao.dataset.filtro;

        botoesFiltro.forEach(item => {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        mostrarTarefas();
    });
});

// Carregar tarefas ao abrir a página
carregarTarefas();