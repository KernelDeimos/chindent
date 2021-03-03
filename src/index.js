// Indent operations that I'm using...
// - in-place indent
// - dedent
// - indent
// - nedent

var r_public = {};
var public = (name, model) => { r_public[name] = model };
var bind = (ins, name) => { return r_public[name].fn.bind(ins); }

var defaultInstance = {
  tabWidth: 4,
  countBlankLines: false
};

public('getTabWidth', {
  fn: function () {
    return this.tabWidth;
  }
})

public('countLeftIndent', {
  documentation: `
    Counts the left identation of the provided string, using the
    instance variable 'tabWidth' as the count value of tab characters.
  `,
  fn: function (str) {
    var indent = 0;
    for ( let i = 0 ; i < str.length ; i++ ) {
      if ( str[i] == ' ' ) indent++;
      else if ( str[i] == '\t' ) indent += this.tabWidth;
      else break;
    }
    return indent;
  }
});

public('countMinIndent', {
  documentation: `
    Counts the minimum indentation found within a block of text.
  `,
  fn: function (strOrArray) {
    var minIndent = -1;
    var lines = Array.isArray(strOrArray)
      ? strOrArray : strOrArray.split('\n');
    minIndent = Infinity;
    for ( let i = 0 ; i < lines.length ; i++ ) {
      if ( lines[i].trim() == '' && ! this.countBlankLines ) continue;
      let indent = bind(this, 'countLeftIndent')(lines[i]);
      if ( indent < minIndent ) minIndent = indent;
    }
    return minIndent;
  }
});

public('dedent', {
  documentation: `
    Reduces indentation for all non-blank lines of a string equally
    until the line with the smallest indentation has no indentation.

    Result is indented using spaces.
  `,
  todo: ['Add configuration to convert indentation to tabs'],
  fn: function (str) {
    var lines = str.split('\n');
    var minIndent = bind(this, 'countMinIndent')(lines);
    return lines.map(line => line.slice(minIndent)).join('\n');
  }
});

public('heredoc', {
  documentation: `
    Performs 'dedent' and 'trim' on a string consequtively. Output will
    have a trailing line feed.

    This function also works as a tag, where interpolation is done
    after processing whitespace.
  `,
  todo: ['Add configuration to convert indentation to tabs'],
  fn: function (strs, ...vals) {
    strs = typeof strs == 'string' ? [ strs ] : strs;
    var minIndent = bind(this, 'countMinIndent')(strs.join('|'));
    var strLines = strs.map(str => str.split('\n'));

    for ( let i = 0 ; i < strLines.length ; i++ ) {
      for ( let j = 0 ; j < strLines[i].length ; j++ ) {
        if ( i != 0 && j == 0 ) continue;
        strLines[i][j] = strLines[i][j].slice(minIndent);
      }
    }

    var output = strLines[0].join('\n');
    if ( vals ) for ( let i = 0 ; i < vals.length ; i++ ) {
      output += vals[i] + strLines[i+1].join('\n');
    }
    return output.trim() + '\n';
  }
});
const ipdent = (str, space) => (
  s => [s.slice(0, 1), ...s.slice(1).map(v => space + v)]
)(str.split('\n')).join('\n');

public('ipdent', {
  fn: (str, space) => {
    if ( typeof space == 'number' ) {
      space = Array(space).fill(' ').join('');
    }
    return (
      s => [s.slice(0, 1), ...s.slice(1).map(v => space + v)]
    )(str.split('\n')).join('\n')
  }
});

var exportFn = function (config, target_) {
  config = config ? { ...defaultInstance, ...config } : defaultInstance;
  var exp = target_ || {};
  exp.documentation = {};
  for ( let key in r_public ) {
    exp[key] = r_public[key].fn.bind(config);
    exp.documentation[key] = r_public[key].documentation;
  }
  return exp;
};

module.exports = exportFn(null, exportFn);
