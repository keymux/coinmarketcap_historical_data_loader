node("docker") {
  checkout scm

  def packageJsonReports = sh(script: "cat package.json | jq -r '.reports[]'", returnStdout: true).split("\n")

  def nvm = { e -> sh("/nvm.sh ${e}") }

  def mapToSteps = load("src/build/map_to_steps.groovy")

  def versions = [
    "6.10.2",
    "6",
    "7",
    "8.10",
    "8",
    "9",
    "10",
  ];

  def image = "keymux/docker-ubuntu-nvm-yarn"
  def tag = "0.2.0"
  def dockerImageAndTag = "${image}:${tag}"

  def yarnCache = "${env.HOME}/.cache/yarn"

  def dockerInDockerVolsArgs = [
    "/var/run/docker.sock",
    "/usr/bin/docker",
    "/usr/local/bin/docker-compose",
    "/usr/lib/x86_64-linux-gnu/libltdl.so.7",
  ].collect { "-v ${it}:${it}:rw" }.join(" ")

  def dockerInDockerArgs = [
    "--entrypoint",
    "''",
    "-u 1001:999",
  ].join(" ");

  def dockerArgs = [
    "-v ${yarnCache}:/.cache/yarn:rw",
    "-w ${env.WORKSPACE}",
  ].join(" ")

  def allDockerArgs = [
    dockerInDockerVolsArgs,
    dockerInDockerArgs,
    dockerArgs,
  ].join(" ");

  docker
    .image(dockerImageAndTag)
    .inside(allDockerArgs) {
    stage("Clean") {
      nvm("git clean -xdf")
    }

    stage("Dependencies") {
      nvm("yarn install --frozen-lockfile --prefer-offline")
      nvm("mkdir -p reports")
      nvm("scripts/get_and_unpack_wiremock_tgz.sh")
    }

    nvm("scripts/dockerUp.sh")

    def wiremockPort = sh(script: "scripts/get_wiremock_port.sh", returnStdout: true).trim()

    def dockerRunTest = { stageName, testCommand ->
      stage(stageName) {
        def fn = { version ->
          def lArgs = [
            "-v ${env.WORKSPACE}:${env.WORKSPACE}:ro",
            "${dockerArgs}",
            "--rm",
            "--net=host",
            "${dockerImageAndTag}",
            "${testCommand}",
          ].join(" ")

          nvm("docker run ${lArgs}")
        }

        parallel(mapToSteps(fn, versions))
      }
    }

    dockerRunTest("Unit tests", "yarn test:unit")

    dockerRunTest("Integration tests", "yarn test:integration")

    stage("Reporting") {
      parallel(mapToSteps({ r -> nvm("yarn report:${r}") }, packageJsonReports))
    }

    nvm("scripts/dockerDown.sh")

    stage("Post report") {
      nvm("yarn report:aggregate")

      withCredentials([string(credentialsId: "jenkins_github_access_token", variable: "GITHUB_ACCESS_TOKEN")]) {
        nvm("yarn submit:comment")
      }
    }
  }
}
