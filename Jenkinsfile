pipeline {
  agent any

  environment {
    CI = 'true'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm ci'
          } else {
            bat 'npm ci'
          }
        }
      }
    }

    stage('Install Playwright Browsers') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm run install:browsers'
          } else {
            bat 'npm run install:browsers'
          }
        }
      }
    }

    stage('Build') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm run build'
          } else {
            bat 'npm run build'
          }
        }
      }
    }

    stage('Test') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm run test:ci'
          } else {
            bat 'npm run test:ci'
          }
        }
      }
    }
  }

  post {
    always {
      script {
        if (isUnix()) {
          sh 'mkdir -p test-results'
        } else {
          bat 'if not exist test-results mkdir test-results'
        }
      }
      archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
      junit allowEmptyResults: true, testResults: 'test-results/*.xml'
    }
  }
}
