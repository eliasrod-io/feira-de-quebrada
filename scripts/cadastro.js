/* =======================================================================
 * CONTROLE DE PERFIL E SUBMISSÃO (CADASTRO)
 * ======================================================================= */
import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const botaoCliente = document.getElementById("btn-cliente");
const botaoEmpreendedor = document.getElementById("btn-empreendedor");
const labelNome = document.getElementById("label-nome");
const formCadastro = document.getElementById("form-cadastro");

let tipoContaSelecionado = "Cliente";

// Alterna apenas o botão selecionado e o texto do rótulo (sem mexer na imagem)
botaoCliente.addEventListener("click", () => {
    tipoContaSelecionado = "Cliente";
    botaoCliente.classList.add("ativo");
    botaoEmpreendedor.classList.remove("ativo");
    if (labelNome) labelNome.textContent = "Nome Completo:";
});

botaoEmpreendedor.addEventListener("click", () => {
    tipoContaSelecionado = "Empreendedor";
    botaoEmpreendedor.classList.add("ativo");
    botaoCliente.classList.remove("ativo");
    if (labelNome) labelNome.textContent = "Nome do Titular:";
});

// Processamento do formulário unificado
formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const palavraSeguranca = document.getElementById("palavra-seguranca").value.trim();

    const btnSubmit = formCadastro.querySelector(".btn-submit");
    const textoOriginal = btnSubmit.textContent;

    btnSubmit.disabled = true;
    btnSubmit.textContent = "Criando conta...";

    try {
        const credencial = await createUserWithEmailAndPassword(auth, email, password);
        const user = credencial.user;

        await setDoc(doc(db, "usuarios", user.uid), {
            uid: user.uid,
            nome: nome,
            email: email,
            tipoConta: tipoContaSelecionado,
            palavraSeguranca: palavraSeguranca,
            dataCriacao: new Date().toISOString()
        });

        if (tipoContaSelecionado === "Empreendedor") {
            window.location.href = "painel.html";
        } else {
            window.location.href = "../index.html";
        }
    } catch (erro) {
        console.error("Erro no cadastro:", erro);
        btnSubmit.disabled = false;
        btnSubmit.textContent = textoOriginal;

        if (erro.code === "auth/email-already-in-use") {
            alert("Este e-mail já está em uso.");
        } else if (erro.code === "auth/weak-password") {
            alert("A senha precisa ter no mínimo 6 caracteres.");
        } else {
            alert("Erro ao realizar cadastro. Tente novamente.");
        }
    }
});