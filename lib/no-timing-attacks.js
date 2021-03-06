// From https://github.com/evilpacket/eslint-rules/blob/master/no-timing-attacks.js
module.exports = function(context) {
  'use strict';

  var keywords = '((' + [
      'password',
      'secret',
      'api',
      'token',
      'auth',
      'pass',
      'hash'
  ].join(')|(') + '))';

  var re = new RegExp('^' + keywords + '$', 'im');

  function containsKeyword (node) {
    if (node.type === 'Identifier') {
      if (re.test(node.name)) {
        return true;
      }
    }

    return false;
  }

  return {
    'IfStatement': function(node) {
      if (node.test && node.test.type === 'BinaryExpression') {
        if (node.test.operator === '==' || node.test.operator === '===' ||
            node.test.operator === '!=' || node.test.operator === '!==') {
          if (node.test.left) {
            var left = containsKeyword(node.test.left);

            if (left) {
              return context.report(node, 'Potential timing attack, left side: ' + left);
            }
          }

          if (node.test.right) {
            var right = containsKeyword(node.test.right);

            if (right) {
              return context.report(node, 'Potential timing attack, right side: ' + right);
            }
          }
        }
      }
    }
  };
};
