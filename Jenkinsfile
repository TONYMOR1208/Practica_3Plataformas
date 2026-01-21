pipeline {
    agent any

    environment {
        DOCKER_API_VERSION = '1.44'
    }

    tools {
        nodejs "Node25"
        dockerTool 'Dockertool'
    }

    stages {

        stage('Verificar herramientas') {
            steps {
                sh '''
                    node -v
                    npm -v
                    docker --version
                    docker info >/dev/null
                '''
            }
        }

        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Ejecutar tests') {
            steps {
                sh 'chmod +x ./node_modules/.bin/jest || true'
                sh 'npm test -- --ci --runInBand'
            }
        }

        stage('Construir Imagen Docker') {
            steps {
                sh 'docker build -t hola-mundo-node:latest .'
            }
        }

        stage('Ejecutar Contenedor Node.js') {
            steps {
                sh '''
                    set +e
                    docker stop hola-mundo-node 2>/dev/null || true
                    docker rm hola-mundo-node 2>/dev/null || true

                    # Si algún contenedor está usando el puerto 3005, lo liberamos
                    CID=$(docker ps -q --filter "publish=3005")
                    if [ ! -z "$CID" ]; then
                        docker stop $CID || true
                        docker rm $CID || true
                    fi
                    set -e

                    docker run -d --name hola-mundo-node -p 3005:3005 hola-mundo-node:latest
                '''
            }
        }
    }
}
