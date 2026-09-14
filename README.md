# GameEducator - Grupo 6

O GameEducator é uma plataforma de ensino gamificada. O professor cria cursos,
missões e desafios. O aluno participa das atividades, ganha XP, consulta as
notas e usa o fórum de cada curso.

**Stack:** Java 21 · Spring Boot 4 (Web + Data JPA) · H2 · JUnit 5 · JaCoCo

**Integrantes:** Italo Haas Pascoli (190294) · Maria Eduarda Mota Zandonade (200953)

---

## Como rodar

```bash
./mvnw spring-boot:run     # sobe a API em http://localhost:8080 (perfil dev com dados de exemplo)
./mvnw clean test          # roda os 73 testes
./mvnw clean verify        # testes + relatório e quality gate do JaCoCo
```

Relatório de cobertura: `target/site/jacoco/index.html`.

---

## Planejamento (processo ATDD)

Para cada User Story, o grupo começou pelo BDD e depois usou TDD. O planejamento
completo está em [`BACKLOG.md`](BACKLOG.md):

1. No Product Backlog, as User Stories foram separadas por prioridade: Essencial,
   Importante ou Desejável.
2. Cada integrante ficou responsável por 1 User Story, escolhida conforme a
   prioridade.
3. No Sprint Backlog (BDD), cada User Story virou um cenário `Dado / Quando / Então`
   com critérios de aceitação.
4. Na implementação, cada cenário foi dividido em `SCENARIO / EXECUTION /
   RESULTS (ASSERTS)`. Esses itens deram origem aos testes.
5. O ciclo TDD de cada User Story teve três etapas:
   - `RED`: o teste é escrito a partir do BDD. São criados apenas os *stubs*
     necessários para compilar, e o teste falha.
   - `GREEN`: é feita a implementação mínima no *service* para o teste passar.
   - `BLUE`: o código é refatorado, por exemplo, removendo duplicações e extraindo
     métodos. Os testes devem continuar passando.
6. A tabela de rastreabilidade em `BACKLOG.md` liga cada cenário ao *service* e à
   classe de teste correspondente.

> O passo a passo RED → GREEN → BLUE das US de **notas** e **fórum** está
> registrado em 3 commits na branch `pratica5-tdd-notas-forum`.

---

## Testes

O comando `./mvnw test` executa 73 testes, com 0 falhas. A cobertura do
JaCoCo está em 100% das linhas e 100% das branches.

| Camada | Classe de teste | Testes | O que cobre |
|--------------------------------|--------------------------------------|----|---------------------------------------------------|
| Aceitação (BDD)                | `AlunoResolveDesafioTest`            | 6  | US01 — aluno responde desafio e recebe XP         |
| Aceitação (BDD)                | `ProfessorCriaMissaoTest`            | 7  | US02 — professor cria missão com desafios         |
| Aceitação (BDD)                | `AlunoVeNotasTest`                   | 7  | US — aluno vê as próprias notas do curso          |
| Aceitação (BDD)                | `AlunoInterageNoForumTest`           | 7  | US — aluno lê, publica e responde no fórum        |
| Unidade / erros                | `CaminhosDeErroDeMissaoEJogoTest`    | 13 | validações e permissões de missão/jogo            |
| Unidade / erros                | `CaminhosDeErroDeNotasEForumTest`    | 9  | validações e permissões de nota/fórum             |
| Unidade                        | `RegrasDeDominioTest`                | 5  | invariantes das entidades de domínio              |
| Web (`@WebMvcTest`)            | `MissaoControllerTest`               | 8  | contrato HTTP/JSON de missões (service dublado)   |
| Web (`@WebMvcTest`)            | `JogoControllerTest`                 | 8  | contrato HTTP/JSON de resposta/progresso/ranking  |
| Integração (`@SpringBootTest`) | `CenarioBddIntegracaoTest`           | 2  | cenário BDD ponta a ponta: HTTP → service → banco |
| Smoke                          | `Grupo1GameeducatorApplicationTests` | 1  | o contexto Spring sobe                            |

Os testes foram organizados assim:

- A classe `CenarioBase` guarda o *setup* e as fixtures `umProfessor`, `umAluno`,
  `umCurso`, `matricular` e `missaoDeExemplo`. Cada teste roda em uma transação
  própria, que é revertida no fim com `@Transactional`.
- Todos os testes seguem o padrão AAA: *Arrange* para preparar as fixtures,
  *Action* para chamar o *service* e *Assert* para comparar o resultado esperado
  com o obtido.
- Cada `@DisplayName` cita o `assert` do critério de aceitação. Assim, fica mais
  fácil relacionar o teste ao cenário BDD.
- O quality gate está configurado no `pom.xml`. O build falha se a cobertura
  ficar abaixo de 95% das linhas ou 90% das branches.
