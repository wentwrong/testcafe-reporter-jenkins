# testcafe-reporter-jenkins
![](https://github.com/wentwrong/testcafe-reporter-jenkins/workflows/.github/workflows/node-ci.yml/badge.svg)

This is the **jenkins** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

<p align="center">
    <img src="https://raw.github.com/wentwrong/testcafe-reporter-jenkins/master/media/preview.png" alt="preview" />
</p>

## Install

```
npm install testcafe-reporter-jenkins
```

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter jenkins
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('jenkins') // <-
    .run();
```
