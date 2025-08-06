# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

+-----------+        +-------------+       +-----------------+       +--------------+
|           |        |             |       |                 |       |              |
|  Jenkins  +------->+   GitHub    +------>+   Docker Build  +------>+  Docker Hub  |
|           |        |             |       |                 |       |              |
+-----+-----+        +-------------+       +--------+--------+       +------+-------+
      |                                                  |                  |
      |                                                  |                  v
      |                                                  |          +-------+------+
      |                                                  |          |              |
      +--------------------------------------------------+--------->+   Podman     |
                                                                     |  (Run App)   |
                                                                     +--------------+





Jenkins CI/CD Pipeline Setup.

## 🚀 CI/CD Pipeline – Jenkins, GitHub, Docker Hub, and Podman

### 🔄 Pipeline Flow

1. Jenkins triggers a pipeline.
2. Source code is pulled from GitHub.
3. Jenkins builds a Docker image from the codebase.
4. The Docker image is pushed to Docker Hub.
5. Jenkins then pulls the same image from Docker Hub using Podman.
6. Jenkins runs the container in Podman on a desired port.

### 📦 Tools Used

- **Jenkins** – Orchestrates the entire CI/CD process.
- **GitHub** – Source code repository.
- **Docker** – Used to build and tag the image.
- **Docker Hub** – Docker image registry.
- **Podman** – Used to run the final container in production.






pipeline{
    agent any
    tools{
        jdk 'jdk17'
        nodejs 'node16'
    }
    stages {
        stage('clean workspace'){
            steps{
                cleanWs()
            }
        }
        stage('Checkout from Git'){
            steps{
                git branch: 'main', url: 'https://github.com/Suhanson-alto/Fedorg.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                bat "npm install"
            }
        }
        stage("Docker Build & Push"){
            steps{
                script{
                   withCredentials([usernamePassword(credentialsId: 'docker', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {   
                       bat "docker build -t fedorgg1 ."
                       bat "docker tag fedorgg1 suhanson/fedorg:latest "
                       bat "docker push suhanson/fedorg:latest "
                    }   
                }
            }
        }
	    stage('Pull Image') {
      	    steps {
        	bat 'podman pull suhanson/fedorg:latest'
      		}
    	}
    	stage('Run Container') {
      	    steps {
        	bat 'podman run --name test-nginx -d -p 9006:80 suhanson/fedorg:latest'
      		}
    	}
    	stage('List Running Containers') {
      	    steps {
        	bat 'podman ps'
      		}
    	}
    }
}
