#!/usr/bin/env node


'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assumeRole = assumeRole;
exports.getProfile = getProfile;

require('babel-polyfill');

var _awsSdk = require('aws-sdk');

var _path = require('path');

var _fs = require('fs');

var _ini = require('ini');

var _os = require('os');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function assumeRole(profile) {
  var creds = new _awsSdk.SharedIniFileCredentials({ profile: profile });

  var awsProfileDir = creds.filename ? (0, _path.dirname)(creds.filename) : (0, _path.join)((0, _os.homedir)(), '.aws');
  var file = process.env.AWS_CONFIG_FILE || (0, _path.join)(awsProfileDir, 'config');

  var config = (0, _ini.parse)((0, _fs.readFileSync)(file, 'utf-8'))['profile ' + profile];
  var sts = new _awsSdk.STS();

  var options = {
    RoleArn: config.role_arn,
    RoleSessionName: profile + '-' + Date.now()
  };

  return new Promise(function (resolve, reject) {
    sts.assumeRole(options, function (error, response) {
      if (error) reject(error);else resolve(response.Credentials);
    });
  });
}

function getProfile() {
  return process.env.AWS_PROFILE || 'default';
}

exports.default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(profile) {
    var _ref2, AccessKeyId, SecretAccessKey, SessionToken;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            process.stderr.write('Using the "' + profile + '" aws profile.\n');
            process.stdin.setEncoding('utf8');

            _context.prev = 2;
            _context.next = 5;
            return assumeRole(profile);

          case 5:
            _ref2 = _context.sent;
            AccessKeyId = _ref2.AccessKeyId;
            SecretAccessKey = _ref2.SecretAccessKey;
            SessionToken = _ref2.SessionToken;

            process.stdout.write('AWS_ACCESS_KEY_ID=' + AccessKeyId + ' AWS_SECRET_ACCESS_KEY=' + SecretAccessKey + ' AWS_SESSION_TOKEN=' + SessionToken);
            _context.next = 16;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context['catch'](2);

            process.stderr.write(_context.t0.message + "\n");
            process.exitCode = 1;

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[2, 12]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();