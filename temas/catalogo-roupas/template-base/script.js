// ===========================
// 1. Fetch de Dados JSON
// ===========================

/**
* Função para converter números em formato de moeda brasileira
*/
const formatCurrency = (value) => value.toLocalString('pt-BR', { style: 'currency', currency: 'BRL' });

/**
* Função para carregar os produtos do arquivo data.json
*/
async function carregarProdutos() {
    try {
        const response = await fetch('data.json');
        const produtos = await response.json();
        
        renderizarProdutos(produtos);
    } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);
        document.getElementById('produtos-container').innerHTML = 
        '<p class="text-center">Erro ao carregar os produtos. Verifique se o arquivo data.json existe.</p>';
    }
}

/**
* Função para renderizar os produtos na página
*/
function renderizarProdutos(produtos) {
    const container = document.getElementById('produtos-container');
    container.innerHTML = '';
    
    produtos.forEach((produto, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        
        col.innerHTML = `
            <div class="card produto-card reveal" style="animation-delay: ${index * 0.1}s">
                <img src="${produto.imagem}" class="card-img-top" alt="${produto.titulo}">
                <div class="card-body">
                    <h5 class="card-title">${produto.titulo}</h5>
                    <p class="card-text">${produto.descricao}</p>
                    <p class="card-text"><strong>R$ ${produto.preco.toFixed(2)}</strong></p>
                </div>
            </div>
        `;
        
        container.appendChild(col);
        
        col.addEventListener('click', () => {
            let modalProduto = new bootstrap.Modal(document.getElementById('modalProduto'));
            let modalProdutoLabel = document.querySelector('#modalProduto .modal-title');
            let modalProdutoBody = document.querySelector('#modalProduto .modal-body');
            let modalProdutoBtnCart = document.querySelector('#modalProduto .btn-primary');
            
            modalProdutoLabel.textContent = produto.titulo;
            modalProdutoBody.innerHTML = `
                <img src="${produto.imagem}" class="img-fluid mb-3" alt="${produto.titulo}">
                <p>${produto.descricao}</p>
            `;

            modalProdutoBtnCart.onclick = () => {
                addToCart(produto.titulo, produto.preco);
            }

            modalProduto.show();
        });
    });
    
    // Ativa as animações de revelação após renderizar
    setTimeout(() => {
        ativarAnimacoesScroll();
    }, 100);
}

// ===========================
// 2. Animação JavaScript: Scroll Reveal
// ===========================

/**
* Função para animar elementos quando aparecem no scroll
*/
function ativarAnimacoesScroll() {
    const elementos = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });
    
    elementos.forEach(elemento => {
        observer.observe(elemento);
    });
}

// ===========================
// 3. Manipulação do Formulário
// ===========================

/**
* Funções para lidar com o envio do formulário
*/

// Abre o pop-up
function abrirPopup() {
    document.getElementById("popupOverlay").style.display = "flex";
}

// Fecha o pop-up
function fecharPopup() {
    document.getElementById("popupOverlay").style.display = "none";
}

// Integração com o formulário existente
document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formulario-contato");
    
    if (!formulario) return;
    
    formulario.addEventListener("submit", async function (e) {
        e.preventDefault();
        
        const dados = new FormData(formulario);
        
        try {
            const resposta = await fetch(formulario.action, {
                method: "POST",
                body: dados,
                headers: { "Accept": "application/json" }
            });
            
            if (resposta.ok) {
                formulario.reset();
                abrirPopup();
            } else {
                alert("❗ Ocorreu um erro ao enviar. Tente novamente.");
            }
            
        } catch (erro) {
            alert("❗ Erro de conexão. Tente novamente.");
        }
    });
});

// ===========================
// 4. Scroll Suave para Links
// ===========================

/**
* Adiciona scroll suave aos links de navegação
*/
function configurarScrollSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // 70px para compensar o header fixo
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===========================
// 5. Carrinho de Compras
// ===========================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
    document.getElementById("cart-count").innerText = cart.length;
}

function renderCart() {
    const container = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");
    
    container.innerHTML = "";
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price;
        
        container.innerHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>R$ ${item.price.toFixed(2)}</span>
                <button onclick="removeItem(${index})">Excluir</button>
            </div>
        `;
    });
    
    totalElement.innerText = total.toFixed(2);
    updateCartCount();
    localStorage.setItem("cart", JSON.stringify(cart));
}

function toggleCart() {
    const modal = document.getElementById("cart-modal");
    modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function addToCart(name, price) {
    cart.push({ name, price });
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

function clearCart() {
    cart = [];
    renderCart();
}

// ===========================
// 6. Inicialização
// ===========================

/**
* Função principal que inicializa todas as funcionalidades
*/
document.addEventListener('DOMContentLoaded', function() {
    // Carrega os produtos do JSON
    carregarProdutos();
    
    // Configura scroll suave
    configurarScrollSuave();
    
    // Ativa animações de scroll em elementos já visíveis
    ativarAnimacoesScroll();
    
    // Exibe contador de itens do carrinho
    renderCart();
    
    console.log('Template Base carregado com sucesso!');
});
