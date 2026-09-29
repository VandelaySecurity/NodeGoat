pipeline {
  agent any
  stages {
    stage('Deploy') {
      steps {
        sh 'sshpass -e scp app.jar deploy@10.0.0.5:/opt/app/'
      }
    }
  }
}
