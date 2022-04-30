pipeline {
    agent any
    stages {
        stage('Verify Installation Of Nodejs') {
            steps {
                sh 'node --version'
            }
        }
        stage('Installing Packages') {
            steps {
                sh 'npm i'
            }
        }
        stage('Launching App') {
            steps {
                sh 'URI="mongodb+srv://sayf:sayf12@cluster0.lnrhp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" node app'
            }}}
        }
