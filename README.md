## Planejador Web

Neste projeto desenvolvi do zero um sistema de gestão pessoal. O objetivo desse sistema é ajudar a organizar e planejar processos como: controlar as finanças, estudar e se comprometer com objetivos pessoais. Vale ressaltar que cada usuário tem acesso único e exclusivo aos seus próprios registros.

`Características`

As funcionalidades deste sistema são apresentadas através de uma estrutura com as seguintes páginas:

* Página de login, logout e registro.
* Todas as imagens utilizadas no aplicativo (logotipo e imagens ilustrativas em cada uma das opções de gerenciamento) são de minha autoria.
* Página Inicial: Na página inicial são mostradas ao usuário as opções disponíveis para gestão: finanças, estudos e metas. Um calendário também pode ser exibido, mostrando a data atual. Todos os cartões de gestão * têm aplicada a data/hora do último movimento.
* Página de gerenciamento financeiro: Registros de dados financeiros separados por categoria, opções de adicionar, editar ou apagar registros, bem como pesquisa.
* Página de gerenciamento de estudos: nesta página o usuário pode se cadastrar e acompanhar seus cursos/estudos bem como o andamento dos cursos registrados. Tambem é possivel adicionar, editar, apagar e pesquisar registros. 
* Página de gerenciamento de objetivos: nesta página o usuário pode cadastrar, acompanhar e alterar suas metas e objetivos. 

`Complexidade`

A comunicação entre back e front end foi feita pelo Framework Django, estruturado em Python. A parte visual do projeto utiliza ferramentas Bootstrap, promovendo um design moderno e bonito.

Ainda no front-end foram aplicadas as seguintes tecnologias: Javascript - para potencializar o uso de outras ferramentas e melhorar a usabilidade do usuário interagindo de forma dinâmica, HTML e CSS (SAASS - explorando suas funcionalidades extremamente relevantes e tornando o código ainda mais claro) . Por fim, o sistema também faz uso do React e traz um agradável calendário na tela inicial. O sistema é totalmente responsivo às telas móveis.

**Como executar o aplicativo**

Execute as migrações com o comando python manage.py makemigrations.
Aplique migrações com o comando python manage.py migrate.
Execute o servidor usando python manager.py runserver.
