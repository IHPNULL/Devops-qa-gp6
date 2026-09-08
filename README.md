# GameEducator — Grupo 6

Plataforma gamificada de ensino. O professor publica o conteúdo do curso como
**missões** com **desafios**; o aluno joga, ganha **XP**, acompanha **notas** e
participa do **fórum** de cada curso.

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

O trabalho seguiu **BDD → TDD** para cada User Story. Os artefatos de
planejamento estão em [`BACKLOG.md`](BACKLOG.md):

1. **Product Backlog** — User Stories priorizadas (Essencial / Importante / Desejável).
2. **User Story por integrante** — 1 US por pessoa, escolhida por prioridade.
3. **Sprint Backlog (BDD)** — cada US vira cenário `Dado / Quando / Então` com
   critérios de aceitação.
4. **Sprint — Implementação** — cada cenário é quebrado em `SCENARIO / EXECUTION /
   RESULTS (ASSERTS)`, que viram os testes.
5. **Ciclo TDD por US:**
   - **RED** — escreve o teste a partir do BDD; cria *stubs* só para compilar; o teste falha.
   - **GREEN** — implementação mínima no *service* para o teste passar.
   - **BLUE** — refatora (remove duplicação, extrai métodos) com os testes verdes.
6. **Rastreabilidade** — tabela cenário → *service* → classe de teste em `BACKLOG.md`.

> O passo a passo RED → GREEN → BLUE das US de **notas** e **fórum** está
> registrado em 3 commits na branch `pratica5-tdd-notas-forum`.

---

## Testes

`./mvnw test` → **73 testes, 0 falhas**. Cobertura JaCoCo: **100% linhas / 100% branches**.

| Camada | Classe de teste | Testes | O que cobre |
|---|---|---:|---|
| Aceitação (BDD) | `AlunoResolveDesafioTest` | 6 | US01 — aluno responde desafio e recebe XP |
| Aceitação (BDD) | `ProfessorCriaMissaoTest` | 7 | US02 — professor cria missão com desafios |
| Aceitação (BDD) | `AlunoVeNotasTest` | 7 | US — aluno vê as próprias notas do curso |
| Aceitação (BDD) | `AlunoInterageNoForumTest` | 7 | US — aluno lê, publica e responde no fórum |
| Unidade / erros | `CaminhosDeErroDeMissaoEJogoTest` | 13 | validações e permissões de missão/jogo |
| Unidade / erros | `CaminhosDeErroDeNotasEForumTest` | 9 | validações e permissões de nota/fórum |
| Unidade | `RegrasDeDominioTest` | 5 | invariantes das entidades de domínio |
| Web (`@WebMvcTest`) | `MissaoControllerTest` | 8 | contrato HTTP/JSON de missões (service dublado) |
| Web (`@WebMvcTest`) | `JogoControllerTest` | 8 | contrato HTTP/JSON de resposta/progresso/ranking |
| Integração (`@SpringBootTest`) | `CenarioBddIntegracaoTest` | 2 | cenário BDD ponta a ponta: HTTP → service → banco |
| Smoke | `Grupo1GameeducatorApplicationTests` | 1 | o contexto Spring sobe |

**Como os testes são montados:**

- `CenarioBase` centraliza o *setup* (fixtures `umProfessor`, `umAluno`, `umCurso`,
  `matricular`, `missaoDeExemplo`). Cada teste roda em transação própria, revertida
  no fim (`@Transactional`).
- Todo teste segue **AAA**: *Arrange* (fixtures) → *Action* (chamada ao *service*)
  → *Assert* (Esperado × Obtido).
- O nome de cada `@DisplayName` cita o `assert` do critério de aceitação, para
  ligar o teste ao BDD.
- Quality gate no `pom.xml`: o build falha se a cobertura cair abaixo de
  95% linhas / 90% branches.
