var fs = require('fs')
var path = require('path')

var _ = require('lodash')
var envPaths = require('env-paths')
var home = require('os-homedir')

var config

var getConfigDir = function () {
  // If configuration exists in the old default path use it
  try {
    fs.accessSync(path.join(home(), '.greenkeeperrc'))
    return home()
  } catch (err) {
    // Use XDG environment variable and fallback to OS default
    return envPaths('', {suffix: ''}).config
  }
}

var configPath = path.join(getConfigDir(), '.greenkeeperrc')

try {
  config = JSON.parse(fs.readFileSync(configPath))
} catch (e) {
  config = {}
}

exports.get = function (name) {
  return name
    ? config[name]
    : config
}

exports.set = function (name, value) {
  config[name] = value
  exports._save()
}

exports.unset = function (name) {
  delete config[name]
  exports._save()
}

exports.replace = function (newConfig) {
  config = newConfig
  exports._save()
}

exports.merge = function (newConfig) {
  _.merge(config, newConfig)
  exports._save()
}

exports._save = function () {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}
