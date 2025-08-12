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

**1. Install Required Tools**
We’ll need Java, Jenkins, Docker, Podman, and Git installed on Local Machine

**1. Install Required Tools on Windows**
**Step 1 – Install Java**
	Download OpenJDK 17 (Temurin recommended)
	https://adoptium.net/temurin/releases/

**Install and set JAVA_HOME in Environment Variables:**
	* System Properties → Advanced → Environment Variables
 	* Add JAVA_HOME pointing to your JDK folder.
  	* Add %JAVA_HOME%\bin to the Path.

**Step 2 – Install Jenkins (Windows)**
	Download Jenkins LTS .msi installer:
	https://www.jenkins.io/download/
	Run installer, choose Run as a service.
 	After install, Jenkins runs at: http://localhost:8080

**Step 4 – Install Docker Desktop for Windows**
	https://www.docker.com/products/docker-desktop/
	Enable "Use the WSL 2 based engine" in Docker Desktop settings (even if you don’t use WSL directly).
	Ensure docker commands work from Windows Command Prompt or PowerShell

**Step 5 – Install Podman for Windows**
Download Podman for Windows:
https://podman.io/getting-started/installation
Install it (default settings).
Add podman.exe path to Windows Path variable.
Test in PowerShell: podman --version

**Step 6 – Add Docker Hub Credentials**
	Manage Jenkins → Credentials → System → Global credentials → Add Credentials:
	Kind: Username with password
 	ID: dockerhub-creds
  	Username: your_dockerhub_username	
   	Password: your_dockerhub_password

**Step 7 – Allow Jenkins to Use Docker & Podman**
	Since Jenkins runs as a Windows service:
 	Open Services (services.msc).	
  	Find Jenkins service → Right-click → Properties.
	Change "Log on as" to your Windows account that has Docker and Podman access.
	Restart Jenkins service.

**Example Dockerfile**
	FROM node:16-alpine
	WORKDIR /app
	COPY . .
	RUN npm install
	EXPOSE 3000
	CMD ["npm", "start"]

**Notes for Windows:**
	bat is used instead of sh for Windows batch commands.
	If you use PowerShell, replace bat with powershell steps.





**Sometimes, there will be connection issue between jenkins and podman desktop**

	Cannot connect to Podman. Please verify your connection to the Linux system using `podman system connection list`, or try `podman machine init` and `podman 	machine start` to manage a new Linux VM
	Error: unable to connect to Podman socket: Get "http://d/v5.5.2/libpod/_ping": dial unix /run/podman/podman.sock: connect: A socket operation encountered a 	dead network.


Make sure to troubleshoot on podman side.
if your podman is using under wsl, make sure to install ubuntu in wsl and sudo apt get podman. 


 ___________________________________________________________________________________________________________________________________________________

<img width="940" height="511" alt="image" src="https://github.com/user-attachments/assets/b3899baf-eb54-4aa1-b4e0-e3fef83f2d44" />


<img width="940" height="331" alt="image" src="https://github.com/user-attachments/assets/de3eb1d7-346b-44c7-80dd-7a50e1f85c05" />

<img width="940" height="230" alt="image" src="https://github.com/user-attachments/assets/c9017afc-cea4-4636-8d6d-abf7a4c3893a" />



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
