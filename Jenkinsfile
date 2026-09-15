// Pipeline do GameEducator: orquestra os mesmos comandos ja validados
// localmente (./mvnw clean verify, npm test, docker build/compose) -
// nada de logica de build exclusiva do CI, para manter local e CI
// identicos.
pipeline {
    agent any

    parameters {
        // Host do registry (ex.: registry.exemplo.com). Vazio = estagio
        // "Publish" fica no-op ate haver um registry real configurado.
        string(name: 'DOCKER_REGISTRY', defaultValue: '', description: 'Docker registry host para publicar as imagens em main')
    }

    options {
        timestamps()
    }

    stages {
        stage('Backend: Build & Test') {
            steps {
                sh './mvnw -B clean verify'
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                    archiveArtifacts artifacts: 'target/site/jacoco/**', allowEmptyArchive: true
                    jacoco(
                        execPattern: 'target/jacoco.exec',
                        classPattern: 'target/classes',
                        sourcePattern: 'src/main/java'
                    )
                }
            }
        }

        stage('Backend: Docker Build') {
            steps {
                sh "docker build -t gameeducator-backend:${env.GIT_COMMIT} ."
                script {
                    if (env.BRANCH_NAME == 'main') {
                        sh "docker tag gameeducator-backend:${env.GIT_COMMIT} gameeducator-backend:latest"
                    }
                }
            }
        }

        stage('Frontend: Install & Test') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run test'
                }
            }
        }

        stage('Frontend: Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Frontend: Docker Build') {
            steps {
                sh "docker build -t gameeducator-frontend:${env.GIT_COMMIT} ./frontend"
                script {
                    if (env.BRANCH_NAME == 'main') {
                        sh "docker tag gameeducator-frontend:${env.GIT_COMMIT} gameeducator-frontend:latest"
                    }
                }
            }
        }

        stage('Integration Smoke Test') {
            steps {
                sh 'docker compose -f docker-compose.yml up -d'
                sh '''
                    for i in $(seq 1 30); do
                        curl -sf http://localhost:8080/v3/api-docs > /dev/null && break
                        sleep 2
                    done
                    curl -sf http://localhost:8080/v3/api-docs > /dev/null
                    curl -sfI http://localhost:8081/ > /dev/null
                '''
            }
            post {
                always {
                    sh 'docker compose -f docker-compose.yml logs backend || true'
                    sh 'docker compose -f docker-compose.yml down -v || true'
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
}
