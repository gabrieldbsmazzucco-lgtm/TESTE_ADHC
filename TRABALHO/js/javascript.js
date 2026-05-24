/**
 * ADHC - Script global
 * ------------------------------------------------------------
 * Um único arquivo JS para todas as páginas do site.
 * O código é inicializado apenas uma vez e cada funcionalidade
 * roda somente quando encontra os elementos correspondentes.
 */

const ADHC = (() => {
  const API_PARTIDAS_URL = '/api/partidas';
  const API_LOGIN_ADMIN_URL = '/api/partidas/login';
  const STORAGE_PARTIDAS_KEY = 'adhc_partidas';
  const STORAGE_ADMIN_SESSION_KEY = 'adhc_admin_session';
  const STORAGE_ACCESS_MODE_KEY = 'adhc_access_mode';
  const STORAGE_NOTICIAS_KEY = 'adhc_noticias_jogos';
  const STORAGE_ELENCO_KEY = 'adhc_elenco_categorias';
  const STORAGE_JOGADORES_KEY = 'adhc_elenco_jogadores';
  const ADMIN_USERNAME_PADRAO = 'admin';
  const ADMIN_PASSWORDS_PADRAO = ['adhc2026', 'adhc 2026'];

  const ELENCO_PADRAO = [
    {
      title: '(INFANTIL) Sub-14',
      description: 'Atletas com até 14 anos em desenvolvimento',
      image: 'img/elenco-sub14.jpg',
      alt: 'Elenco Sub-14'
    },
    {
      title: '(OLESC) Sub-16',
      description: 'Atletas com até 16 anos em desenvolvimento',
      image: 'img/elenco-sub16.jpg',
      alt: 'Elenco Sub-16'
    },
    {
      title: '(JESC) Sub-17',
      description: 'Atletas com até 17 anos em desenvolvimento',
      image: 'img/elenco-sub17.jpg',
      alt: 'Elenco Sub-17'
    },
    {
      title: '(JOGUINHOS) Sub-18',
      description: 'Atletas com até 18 anos em desenvolvimento',
      image: 'img/elenco-sub18.jpg',
      alt: 'Elenco Sub-18'
    },
    {
      title: '(ADULTO)',
      description: 'Atletas maiores de 18 anos em nível competitivo',
      image: 'img/elenco-adulto.jpg',
      alt: 'Elenco Adulto'
    },
    {
      title: '(JUNÍOR)',
      description: 'Atletas entre 18 e 21 anos em transição para profissional',
      image: 'img/elenco-junior.jpg',
      alt: 'Elenco Júnior'
    }
  ];

  const NOTICIAS_PADRAO = [
    {
      date: '28 Set',
      title: 'ADHC Conquista Título Regional',
      description: 'O time adulto do ADHC conquistou o título do campeonato regional após uma série de vitórias impressionantes. Parabéns a todos os atletas e comissão técnica!',
      linkText: 'Ler mais →',
      linkHref: '#'
    },
    {
      date: '15 Nov',
      title: 'Novos Talentos em Destaque',
      description: 'As categorias de base do ADHC mostram grande potencial. Vários atletas sub-16 e sub-17 têm se destacado nos últimos jogos.',
      linkText: 'Ler mais →',
      linkHref: '#'
    },
    {
      date: '12 Nov',
      title: 'Seletiva 2025 em Andamento',
      description: 'A seletiva do ADHC para 2025 está em pleno andamento. Inscrições abertas para todas as categorias. Venha fazer parte do nosso time!',
      linkText: 'Inscrever-se →',
      linkHref: 'seletiva.html'
    }
  ];

  const PARTIDAS_PADRAO = [
    {
      date: '2025-11-03',
      title: 'ADHC vs Lages',
      time: '11:00',
      location: 'SEST/SENAT Itajaí',
      category: 'Cadete (Sub-16)',
      status: 'Próximo jogo'
    },
    {
      date: '2025-11-04',
      title: 'ADHC vs Lauro Muller',
      time: '09:30',
      location: 'SEST/SENAT Itajaí',
      category: 'Cadete (Sub-16)',
      status: 'Próximo jogo'
    },
    {
      date: '2025-11-05',
      title: 'ADHC vs Videira',
      time: '17:00',
      location: 'SEST/SENAT Itajaí',
      category: 'Cadete (Sub-16)',
      status: 'Próximo jogo'
    },
    {
      date: '2025-09-26',
      title: 'ADHC 30 x 27 Florianópolis',
      time: '—',
      location: 'Ginásio Municipal',
      category: 'Adulto',
      status: 'Resultado final',
      description: 'Jogo emocionante com vitória apertada para o ADHC.'
    },
    {
      date: '2025-09-27',
      title: 'ADHC 49 x 20 Garopaba',
      time: '—',
      location: 'Ginásio Municipal',
      category: 'Adulto',
      status: 'Resultado final',
      description: 'Vitória importante do ADHC em grande atuação coletiva.'
    },
    {
      date: '2025-09-28',
      title: 'ADHC 48 x 09 Tubarão',
      time: '—',
      location: 'Ginásio Municipal',
      category: 'Adulto',
      status: 'Resultado final',
      description: 'Excelente apresentação da equipe adulta do ADHC.'
    }
  ];

  // Seletores reaproveitados na animação de entrada por scroll.
  const SCROLL_ANIMATION_SELECTORS = [
    '.info-card',
    '.news-card',
    '.sponsor-card',
    '.section-title',
    '.cta-section',
    '.category-container',
    '.game-card',
    '.result-card',
    '.project-content',
    '.audience-grid',
    '.objective-content',
    '.justification-content',
    '.investment-grid',
    '.benefits-list',
    '.ods-grid',
    '.contact-grid',
    '.slide-in-left'
  ].join(', ');

  const VALIDADORES = {
    nome: (valor) => valor.trim().length >= 3 && !/\d/.test(valor),
    email: (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()),
    telefone: (valor) => {
      const numero = valor.replace(/\D/g, '');
      return numero.length >= 10 && numero.length <= 11;
    },
    idade: (valor) => {
      const numero = Number.parseInt(valor, 10);
      return Number.isInteger(numero) && numero >= 1 && numero <= 120;
    },
    posicao: (valor) => valor.trim() !== '',
    experiencia: (valor) => valor.trim() !== '',
    termos: (_, checked) => checked,
    video: (_, __, input) => {
      const arquivo = input?.files?.[0];
      if (!arquivo) return true;

      const ehVideo = arquivo.type.startsWith('video/');
      const tamanhoMaximo = 80 * 1024 * 1024; // 80MB
      return ehVideo && arquivo.size <= tamanhoMaximo;
    }
  };

  const MENSAGENS_ERRO = {
    nome: 'Nome deve ter pelo menos 3 caracteres e não pode conter números.',
    email: 'Email inválido. Use o formato: seu.email@exemplo.com.',
    telefone: 'Telefone deve conter entre 10 e 11 dígitos.',
    idade: 'Idade deve ser um número entre 1 e 120.',
    posicao: 'Selecione uma posição.',
    experiencia: 'Selecione seu nível de experiência.',
    termos: 'Você deve concordar com os termos e condições.',
    video: 'Envie um vídeo obrigatório válido com no máximo 80MB.'
  };

  // -----------------------------
  // Helpers
  // -----------------------------

  function obterPaginaAtual() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  function exibirErro(idErro, mensagem) {
    const elemento = document.getElementById(idErro);
    if (!elemento) return;

    elemento.textContent = mensagem;
    elemento.style.display = 'block';
  }

  function limparErro(idErro) {
    const elemento = document.getElementById(idErro);
    if (!elemento) return;

    elemento.textContent = '';
    elemento.style.display = 'none';
  }

  // -----------------------------
  // Navegação
  // -----------------------------

  function ativarLinkNavegacao() {
    const paginaAtual = obterPaginaAtual();

    document.querySelectorAll('.nav-link').forEach((link) => {
      const href = link.getAttribute('href') || '';
      const ativo = href === paginaAtual || (paginaAtual === 'index.html' && href === '');
      link.classList.toggle('active', ativo);
    });
  }

  // -----------------------------
  // Animações visuais
  // -----------------------------

  function adicionarAnimacaoScroll() {
    const elementos = document.querySelectorAll(SCROLL_ANIMATION_SELECTORS);
    if (!elementos.length) return;
    const reduzirAnimacoes = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduzirAnimacoes) {
      elementos.forEach((elemento) => {
        elemento.classList.add('reveal-on-scroll', 'is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, instance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    elementos.forEach((elemento) => {
      elemento.classList.add('reveal-on-scroll');
      observer.observe(elemento);
    });
  }

  function criarRipple(evento, botao) {
    const ripple = document.createElement('span');
    ripple.className = 'button-ripple';

    const rect = botao.getBoundingClientRect();
    ripple.style.left = `${evento.clientX - rect.left}px`;
    ripple.style.top = `${evento.clientY - rect.top}px`;

    botao.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }

  function adicionarEfeitoBotaoCTA() {
    const dispositivoToque = window.matchMedia('(pointer: coarse)').matches;
    if (dispositivoToque) return;

    document.querySelectorAll('.cta-button').forEach((botao) => {
      botao.addEventListener('click', (evento) => criarRipple(evento, botao));
    });
  }

  function inicializarAnimacoesExtras() {
    const reduzirAnimacoes = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const telaPequena = window.matchMedia('(max-width: 768px)').matches;
    if (reduzirAnimacoes || telaPequena) return;

    document.querySelector('.logo')?.classList.add('pulse');
    document.querySelectorAll('.mascote-img, .sponsor-card').forEach((el) => el.classList.add('spin-on-hover'));
    document.querySelector('.hero-title')?.classList.add('glow-text');
  }

  // -----------------------------
  // Notícias
  // -----------------------------

  function adicionarLinksNoticias() {
    document.querySelectorAll('.news-link, .result-link').forEach((link) => {
      link.addEventListener('click', (evento) => {
        // Mantém links reais funcionando normalmente.
        if (link.getAttribute('href') !== '#') return;

        evento.preventDefault();
        const card = link.closest('.news-card, .result-card');
        const titulo = card?.querySelector('.news-title, .result-title')?.textContent?.trim() || 'conteúdo';
        alert(`Abrindo: ${titulo}`);
      });
    });
  }

  async function carregarPartidasDoCalendario() {
    try {
      const respostaApi = await fetch(API_PARTIDAS_URL, { cache: 'no-store' });
      if (respostaApi.ok) {
        const partidasApi = await respostaApi.json();
        if (Array.isArray(partidasApi) && partidasApi.length > 0) {
          salvarPartidasNoLocalStorage(partidasApi);
          return partidasApi;
        }
      }
    } catch (erro) {
      console.warn('Backend indisponível. Tentando fontes locais.', erro);
    }

    try {
      const partidasLocal = localStorage.getItem(STORAGE_PARTIDAS_KEY);
      if (partidasLocal) {
        const parsed = JSON.parse(partidasLocal);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (erro) {
      console.warn('Não foi possível ler partidas do localStorage.', erro);
    }

    try {
      const resposta = await fetch('data/partidas.json', { cache: 'no-store' });
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

      const partidas = await resposta.json();
      if (!Array.isArray(partidas) || partidas.length === 0) return PARTIDAS_PADRAO;
      return partidas;
    } catch (erro) {
      console.warn('Não foi possível carregar data/partidas.json. Usando partidas padrão.', erro);
      return PARTIDAS_PADRAO;
    }
  }

  function obterHeadersAdmin(credenciaisAdmin) {
    return {
      'Content-Type': 'application/json',
      'X-Admin-User': credenciaisAdmin?.username || '',
      'X-Admin-Pass': credenciaisAdmin?.password || ''
    };
  }

  function autenticarAdminLocal(credenciaisAdmin) {
    const username = credenciaisAdmin?.username?.trim();
    const password = credenciaisAdmin?.password?.trim();
    return username === ADMIN_USERNAME_PADRAO && ADMIN_PASSWORDS_PADRAO.includes(password);
  }

  async function autenticarAdmin(credenciaisAdmin) {
    if (!credenciaisAdmin?.username || !credenciaisAdmin?.password) return false;

    try {
      const respostaApi = await fetch(API_LOGIN_ADMIN_URL, {
        method: 'POST',
        headers: obterHeadersAdmin(credenciaisAdmin)
      });
      if (respostaApi.ok) return true;
      return autenticarAdminLocal(credenciaisAdmin);
    } catch (erro) {
      console.warn('Não foi possível autenticar no backend. Usando fallback local.', erro);
      return autenticarAdminLocal(credenciaisAdmin);
    }
  }

function obterUrlAdmin(nomeArquivo) {
    return window.location.pathname.replace(/[^/]+$/, nomeArquivo);
  }

  async function salvarPartidasNoBackend(partidas, credenciaisAdmin) {
    try {
      const respostaApi = await fetch(API_PARTIDAS_URL, {
        method: 'PUT',
        headers: obterHeadersAdmin(credenciaisAdmin),
        body: JSON.stringify(partidas)
      });
      if (!respostaApi.ok) throw new Error(`HTTP ${respostaApi.status}`);
      return true;
    } catch (erro) {
      console.warn('Não foi possível salvar partidas no backend.', erro);
      return false;
    }
  }

  function salvarPartidasNoLocalStorage(partidas) {
    try {
      localStorage.setItem(STORAGE_PARTIDAS_KEY, JSON.stringify(partidas));
    } catch (erro) {
      console.warn('Não foi possível salvar partidas no localStorage.', erro);
    }
  }

  // -----------------------------
  // Calendário de jogos (jogos.html)
  // -----------------------------

  async function inicializarCalendarioJogos() {
    const calendarGrid = document.getElementById('calendar-grid');
    const calendarTitle = document.getElementById('calendar-title');
    const previousButton = document.getElementById('calendar-prev');
    const nextButton = document.getElementById('calendar-next');
    const detailsContainer = document.getElementById('game-details');

    if (!calendarGrid || !calendarTitle || !previousButton || !nextButton || !detailsContainer) return;

    const partidas = await carregarPartidasDoCalendario();

    const partidasPorData = partidas.reduce((acc, partida) => {
      if (!acc[partida.date]) acc[partida.date] = [];
      acc[partida.date].push(partida);
      return acc;
    }, {});

    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const primeiraDataComPartida = partidas
      .map((partida) => partida.date)
      .filter(Boolean)
      .sort()[0];

    let dataAtual = primeiraDataComPartida
      ? new Date(Number(primeiraDataComPartida.slice(0, 4)), Number(primeiraDataComPartida.slice(5, 7)) - 1, 1)
      : new Date();

    function formatarDataISO(ano, mes, dia) {
      return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    }

    function renderizarDetalhes(dataIso) {
      const partidasDoDia = partidasPorData[dataIso] || [];
      const dataFormatada = new Date(`${dataIso}T00:00:00`).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      if (!partidasDoDia.length) {
        detailsContainer.innerHTML = `
          <h3 class="game-details-title">Detalhes da partida</h3>
          <p class="game-details-empty">Não há partida cadastrada para ${dataFormatada}.</p>
        `;
        return;
      }

      detailsContainer.innerHTML = `
        <h3 class="game-details-title">Partidas de ${dataFormatada}</h3>
        <div class="game-details-list">
          ${partidasDoDia.map((partida) => `
            <article class="game-details-card">
              <p class="game-details-status">${partida.status}</p>
              <h4>${partida.title}</h4>
              <p><strong>Horário:</strong> ${partida.time}</p>
              <p><strong>Local:</strong> ${partida.location}</p>
              <p><strong>Categoria:</strong> ${partida.category}</p>
              ${partida.description ? `<p>${partida.description}</p>` : ''}
            </article>
          `).join('')}
        </div>
      `;
    }

    function renderizarCalendario() {
      const ano = dataAtual.getFullYear();
      const mes = dataAtual.getMonth();
      const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
      const totalDias = new Date(ano, mes + 1, 0).getDate();

      calendarTitle.textContent = `${meses[mes]} ${ano}`;
      calendarGrid.innerHTML = '';

      for (let i = 0; i < primeiroDiaSemana; i += 1) {
        const vazio = document.createElement('span');
        vazio.className = 'calendar-day empty';
        calendarGrid.appendChild(vazio);
      }

      for (let dia = 1; dia <= totalDias; dia += 1) {
        const dataIso = formatarDataISO(ano, mes, dia);
        const temPartida = Boolean(partidasPorData[dataIso]);

        const botaoDia = document.createElement('button');
        botaoDia.type = 'button';
        botaoDia.className = `calendar-day ${temPartida ? 'has-game' : ''}`;
        botaoDia.textContent = String(dia);
        botaoDia.setAttribute('data-date', dataIso);

        botaoDia.addEventListener('click', () => {
          document.querySelectorAll('.calendar-day.selected').forEach((el) => el.classList.remove('selected'));
          botaoDia.classList.add('selected');
          renderizarDetalhes(dataIso);
        });

        calendarGrid.appendChild(botaoDia);
      }
    }

    previousButton.addEventListener('click', () => {
      dataAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 1);
      renderizarCalendario();
    });

    nextButton.addEventListener('click', () => {
      dataAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 1);
      renderizarCalendario();
    });

    renderizarCalendario();
  }

  // -----------------------------
  // Formulário de seletiva
  // -----------------------------

  function validarFormulario(evento) {
    evento.preventDefault();

    const formulario = evento.currentTarget;
    let primeiroCampoComErro = null;

    Object.keys(VALIDADORES).forEach((campo) => {
      const input = formulario.querySelector(`#${campo}`);
      if (!input) return;

      const valido = VALIDADORES[campo](input.value, input.checked, input);
      if (valido) {
        limparErro(`erro-${campo}`);
        return;
      }

      exibirErro(`erro-${campo}`, MENSAGENS_ERRO[campo]);
      if (!primeiroCampoComErro) primeiroCampoComErro = input;
    });

    if (primeiroCampoComErro) {
      primeiroCampoComErro.closest('.form-group')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }

    const mensagemSucesso = document.getElementById('success-message');
    if (mensagemSucesso) {
      mensagemSucesso.style.display = 'block';
      mensagemSucesso.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setTimeout(() => formulario.submit(), 1000);
    return false;
  }

  function adicionarValidacaoTempoReal(formulario) {
    Object.keys(VALIDADORES).forEach((campo) => {
      const input = formulario.querySelector(`#${campo}`);
      if (!input) return;

      const evento = campo === 'termos' || campo === 'video' ? 'change' : 'input';
      input.addEventListener(evento, () => {
        const valido = VALIDADORES[campo](input.value, input.checked, input);
        if (valido) limparErro(`erro-${campo}`);
      });
    });
  }

  function inicializarFormularioSeletiva() {
    const formulario = document.getElementById('seletiva-form');
    if (!formulario) return;

    formulario.addEventListener('submit', validarFormulario);
    adicionarValidacaoTempoReal(formulario);
  }

  function obterSessaoAdmin() {
    const sessaoSalva = sessionStorage.getItem(STORAGE_ADMIN_SESSION_KEY);
    if (!sessaoSalva) return null;

    try {
      const credenciais = JSON.parse(sessaoSalva);
      if (!credenciais?.username || !credenciais?.password) return null;
      return credenciais;
    } catch (erro) {
      return null;
    }
  }

  async function inicializarLoginAdminCalendario() {
    const loginForm = document.getElementById('admin-login-form');
    const loginFeedback = document.getElementById('admin-login-feedback');
    if (!loginForm || !loginFeedback) return;

const destino = new URLSearchParams(window.location.search).get('destino');
    const destinoValido = destino && /^admin-[a-z-]+\.html$/i.test(destino)
      ? destino
      : 'admin-calendario-edicao.html';

    const sessao = obterSessaoAdmin();
    if (sessao) {
      window.location.href = destinoValido;
      return;
    }

    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const username = loginForm.querySelector('[name="username"]').value.trim();
      const password = loginForm.querySelector('[name="password"]').value;
      const tentativa = { username, password };

      const autenticado = await autenticarAdmin(tentativa);
      if (!autenticado) {
        sessionStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
        loginFeedback.textContent = 'Login inválido. Usuário ou Senha estão incorretos.';
        return;
      }

      sessionStorage.setItem(STORAGE_ADMIN_SESSION_KEY, JSON.stringify(tentativa));
      window.location.href = obterUrlAdmin(destinoValido);
    });
  }

function obterModoAcesso() {
    return sessionStorage.getItem(STORAGE_ACCESS_MODE_KEY);
  }

  function aplicarPermissoesDeEdicao() {
    const modoAcesso = obterModoAcesso();
        if (modoAcesso !== 'admin') {
      sessionStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
    }
    const sessaoAdmin = obterSessaoAdmin();
    const ehAdmin = modoAcesso === 'admin' && !!sessaoAdmin;

    document.querySelectorAll('[data-admin-only]').forEach((elemento) => {
      elemento.hidden = !ehAdmin;
      elemento.style.display = ehAdmin ? '' : 'none';
    });

    const botaoAcessoAdmin = document.getElementById('admin-access-trigger');
     const botaoSairAdmin = document.getElementById('admin-logout-trigger');
    if (botaoAcessoAdmin) {
      botaoAcessoAdmin.hidden = ehAdmin;
    }
    if (botaoSairAdmin) {
      botaoSairAdmin.hidden = !ehAdmin;
    }

  }

function abrirModalAcessoAdmin() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.68);display:flex;align-items:center;justify-content:center;padding:16px;z-index:9999;';
    overlay.innerHTML = `
      <div style="width:min(460px,100%);background:#fff;border-radius:14px;padding:20px 18px;color:#111;font-family:Arial,sans-serif;box-shadow:0 16px 40px rgba(0,0,0,.35);">
        <h3 style="margin:0 0 10px;">Acesso Administrativo</h3>
        <p style="margin:0 0 12px;font-size:14px;">Faça login como administrador ou continue sem login.</p>
        <form id="admin-access-form" style="display:grid;gap:10px;">
          <input name="username" placeholder="Usuário admin" autocomplete="username" style="padding:10px;border:1px solid #ccc;border-radius:8px;">
          <input name="password" type="password" placeholder="Senha admin" autocomplete="current-password" style="padding:10px;border:1px solid #ccc;border-radius:8px;">
          <button type="submit" style="padding:10px;border:none;border-radius:8px;background:#b20000;color:#fff;cursor:pointer;">Entrar como admin</button>
          <button type="button" id="admin-access-guest" style="padding:10px;border:1px solid #bbb;border-radius:8px;background:#fff;cursor:pointer;">Voltar sem login</button>
          <p id="admin-access-feedback" style="margin:0;color:#b00020;font-size:13px;min-height:18px;"></p>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);
    const form = overlay.querySelector('#admin-access-form');
    const guestButton = overlay.querySelector('#admin-access-guest');
    const feedback = overlay.querySelector('#admin-access-feedback');

    guestButton.addEventListener('click', () => {
      sessionStorage.setItem(STORAGE_ACCESS_MODE_KEY, 'guest');
      document.body.removeChild(overlay);
      aplicarPermissoesDeEdicao();
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = form.username.value.trim();
      const password = form.password.value;
      const tentativa = { username, password };
      const autenticado = await autenticarAdmin(tentativa);

      if (!autenticado) {
        sessionStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
        sessionStorage.setItem(STORAGE_ACCESS_MODE_KEY, 'guest');
      
        feedback.textContent = 'Usuário ou senha inválidos.';
        return;
      }

      sessionStorage.setItem(STORAGE_ADMIN_SESSION_KEY, JSON.stringify(tentativa));
      sessionStorage.setItem(STORAGE_ACCESS_MODE_KEY, 'admin');
      document.body.removeChild(overlay)
      aplicarPermissoesDeEdicao();
      window.location.href = obterUrlAdmin('index.html');
    });
  }


    function inicializarControleAcessoDoSite() {
    const paginaAtual = obterPaginaAtual();
    const paginaAdmin = /^admin-[a-z-]+\.html$/i.test(paginaAtual);
    if (paginaAdmin) return;
    const trigger = document.getElementById('admin-access-trigger');
     const logoutTrigger = document.getElementById('admin-logout-trigger');
    if (trigger) {
      trigger.addEventListener('click', abrirModalAcessoAdmin);
    }
    if (logoutTrigger) {
      logoutTrigger.addEventListener('click', () => {
        sessionStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
        sessionStorage.setItem(STORAGE_ACCESS_MODE_KEY, 'guest');
        aplicarPermissoesDeEdicao();
        window.location.href = obterUrlAdmin('index.html');
      });
    }
    if (!obterModoAcesso()) {
      sessionStorage.setItem(STORAGE_ACCESS_MODE_KEY, 'guest');
      abrirModalAcessoAdmin();
    }
    aplicarPermissoesDeEdicao();
  }

  async function inicializarEdicaoAdminCalendario() {
    const form = document.getElementById('admin-calendar-form');
    const lista = document.getElementById('admin-calendar-list');
    const resetButton = document.getElementById('admin-calendar-reset');
    const nota = document.querySelector('.admin-note');
    const previewGrid = document.getElementById('admin-preview-grid');
    const previewTitle = document.getElementById('admin-preview-title');
    const previewDetails = document.getElementById('admin-preview-details');
    const previewPrev = document.getElementById('admin-preview-prev');
    const previewNext = document.getElementById('admin-preview-next');
    const logoutButton = document.getElementById('admin-logout');

    if (!form || !lista || !resetButton || !nota || !previewGrid || !previewTitle || !previewDetails || !previewPrev || !previewNext || !logoutButton) return;

    const credenciaisAdmin = obterSessaoAdmin();
    if (!credenciaisAdmin) {
      window.location.href = obterUrlAdmin('admin-calendario.html');
      return;
    }

    let partidas = await carregarPartidasDoCalendario();
    let indiceEdicao = null;
    let dataPreview = new Date(2025, 10, 1);

    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    function formatarDataISO(ano, mes, dia) {
      return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    }

    function irParaDataPreview(dataIso) {
      if (!dataIso) return;
      const [ano, mes] = dataIso.split('-').map(Number);
      if (!ano || !mes) return;
      dataPreview = new Date(ano, mes - 1, 1);
    }

    function obterPartidasPorData() {
      return partidas.reduce((acc, partida) => {
        if (!acc[partida.date]) acc[partida.date] = [];
        acc[partida.date].push(partida);
        return acc;
      }, {});
    }

    function renderizarDetalhesPreview(dataIso) {
      const partidasPorData = obterPartidasPorData();
      const partidasDoDia = partidasPorData[dataIso] || [];
      if (!partidasDoDia.length) {
        previewDetails.innerHTML = '<p>Nenhuma partida cadastrada para esta data.</p>';
        return;
      }

      previewDetails.innerHTML = partidasDoDia.map((partida) => `
        <article>
          <strong>${partida.title}</strong><br>
          ${partida.time || '—'} • ${partida.location || '—'} • ${partida.category || '—'}<br>
          <em>${partida.status || 'Próximo jogo'}</em>
        </article>
      `).join('<hr>');
    }

    function renderizarPreviewCalendario(dataSelecionada = null) {
      const partidasPorData = obterPartidasPorData();
      const ano = dataPreview.getFullYear();
      const mes = dataPreview.getMonth();
      const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
      const totalDias = new Date(ano, mes + 1, 0).getDate();

      previewTitle.textContent = `Prévia: ${meses[mes]} ${ano}`;
      previewGrid.innerHTML = '';

      for (let i = 0; i < primeiroDiaSemana; i += 1) {
        const vazio = document.createElement('span');
        vazio.className = 'admin-preview-day empty';
        previewGrid.appendChild(vazio);
      }

      let dataAutoSelecionada = dataSelecionada;
      if (!dataAutoSelecionada) {
        dataAutoSelecionada = Object.keys(partidasPorData).find((dataIso) => {
          const [anoData, mesData] = dataIso.split('-').map(Number);
          return anoData === ano && mesData === mes + 1;
        }) || null;
      }

      for (let dia = 1; dia <= totalDias; dia += 1) {
        const dataIso = formatarDataISO(ano, mes, dia);
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = `admin-preview-day ${partidasPorData[dataIso] ? 'has-game' : ''}`;
        botao.textContent = String(dia);
        botao.addEventListener('click', () => {
          previewGrid.querySelectorAll('.admin-preview-day.selected').forEach((el) => el.classList.remove('selected'));
          botao.classList.add('selected');
          renderizarDetalhesPreview(dataIso);
        });

        if (dataAutoSelecionada && dataIso === dataAutoSelecionada) {
          botao.classList.add('selected');
        }

        previewGrid.appendChild(botao);
      }

      if (dataAutoSelecionada) {
        renderizarDetalhesPreview(dataAutoSelecionada);
      } else {
        previewDetails.innerHTML = '<p>Nenhuma partida cadastrada para este mês.</p>';
      }
    }

    function renderizarLista() {
      if (!partidas.length) {
        lista.innerHTML = '<p>Nenhuma partida cadastrada.</p>';
        return;
      }

      lista.innerHTML = partidas.map((partida, indice) => `
        <article class="admin-item">
          <h4>${partida.date} — ${partida.title}</h4>
          <p><strong>Horário:</strong> ${partida.time || '—'} | <strong>Local:</strong> ${partida.location || '—'}</p>
          <p><strong>Categoria:</strong> ${partida.category || '—'} | <strong>Status:</strong> ${partida.status || '—'}</p>
          ${partida.description ? `<p>${partida.description}</p>` : ''}
          <div class="admin-actions">
            <button type="button" data-action="edit" data-index="${indice}">Editar</button>
            <button type="button" data-action="delete" data-index="${indice}">Excluir</button>
          </div>
        </article>
      `).join('');
    }

    function preencherFormulario(partida) {
      form.date.value = partida.date || '';
      form.title.value = partida.title || '';
      form.time.value = partida.time || '';
      form.location.value = partida.location || '';
      form.category.value = partida.category || '';
      form.status.value = partida.status || '';
      form.description.value = partida.description || '';
    }

    function limparFormulario() {
      form.reset();
      indiceEdicao = null;
      form.querySelector('button[type="submit"]').textContent = 'Salvar partida';
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const partida = {
        date: form.date.value,
        title: form.title.value,
        time: form.time.value || '—',
        location: form.location.value || '—',
        category: form.category.value || '—',
        status: form.status.value || 'Próximo jogo',
        description: form.description.value.trim()
      };

      if (indiceEdicao === null) {
        partidas.push(partida);
      } else {
        partidas[indiceEdicao] = partida;
      }

      partidas.sort((a, b) => a.date.localeCompare(b.date));
      salvarPartidasNoLocalStorage(partidas);
      const salvoNoBackend = await salvarPartidasNoBackend(partidas, credenciaisAdmin);
      nota.textContent = salvoNoBackend
        ? 'Alterações salvas no backend com sucesso.'
        : 'Alterações salvas apenas neste navegador (backend indisponível).';
      irParaDataPreview(partida.date);
      renderizarLista();
      renderizarPreviewCalendario(partida.date);
      limparFormulario();
    });

    lista.addEventListener('click', async (event) => {
      const botao = event.target.closest('button[data-action]');
      if (!botao) return;

      const index = Number(botao.dataset.index);
      if (Number.isNaN(index) || !partidas[index]) return;

      if (botao.dataset.action === 'edit') {
        indiceEdicao = index;
        preencherFormulario(partidas[index]);
        form.querySelector('button[type="submit"]').textContent = 'Atualizar partida';
      }

      if (botao.dataset.action === 'delete') {
        partidas.splice(index, 1);
        salvarPartidasNoLocalStorage(partidas);
        const salvoNoBackend = await salvarPartidasNoBackend(partidas, credenciaisAdmin);
        nota.textContent = salvoNoBackend
          ? 'Alterações salvas no backend com sucesso.'
          : 'Alterações salvas apenas neste navegador (backend indisponível).';
        renderizarLista();
        renderizarPreviewCalendario();
        limparFormulario();
      }
    });

    resetButton.addEventListener('click', async () => {
      try {
        const respostaApi = await fetch(`${API_PARTIDAS_URL}/reset`, {
          method: 'POST',
          headers: obterHeadersAdmin(credenciaisAdmin)
        });
        if (respostaApi.ok) {
          partidas = await respostaApi.json();
          salvarPartidasNoLocalStorage(partidas);
          nota.textContent = 'Partidas padrão restauradas no backend.';
        } else {
          throw new Error(`HTTP ${respostaApi.status}`);
        }
      } catch (erro) {
        localStorage.removeItem(STORAGE_PARTIDAS_KEY);
        partidas = [...PARTIDAS_PADRAO];
        nota.textContent = 'Backend indisponível. Partidas padrão restauradas apenas neste navegador.';
      }
      renderizarLista();
      renderizarPreviewCalendario();
      limparFormulario();
    });

    previewPrev.addEventListener('click', () => {
      dataPreview = new Date(dataPreview.getFullYear(), dataPreview.getMonth() - 1, 1);
      renderizarPreviewCalendario();
    });

    previewNext.addEventListener('click', () => {
      dataPreview = new Date(dataPreview.getFullYear(), dataPreview.getMonth() + 1, 1);
      renderizarPreviewCalendario();
    });

    logoutButton.addEventListener('click', () => {
      sessionStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
      window.location.href = obterUrlAdmin('admin-calendario.html');
    });

    renderizarLista();
    renderizarPreviewCalendario();
  }

function carregarJogadores() {
  const salvo = localStorage.getItem(STORAGE_JOGADORES_KEY);
  if (!salvo) return [];
  try {
    const lista = JSON.parse(salvo);
    if (!Array.isArray(lista)) return [];

    const mesesValidos = new Set(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']);
    return lista.map((item) => {
      const jogador = { ...(item || {}) };
      const mes = String(jogador.mesReferencia || '').padStart(2, '0');
      const mesValido = mesesValidos.has(mes);

      // Migração de registros antigos que ficaram deslocados uma coluna:
      // mês recebeu nome, nome recebeu categoria, categoria recebeu posição...
      const pareceDeslocado =
        !mesValido
        && typeof jogador.mesReferencia === 'string'
        && jogador.mesReferencia.trim() !== ''
        && typeof jogador.nome === 'string'
        && jogador.nome.trim() !== ''
        && typeof jogador.categoria === 'string'
        && jogador.categoria.trim() !== '';

      if (pareceDeslocado) {
        jogador.mensalidade = jogador.descontoPorFalta;
        jogador.descontoPorFalta = jogador.faltas;
        jogador.faltas = jogador.bolsa;
        jogador.bolsa = jogador.status;
        jogador.status = jogador.idade;
        jogador.idade = jogador.numero;
        jogador.numero = jogador.posicao;
        jogador.posicao = jogador.categoria;
        jogador.categoria = jogador.nome;
        jogador.nome = jogador.mesReferencia;
        jogador.mesReferencia = '01';
      } else {
        jogador.mesReferencia = mesValido ? mes : '01';
      }

      return {
        mesReferencia: jogador.mesReferencia,
        nome: String(jogador.nome || '').trim(),
        categoria: String(jogador.categoria || '').trim(),
        posicao: String(jogador.posicao || '').trim(),
        numero: String(jogador.numero || '').trim(),
        idade: String(jogador.idade || '').trim(),
        status: String(jogador.status || '').trim(),
        bolsa: String(jogador.bolsa || '').trim(),
        faltas: String(jogador.faltas || '0').trim(),
        descontoPorFalta: String(jogador.descontoPorFalta || '0').trim(),
        mensalidade: String(jogador.mensalidade || '').trim()
      };
    });
  } catch (e) { return []; }
}

function salvarJogadores(jogadores) {
  localStorage.setItem(STORAGE_JOGADORES_KEY, JSON.stringify(jogadores));
}

function inicializarControleJogadoresAdmin() {
  const form = document.getElementById('admin-player-form');
  const tableBody = document.getElementById('admin-player-table-body');
  const resetButton = document.getElementById('admin-player-reset');
  const logoutButton = document.getElementById('admin-player-logout');
  const monthFilter = document.getElementById('admin-player-filter-month');
  if (!form || !tableBody || !resetButton || !logoutButton || !monthFilter) return;

  const credenciaisAdmin = obterSessaoAdmin();
  if (!credenciaisAdmin) {
    window.location.href = obterUrlAdmin('admin-calendario.html');
    return;
  }

  let jogadores = carregarJogadores();
  salvarJogadores(jogadores);
  let indiceEdicao = null;
  let mesFiltro = 'todos';
  const mesesNomes = {
    '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
    '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
    '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
  };

  const formatarMoeda = (valor) => {
    const numero = Number.parseFloat(valor || 0);
    return `R$ ${Number.isFinite(numero) ? numero.toFixed(2) : '0.00'}`;
  };

  function renderizar() {
    if (!jogadores.length) {
      tableBody.innerHTML = '<tr><td colspan="13">Nenhum jogador cadastrado.</td></tr>';
      return;
    }

    const jogadoresFiltrados = jogadores
      .map((j, i) => ({ ...j, _indexReal: i }))
      .filter((j) => mesFiltro === 'todos' || (j.mesReferencia || '01') === mesFiltro);

    if (!jogadoresFiltrados.length) {
      tableBody.innerHTML = '<tr><td colspan="13">Nenhum jogador cadastrado para este mês.</td></tr>';
      return;
    }

    tableBody.innerHTML = jogadoresFiltrados.map((j) => {
      const faltas = Number.parseInt(j.faltas || 0, 10) || 0;
      const descontoPorFalta = Number.parseFloat(j.descontoPorFalta || 0) || 0;
      const bolsa = Number.parseFloat(j.bolsa || 0) || 0;
      const penalidade = faltas * descontoPorFalta;
      const bolsaLiquida = bolsa - penalidade;
      return `
        <tr>
          <td>${mesesNomes[j.mesReferencia || '01'] || 'Janeiro'}</td>
          <td>${j.nome || '—'}</td>
          <td>${j.categoria || '—'}</td>
          <td>${j.posicao || '—'}</td>
          <td>${j.numero || '—'}</td>
          <td>${j.idade || '—'}</td>
          <td>${j.status || '—'}</td>
          <td>${formatarMoeda(bolsa)}</td>
          <td>${faltas}</td>
          <td>${formatarMoeda(penalidade)}</td>
          <td>${formatarMoeda(j.mensalidade || 0)}</td>
          <td>${formatarMoeda(bolsaLiquida)}</td>
          <td>
            <button type="button" data-action="edit" data-index="${j._indexReal}">Editar</button>
            <button type="button" data-action="delete" data-index="${j._indexReal}">Excluir</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const jogador = {
      mesReferencia: form.mesReferencia.value,
      nome: form.nome.value.trim(),
      categoria: form.categoria.value.trim(),
      posicao: form.posicao.value.trim(),
      numero: form.numero.value.trim(),
      idade: form.idade.value.trim(),
      status: form.status.value.trim(),
      bolsa: form.bolsa.value.trim(),
      faltas: form.faltas.value.trim(),
      descontoPorFalta: form.descontoPorFalta.value.trim(),
      mensalidade: form.mensalidade.value.trim()
    };
    if (indiceEdicao === null) jogadores.push(jogador);
    else jogadores[indiceEdicao] = jogador;
    salvarJogadores(jogadores);
    form.reset();
    indiceEdicao = null;
    renderizar();
  });

  tableBody.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-action]');
    if (!btn) return;
    const indice = Number(btn.dataset.index);
    if (Number.isNaN(indice) || !jogadores[indice]) return;

    if (btn.dataset.action === 'delete') {
      jogadores.splice(indice, 1);
      salvarJogadores(jogadores);
      renderizar();
    } else {
      const j = jogadores[indice];
      form.mesReferencia.value = j.mesReferencia || '01';
      form.nome.value = j.nome || '';
      form.categoria.value = j.categoria || '';
      form.posicao.value = j.posicao || '';
      form.numero.value = j.numero || '';
      form.idade.value = j.idade || '';
      form.status.value = j.status || '';
      form.bolsa.value = j.bolsa || '';
      form.faltas.value = j.faltas || '0';
      form.descontoPorFalta.value = j.descontoPorFalta || '0';
      form.mensalidade.value = j.mensalidade || '';
      indiceEdicao = indice;
    }
  });

  resetButton.addEventListener('click', () => {
    jogadores = [];
    salvarJogadores(jogadores);
    indiceEdicao = null;
    form.reset();
    renderizar();
  });

  monthFilter.addEventListener('change', () => {
    mesFiltro = monthFilter.value;
    renderizar();
  });

  logoutButton.addEventListener('click', () => {
    sessionStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
    sessionStorage.setItem(STORAGE_ACCESS_MODE_KEY, 'guest');
    window.location.href = obterUrlAdmin('index.html');
  });

  renderizar();
}
  
    function carregarNoticiasDoJogos() {
    try {
      const salvo = localStorage.getItem(STORAGE_NOTICIAS_KEY);
      if (!salvo) return [...NOTICIAS_PADRAO];
      const parsed = JSON.parse(salvo);
      if (!Array.isArray(parsed) || !parsed.length) return [...NOTICIAS_PADRAO];
      return parsed;
    } catch (erro) {
      console.warn('Não foi possível carregar notícias salvas. Usando padrão.', erro);
      return [...NOTICIAS_PADRAO];
    }
  }

  function salvarNoticiasDoJogos(noticias) {
    try {
      localStorage.setItem(STORAGE_NOTICIAS_KEY, JSON.stringify(noticias));
    } catch (erro) {
      console.warn('Não foi possível salvar notícias no localStorage.', erro);
    }
  }

  function renderizarNoticiasEmJogos() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    const noticias = carregarNoticiasDoJogos();
    grid.innerHTML = noticias.map((noticia) => `
      <article class="news-card">
        <div class="news-date">${noticia.date || ''}</div>
        <h3 class="news-title">${noticia.title || ''}</h3>
        <p class="news-description">${noticia.description || ''}</p>
        <a href="${noticia.linkHref || '#'}" class="news-link">${noticia.linkText || 'Ler mais →'}</a>
      </article>
    `).join('');
  }

  function inicializarEdicaoNoticiasAdmin() {
    const form = document.getElementById('admin-news-form');
    const lista = document.getElementById('admin-news-list');
    const resetButton = document.getElementById('admin-news-reset');
    const logoutButton = document.getElementById('admin-news-logout');
    if (!form || !lista || !resetButton || !logoutButton) return;

    if (!obterSessaoAdmin()) {
      window.location.href = obterUrlAdmin('admin-calendario.html');
      return;
    }

    let noticias = carregarNoticiasDoJogos();
    let indiceEdicao = null;

    function renderizarLista() {
      if (!noticias.length) {
        lista.innerHTML = '<p>Nenhuma notícia cadastrada.</p>';
        return;
      }

      lista.innerHTML = noticias.map((noticia, indice) => `
        <article class="admin-item">
          <h4>${noticia.date || ''} — ${noticia.title || ''}</h4>
          <p>${noticia.description || ''}</p>
          <p><strong>Link:</strong> ${noticia.linkText || ''} (${noticia.linkHref || '#'})</p>
          <div class="admin-actions">
            <button type="button" data-action="edit" data-index="${indice}">Editar</button>
            <button type="button" data-action="delete" data-index="${indice}">Excluir</button>
          </div>
        </article>
      `).join('');
    }

    function limparFormulario() {
      form.reset();
      indiceEdicao = null;
      form.querySelector('button[type="submit"]').textContent = 'Salvar notícia';
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const noticia = {
        date: form.date.value.trim(),
        title: form.title.value.trim(),
        description: form.description.value.trim(),
        linkText: (form.linkText.value || 'Ler mais →').trim(),
        linkHref: (form.linkHref.value || '#').trim()
      };

      if (indiceEdicao === null) noticias.push(noticia);
      else noticias[indiceEdicao] = noticia;

      salvarNoticiasDoJogos(noticias);
      renderizarLista();
      limparFormulario();
    });

    lista.addEventListener('click', (event) => {
      const botao = event.target.closest('button[data-action]');
      if (!botao) return;

      const indice = Number(botao.dataset.index);
      if (Number.isNaN(indice) || !noticias[indice]) return;

      if (botao.dataset.action === 'edit') {
        indiceEdicao = indice;
        form.date.value = noticias[indice].date || '';
        form.title.value = noticias[indice].title || '';
        form.description.value = noticias[indice].description || '';
        form.linkText.value = noticias[indice].linkText || '';
        form.linkHref.value = noticias[indice].linkHref || '';
        form.querySelector('button[type="submit"]').textContent = 'Atualizar notícia';
      }

      if (botao.dataset.action === 'delete') {
        noticias.splice(indice, 1);
        salvarNoticiasDoJogos(noticias);
        renderizarLista();
        limparFormulario();
      }
    });

    resetButton.addEventListener('click', () => {
      noticias = [...NOTICIAS_PADRAO];
      salvarNoticiasDoJogos(noticias);
      renderizarLista();
      limparFormulario();
    });

    logoutButton.addEventListener('click', () => {
      sessionStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
      window.location.href = obterUrlAdmin('admin-calendario.html');
    });

    renderizarLista();
  }

function carregarCategoriasElenco() {
    try {
      const salvo = localStorage.getItem(STORAGE_ELENCO_KEY);
      if (!salvo) return [...ELENCO_PADRAO];
      const parsed = JSON.parse(salvo);
      if (!Array.isArray(parsed) || !parsed.length) return [...ELENCO_PADRAO];
      return parsed.map((categoria, indice) => {
        const padrao = ELENCO_PADRAO[indice] || {
          title: 'Categoria',
          description: '',
          image: '',
          alt: ''
        };

        const imagemTexto = typeof categoria?.image === 'string' ? categoria.image.trim() : '';
        const imageValida = /^data:image\//i.test(imagemTexto)
          || /^img\//i.test(imagemTexto)
          || /^https?:\/\//i.test(imagemTexto)
          || /^\//.test(imagemTexto);
        return {
          title: (categoria?.title || padrao.title || '').trim(),
          description: (categoria?.description || padrao.description || '').trim(),
          image: imageValida ? imagemTexto : (padrao.image || ''),
          alt: (categoria?.alt || padrao.alt || '').trim()
        };
      });
    } catch (erro) {
      console.warn('Não foi possível carregar categorias do elenco. Usando padrão.', erro);
      return [...ELENCO_PADRAO];
    }
  }

  function salvarCategoriasElenco(categorias) {
    try {
      localStorage.setItem(STORAGE_ELENCO_KEY, JSON.stringify(categorias));
    } catch (erro) {
      console.warn('Não foi possível salvar categorias do elenco.', erro);
    }
  }

  function renderizarElencoNaPagina() {
    const container = document.getElementById('roster-categories');
    if (!container) return;

const categorias = carregarCategoriasElenco();
    container.innerHTML = categorias.map((categoria, indice) => {
      const imagemPadrao = ELENCO_PADRAO[indice]?.image || '';
      const imagemFinal = categoria.image || imagemPadrao;

      return `
      <div class="category-container slide-in-left">
        <h3 class="category-title">${categoria.title || ''}</h3>
        <p class="category-description">${categoria.description || ''}</p>
        <div class="category-photo">
          <img src="${imagemFinal}" alt="${categoria.alt || ''}" class="roster-image" onerror="this.onerror=null; this.src='${imagemPadrao}'">
        </div>
      </div>
    `;
    }).join('');
  }

  function inicializarEdicaoElencoAdmin() {
    const form = document.getElementById('admin-roster-form');
    const lista = document.getElementById('admin-roster-list');
    const resetButton = document.getElementById('admin-roster-reset');
    const logoutButton = document.getElementById('admin-roster-logout');
    const imageInput = form?.querySelector('input[name="image"]');
    const imagePreview = document.getElementById('admin-roster-image-preview');
    const imageEmpty = document.getElementById('admin-roster-image-empty');
    const removeImageButton = document.getElementById('admin-roster-image-remove');
    if (!form || !lista || !resetButton || !logoutButton || !imageInput || !imagePreview || !imageEmpty || !removeImageButton) return;

    if (!obterSessaoAdmin()) {
      window.location.href = obterUrlAdmin('admin-calendario.html');
      return;
    }

    let categorias = carregarCategoriasElenco();
    let indiceEdicao = null;
     let imagemFormulario = '';

function lerArquivoComoDataUrl(arquivo) {
      return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload = () => resolve(String(leitor.result || ''));
        leitor.onerror = () => reject(new Error('Falha ao ler arquivo de imagem.'));
        leitor.readAsDataURL(arquivo);
      });
    }

    function renderizarLista() {
      if (!categorias.length) {
        lista.innerHTML = '<p>Nenhuma categoria cadastrada.</p>';
        return;
      }

      lista.innerHTML = categorias.map((categoria, indice) => `
        <article class="admin-item">
          <div class="admin-roster-row">
            ${categoria.image
              ? `<img src="${categoria.image}" alt="${categoria.alt || categoria.title || 'Imagem da categoria'}" class="admin-roster-thumb">`
              : '<div class="admin-roster-thumb admin-roster-thumb-empty">Sem imagem</div>'}
            <div class="admin-roster-content">
              <h4>${categoria.title || ''}</h4>
              <p>${categoria.description || ''}</p>
            </div>
          </div>
          <div class="admin-actions">
            <button type="button" data-action="edit" data-index="${indice}">Editar</button>
            <button type="button" data-action="delete" data-index="${indice}">Excluir</button>
          </div>
        </article>
      `).join('');
    }

function atualizarPreviewImagem(srcImagem) {
      imagemFormulario = srcImagem || '';
      if (!imagemFormulario) {
        imagePreview.hidden = true;
        imagePreview.src = '';
        imageEmpty.hidden = false;
        return;
      }

      imagePreview.hidden = false;
      imagePreview.src = imagemFormulario;
      imageEmpty.hidden = true;
    }

    function limparFormulario() {
      form.reset();
      indiceEdicao = null;
      atualizarPreviewImagem('');
      form.querySelector('button[type="submit"]').textContent = 'Salvar categoria';
    }

imageInput.addEventListener('change', async () => {
      const arquivoImagem = imageInput.files?.[0];
      if (!arquivoImagem) return;
      if (!arquivoImagem.type.startsWith('image/')) {
        alert('Envie um arquivo de imagem válido.');
        imageInput.value = '';
        return;
      }
      const imagemLida = await lerArquivoComoDataUrl(arquivoImagem);
      atualizarPreviewImagem(imagemLida);
    });

    removeImageButton.addEventListener('click', () => {
      imageInput.value = '';
      atualizarPreviewImagem('');
    });

form.addEventListener('submit', async (event) => {
  event.preventDefault();

    const imagem = imagemFormulario;

      if (!imagem) {
        alert('Selecione uma imagem para a categoria.');
        return;
      }

  const categoria = {
        title: form.title.value.trim(),
        description: form.description.value.trim(),
        image: imagem,
        alt: form.alt.value.trim()
      };

      if (indiceEdicao === null) categorias.push(categoria);
      else categorias[indiceEdicao] = categoria;

      salvarCategoriasElenco(categorias);
      renderizarLista();
      limparFormulario();
    });

    lista.addEventListener('click', (event) => {
      const botao = event.target.closest('button[data-action]');
      if (!botao) return;

      const indice = Number(botao.dataset.index);
      if (Number.isNaN(indice) || !categorias[indice]) return;

      if (botao.dataset.action === 'edit') {
        indiceEdicao = indice;
        form.title.value = categorias[indice].title || '';
        form.description.value = categorias[indice].description || '';
        imageInput.value = '';
        atualizarPreviewImagem(categorias[indice].image || '');
        form.alt.value = categorias[indice].alt || '';
        form.querySelector('button[type="submit"]').textContent = 'Atualizar categoria';
      }

      if (botao.dataset.action === 'delete') {
        categorias.splice(indice, 1);
        salvarCategoriasElenco(categorias);
        renderizarLista();
        limparFormulario();
      }
    });

    resetButton.addEventListener('click', () => {
      categorias = [...ELENCO_PADRAO];
      salvarCategoriasElenco(categorias);
      renderizarLista();
      limparFormulario();
    });

    logoutButton.addEventListener('click', () => {
      sessionStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
      window.location.href = obterUrlAdmin('admin-calendario.html');
    });

    renderizarLista();
  }

  // -----------------------------
  // Inicialização principal
  // -----------------------------

  async function inicializar() {
    inicializarControleAcessoDoSite();
    ativarLinkNavegacao();
    adicionarAnimacaoScroll();
    adicionarEfeitoBotaoCTA();
    inicializarAnimacoesExtras();
    adicionarLinksNoticias();
    inicializarFormularioSeletiva();
    renderizarElencoNaPagina();
    renderizarNoticiasEmJogos();
    await inicializarCalendarioJogos();
    await inicializarLoginAdminCalendario();
    await inicializarEdicaoAdminCalendario();
    inicializarEdicaoNoticiasAdmin();
    inicializarEdicaoElencoAdmin();
    inicializarControleJogadoresAdmin();
  }

  return { inicializar };
})();

document.addEventListener('DOMContentLoaded', ADHC.inicializar);