# PomodoIT - Pomodoro Timer
**Acesse o projeto:**  [PomoDoIt - By Varonii](https://varonii.github.io/Pomodoit/)

Aplicação web de temporizador Pomodoro desenvolvida com HTML, CSS e JavaScript puro (Vanilla JS), criada para auxílio no foco de tarefas e acompanhamento de estudos.

O projeto evoluiu de um timer básico para uma ferramenta completa com gerenciamento de tarefas, personalização de tempos, alertas sonoros e notificações.

---

## Funcionalidades

* **Ciclos de Foco e Pausa:** Modos dedicados para Pomodoro, Pausa Curta e Pausa Longa, com troca dinâmica de temas visuais para cada estado.
* **Gerenciador de Tarefas:**
  * Adição e exclusão de tarefas.
  * Marcação de concluído (com efeito visual).
  * Seleção da tarefa ativa em foco.
  * Contador automático de pomodoros concluídos por tarefa.
* **Painel de Configurações:**
  * Ajuste de duração (Pomodoro, Pausa Curta e Pausa Longa).
  * Seleção de sons de alarme (Piano, Bell, Digital, Fast Bell, Soft).
* **Notificações e Áudio:** Alerta sonoro e notificação nativa do navegador ao finalizar cada ciclo.
* **Persistência de Dados:** Salva configurações e lista de tarefas no `localStorage` do navegador para não perder o progresso ao fechar a página.
* **Design Responsivo:** Adaptado para telas de celular e desktop.

---

## Tecnologias

* **HTML5:** Estrutura semântica e elementos acessíveis.
* **CSS3:** Estilização moderna com Flexbox, transições sutis e suporte a temas.
* **JavaScript (ES6+):** Manipulação do DOM, `setInterval` com correção de tempo (`Date.now()`), API de Notificações, Áudio e `localStorage`.
