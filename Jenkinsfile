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
                sh 'npm run test'
            }}}
        }
