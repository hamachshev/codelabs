import prompts from 'prompts';
import degit from 'degit';
import path from 'path';
import fs from 'fs'

const languages = [
    {
      name: 'JavaScript',
      testingFrameworks: [
        { name: 'Jest', command: 'jest ^' },
        { name: 'Mocha', command: 'mocha --grep "^"' },
        { name: 'Vitest', command: 'vitest --testNamePattern="^"' },
        { name: 'AVA', command: 'ava -m "^"' },
      ],
      repo: 'github.com/example',
      init: 'mkdir ${name} && cd ${name} && npm init -y',
    },
    {
      name: 'TypeScript',
      testingFrameworks: [
        { name: 'Jest', command: 'jest ^' },
        { name: 'Vitest', command: 'vitest --testNamePattern="^"' },
        { name: 'Mocha', command: 'mocha --grep "^"' },
        { name: 'uvu', command: 'uvu' },
      ],
      repo: 'github.com/example',
      init: 'mkdir ${name} && cd ${name} && npm init -y',
    },
    {
      name: 'Python',
      testingFrameworks: [
        { name: 'pytest', command: 'pytest -k "^"' },
        { name: 'unittest', command: 'python -m unittest discover -p "^*.py"' },
        { name: 'nose2', command: 'nose2 -m "^"' },
        { name: 'doctest', command: 'python -m doctest ^.py' },
      ],
      repo: 'github.com/example',
      init: 'mkdir ${name} && cd ${name} && python -m venv env',
    },
    {
      name: 'Java',
      testingFrameworks: [
        { name: 'JUnit', command: 'mvn test -Dtest="^*"' },
        { name: 'TestNG', command: 'mvn test -Dtest="^*"' },
        { name: 'Spock', command: 'gradle test --tests "^*"' },
      ],
      repo: 'github.com/example',
      init: 'mkdir ${name} && cd ${name} && mvn archetype:generate',
    },
    {
      name: 'C#',
      testingFrameworks: [
        { name: 'xUnit', command: 'dotnet test --filter "FullyQualifiedName~^"' },
        { name: 'NUnit', command: 'dotnet test --filter "FullyQualifiedName~^"' },
        { name: 'MSTest', command: 'dotnet test --filter "TestCategory=^"' },
      ],
      repo: 'github.com/example',
      init: 'dotnet new console -o ${name}',
    },
    {
      name: 'C++',
      testingFrameworks: [
        { name: 'Google Test', command: './test_binary --gtest_filter="^*"' },
        { name: 'Boost.Test', command: './test_binary --run_test=^*' },
        { name: 'Catch2', command: './test_binary "[^*]"' },
      ],
      repo: 'github.com/example',
      init: 'mkdir ${name} && cd ${name} && cmake . && make',
    },
    {
      name: 'Go',
      testingFrameworks: [
        { name: 'testing (built-in)', command: 'go test -run "^"' },
        { name: 'Ginkgo', command: 'ginkgo -focus="^"' },
        { name: 'Testify', command: 'go test -run "^"' },
      ],
      repo: 'github.com/example',
      init: 'go mod init ${name}',
    },
    {
      name: 'Rust',
      testingFrameworks: [
        { name: 'cargo test (built-in)', command: 'cargo test ^' },
        { name: 'specs', command: 'cargo test ^' },
        { name: 'proptest', command: 'cargo test ^' },
      ],
      repo: 'github.com/example',
      init: 'cargo new ${name}',
    },
    {
      name: 'Ruby',
      testingFrameworks: [
        { name: 'RSpec', command: 'rspec --example "^"' },
        { name: 'Minitest', command: 'ruby -Ilib:test test/^_test.rb' },
        { name: 'Cucumber', command: 'cucumber --name "^"' },
      ],
      repo: 'github.com/example',
      init: 'mkdir ${name} && cd ${name} && bundle init',
    },
    {
      name: 'PHP',
      testingFrameworks: [
        { name: 'PHPUnit', command: 'phpunit --filter "^"' },
        { name: 'Codeception', command: 'codecept run --grep "^"' },
        { name: 'Behat', command: 'behat --name "^"' },
      ],
      repo: 'github.com/example',
      init: 'composer init --name="${name}"',
    },
    {
      name: 'Kotlin',
      testingFrameworks: [
        { name: 'Kotest', command: './gradlew test --tests "^*"' },
        { name: 'JUnit', command: './gradlew test --tests "^*"' },
        { name: 'Spek', command: './gradlew test --tests "^*"' },
      ],
      repo: 'github.com/example',
      init: 'mkdir ${name} && cd ${name} && gradle init',
    },
    {
      name: 'Swift',
      testingFrameworks: [
        { name: 'XCTest', command: 'xcodebuild test -only-testing:^' },
        { name: 'Quick', command: 'xcodebuild test -only-testing:^' },
        { name: 'Nimble', command: 'xcodebuild test -only-testing:^' },
      ],
      repo: 'github.com/example',
      init: 'mkdir ${name} && cd ${name} && swift package init --type executable',
    },
    {
      name: 'Scala',
      testingFrameworks: [
        { name: 'ScalaTest', command: 'sbt "testOnly * -- -z ^"' },
        { name: 'Specs2', command: 'sbt "testOnly * -- -include ^"' },
        { name: 'MUnit', command: 'sbt "testOnly * -- -z ^"' },
      ],
      repo: 'github.com/example',
      init: 'mkdir ${name} && cd ${name} && sbt new scala/scala-seed.g8',
    },
    {
      name: 'Dart',
      testingFrameworks: [
        { name: 'test (built-in)', command: 'dart test --name "^"' },
        { name: 'flutter_test', command: 'flutter test --name "^"' },
      ],
      repo: 'github.com/example',
      init: 'dart create ${name}',
    },
  ];



  
  const { lang } = await prompts({
    type: 'select',
    name: 'lang',
    message: 'Choose your programming language',
    choices: languages.map((lang ) => ({ title: lang.name, value: lang })),
  });

  const { testingFramework } = await prompts({
    type: 'select',
    name: 'testingFramework',
    message: 'Choose your testing framework',
    choices: lang.testingFrameworks
    .map(testingFramework => ({
      title: testingFramework.name,
      value: testingFramework,
    }))
  });
  


const { name } = await prompts({
  type: 'text',
  name: 'name',
  message: 'Name of CodeLab:',
  initial: 'my-feature'
});

//this is for astro/starlight
const emitter = degit("base starlight/astro template");
emitter.on('info', info => {
	console.log(info.message);
});

await emitter.clone(`/${name}`);

const filePath = path.resolve('./codelab.config.json');
const jsonData = fs.writeFileSync(filePath, JSON.stringify({
    testing: {
        command: testingFramework.command
    }
}, null, 2));

function getInitCommand(lang, name) {
    return lang.init.replace(/\$\{name\}/g, name);
}

exec(getInitCommand(lang, name), (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`⚠️ Stderr: ${stderr}`);
      return;
    }
    console.log(`✅ Output:\n${stdout}`);
  });
  

console.log(`\n✅ Created /${name}`);