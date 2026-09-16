// Pipeline do GameEducator: builda uma imagem Docker por projeto (backend,
// frontend, api-tests, ui-tests), roda os testes de cada um DENTRO da
// imagem, e so entao sobe a integracao (Postgres) e a automacao (Cucumber)
// usando essas mesmas imagens - nunca reconstruindo nada no meio do caminho
// ("--no-build" nos comandos de compose). Qualquer falha para a pipeline:
// o Jenkins marca o estagio e o build como FAILURE e os estagios seguintes
// aparecem como "skipped".
//
// Como rodar isso localmente: ver jenkins/README.md (sobe um Jenkins +
// Docker-in-Docker via "docker compose -f jenkins/docker-compose.yml up -d").
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 60, unit: 'MINUTES')
        skipDefaultCheckout() // o proprio 1o estagio decide como buscar o codigo (ver abaixo)
    }

    parameters {
        // Host do registry (ex.: registry.exemplo.com). Vazio = estagio
        // "Publish" fica no-op ate haver um registry real configurado.
        string(name: 'DOCKER_REGISTRY', defaultValue: '', description: 'Docker registry host para publicar as imagens em main')
    }

    environment {
        // Nome unico por build: evita que duas execucoes desta pipeline (ou uma
        // execucao manual na sua maquina) colidam nos nomes de rede/container do
        // Compose. Minusculo porque e assim que o Compose exige.
        COMPOSE_PROJECT_NAME = "gameeducator-${env.BUILD_NUMBER}"
    }

    stages {
        stage('Codigo-fonte') {
            steps {
                // Limpa so o workspace de execucao do Jenkins (nunca a pasta /src, que e
                // so-leitura e fica FORA do workspace) antes de copiar o codigo de novo.
                // Sem isso, um arquivo apagado do projeto continuaria aqui de um build
                // anterior, e um "docker cp ... backend/target" poderia empilhar dentro
                // de um "backend/target" que já existia (virando "target/target").
                deleteDir()
                script {
                    // LOCAL_SOURCE_DIR e definido pelo Jenkins local deste repositorio
                    // (jenkins/docker-compose.yml): a pasta local NAO e um repositorio
                    // Git, entao o codigo chega aqui por um volume somente-leitura em vez
                    // de "checkout scm". Se este job rodar num Jenkins com Git de verdade
                    // configurado (LOCAL_SOURCE_DIR ausente), cai no "checkout scm" normal.
                    if (env.LOCAL_SOURCE_DIR) {
                        sh """
                            tar -C "${env.LOCAL_SOURCE_DIR}" \\
                                --exclude=.git --exclude=node_modules --exclude=target --exclude=testsReports \\
                                -cf - . | tar -xf -
                        """
                    } else {
                        checkout scm
                    }
                }
                script {
                    // Tag das imagens: os 12 primeiros caracteres do commit quando o
                    // Jenkins conhece um (job Git de verdade); senao, "local-<numero do build>".
                    env.IMAGE_TAG = sh(returnStdout: true, script: '''
                        if [ -n "$GIT_COMMIT" ]; then
                            echo "$GIT_COMMIT" | cut -c1-12
                        else
                            echo "local-${BUILD_NUMBER}"
                        fi
                    ''').trim()
                    echo "IMAGE_TAG=${env.IMAGE_TAG}  COMPOSE_PROJECT_NAME=${env.COMPOSE_PROJECT_NAME}"
                }
            }
        }

        stage('Backend: testes') {
            steps {
                sh "docker build -f docker/backend.Dockerfile --target test -t gameeducator-backend:${IMAGE_TAG}-test ."
                sh "docker run --name ${COMPOSE_PROJECT_NAME}-backend-test gameeducator-backend:${IMAGE_TAG}-test"
            }
            post {
                always {
                    // "backend/target" inteiro (surefire-reports, site/jacoco, jacoco.exec,
                    // classes): mesma estrutura que "./mvnw verify" geraria localmente, para
                    // os steps abaixo funcionarem igual a antes desta pipeline usar imagens.
                    sh "docker cp ${COMPOSE_PROJECT_NAME}-backend-test:/app/target backend/target || true"
                    sh "docker rm -f ${COMPOSE_PROJECT_NAME}-backend-test || true" // limpeza: falha aqui nao pode mascarar o resultado do teste acima
                    junit testResults: 'backend/target/surefire-reports/*.xml', allowEmptyResults: true
                    archiveArtifacts artifacts: 'backend/target/site/jacoco/**', allowEmptyArchive: true
                    jacoco(
                        execPattern: 'backend/target/jacoco.exec',
                        classPattern: 'backend/target/classes',
                        sourcePattern: 'backend/src/main/java'
                    )
                }
            }
        }

        stage('Backend: imagem') {
            steps {
                sh "docker build -f docker/backend.Dockerfile -t gameeducator-backend:${IMAGE_TAG} ."
                script {
                    if (env.BRANCH_NAME == 'main') {
                        sh "docker tag gameeducator-backend:${IMAGE_TAG} gameeducator-backend:latest"
                    }
                }
            }
        }

        stage('Frontend: testes') {
            steps {
                sh "docker build -f docker/frontend.Dockerfile --target test -t gameeducator-frontend:${IMAGE_TAG}-test ."
                sh "docker run --name ${COMPOSE_PROJECT_NAME}-frontend-test gameeducator-frontend:${IMAGE_TAG}-test"
            }
            post {
                always {
                    sh "docker cp ${COMPOSE_PROJECT_NAME}-frontend-test:/app/reports frontend-reports || true"
                    sh "docker rm -f ${COMPOSE_PROJECT_NAME}-frontend-test || true" // limpeza: falha aqui nao pode mascarar o resultado do teste acima
                    junit testResults: 'frontend-reports/junit.xml', allowEmptyResults: true
                    archiveArtifacts artifacts: 'frontend-reports/coverage/**', allowEmptyArchive: true
                }
            }
        }

        stage('Frontend: imagem') {
            steps {
                sh "docker build -f docker/frontend.Dockerfile -t gameeducator-frontend:${IMAGE_TAG} ."
                script {
                    if (env.BRANCH_NAME == 'main') {
                        sh "docker tag gameeducator-frontend:${IMAGE_TAG} gameeducator-frontend:latest"
                    }
                }
            }
        }

        stage('Automacao: imagens') {
            steps {
                // O build ja roda "mvnw test-compile" (api-tests) e falha se o codigo de
                // teste nao compilar. Os cenarios Cucumber em si rodam so no estagio
                // "Automacao: Cucumber", contra o backend+frontend reais.
                sh "docker build -f docker/api-tests.Dockerfile -t gameeducator-api-tests:${IMAGE_TAG} ."
                sh "docker build -f docker/ui-tests.Dockerfile -t gameeducator-ui-tests:${IMAGE_TAG} ."
            }
        }

        stage('Integracao (Postgres)') {
            steps {
                sh "docker compose -f docker/docker-compose.yml up -d --no-build db backend frontend"
                sh '''
                    ok=0
                    for i in $(seq 1 30); do
                        if docker compose -f docker/docker-compose.yml exec -T backend wget -q -O- http://127.0.0.1:8080/v3/api-docs > /dev/null 2>&1; then
                            ok=1; break
                        fi
                        sleep 2
                    done
                    if [ "$ok" != "1" ]; then
                        echo "ERRO: backend (perfil postgres) nao respondeu em /v3/api-docs apos 60s" >&2
                        exit 1
                    fi
                    docker compose -f docker/docker-compose.yml exec -T backend wget -q -O- http://127.0.0.1:8080/v3/api-docs > /dev/null
                    docker compose -f docker/docker-compose.yml exec -T frontend wget -q -O- http://127.0.0.1/v3/api-docs > /dev/null
                '''
            }
            post {
                always {
                    sh 'docker compose -f docker/docker-compose.yml logs backend || true'
                    sh 'docker compose -f docker/docker-compose.yml down -v || true' // limpeza: nunca deve mascarar uma falha do teste acima
                }
            }
        }

        stage('Automacao: Cucumber API + UI') {
            steps {
                sh "docker compose -f docker/docker-compose.yml -f automation/docker-compose.automation.yml up -d --no-build backend frontend"
                sh '''
                    ok=0
                    for i in $(seq 1 30); do
                        if docker compose -f docker/docker-compose.yml -f automation/docker-compose.automation.yml exec -T backend wget -q -O- http://127.0.0.1:8080/v3/api-docs > /dev/null 2>&1; then
                            ok=1; break
                        fi
                        sleep 2
                    done
                    if [ "$ok" != "1" ]; then
                        echo "ERRO: backend (perfil automation) nao respondeu em /v3/api-docs apos 60s" >&2
                        exit 1
                    fi
                    docker compose -f docker/docker-compose.yml -f automation/docker-compose.automation.yml exec -T frontend wget -q -O- http://127.0.0.1/v3/api-docs > /dev/null
                '''
                sh "docker run --name ${COMPOSE_PROJECT_NAME}-api-tests --network ${COMPOSE_PROJECT_NAME}_default gameeducator-api-tests:${IMAGE_TAG}"
                sh "docker run --name ${COMPOSE_PROJECT_NAME}-ui-tests --network ${COMPOSE_PROJECT_NAME}_default gameeducator-ui-tests:${IMAGE_TAG}"
            }
            post {
                always {
                    sh "docker cp ${COMPOSE_PROJECT_NAME}-api-tests:/app/target/cucumber-report api-tests-cucumber-report || true"
                    sh "docker cp ${COMPOSE_PROJECT_NAME}-api-tests:/app/target/surefire-reports api-tests-surefire-reports || true"
                    sh "docker cp ${COMPOSE_PROJECT_NAME}-ui-tests:/app/reports ui-tests-reports || true"
                    sh "docker rm -f ${COMPOSE_PROJECT_NAME}-api-tests ${COMPOSE_PROJECT_NAME}-ui-tests || true"
                    sh 'docker compose -f docker/docker-compose.yml -f automation/docker-compose.automation.yml logs backend || true'
                    sh 'docker compose -f docker/docker-compose.yml -f automation/docker-compose.automation.yml down -v || true' // limpeza: nunca deve mascarar uma falha do teste acima
                    junit testResults: 'api-tests-surefire-reports/*.xml', allowEmptyResults: true
                    junit testResults: 'ui-tests-reports/junit-report.xml', allowEmptyResults: true
                    archiveArtifacts artifacts: 'api-tests-cucumber-report/**, ui-tests-reports/**', allowEmptyArchive: true
                }
            }
        }

        stage('Publish') {
            when {
                branch 'main'
            }
            steps {
                script {
                    if (!params.DOCKER_REGISTRY) {
                        echo 'DOCKER_REGISTRY nao configurado - pulando publicacao das imagens.'
                        return
                    }
                    // Credencial 'gameeducator-docker-registry' (usuario/senha ou token)
                    // cadastrada no Jenkins credentials store - nunca hardcoded aqui.
                    // Nao roda neste Jenkins local (sem job Git/branch "main", plugin
                    // "docker-workflow" nao instalado - ver jenkins/README.md).
                    docker.withRegistry("https://${params.DOCKER_REGISTRY}", 'gameeducator-docker-registry') {
                        sh "docker tag gameeducator-backend:latest ${params.DOCKER_REGISTRY}/gameeducator-backend:latest"
                        sh "docker push ${params.DOCKER_REGISTRY}/gameeducator-backend:latest"
                        sh "docker tag gameeducator-frontend:latest ${params.DOCKER_REGISTRY}/gameeducator-frontend:latest"
                        sh "docker push ${params.DOCKER_REGISTRY}/gameeducator-frontend:latest"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // env.IMAGE_TAG pode nao existir se o estagio "Codigo-fonte" falhou
                // antes de calcula-lo - sem isso, nem chegou a buildar imagem nenhuma.
                if (env.IMAGE_TAG) {
                    sh "docker rmi gameeducator-backend:${env.IMAGE_TAG}-test gameeducator-frontend:${env.IMAGE_TAG}-test || true" // limpeza; as imagens finais (sem "-test") ficam
                }
            }
            sh "echo 'Imagens desta build:' && docker images 'gameeducator-*' --format 'table {{.Repository}}\\t{{.Tag}}\\t{{.CreatedAt}}' || true"
        }
    }
}
