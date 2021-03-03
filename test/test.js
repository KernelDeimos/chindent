var expect = require('chai').expect;

describe('getTabWidth', () => {
  it('should default to 4 spaces', () => {
    const { getTabWidth } = require('../src/index');
    expect(getTabWidth()).equal(4);
  });
  it('should depend on configuration object', () => {
    const { getTabWidth } = require('../src/index')({ tabWidth: 2 });
    expect(getTabWidth()).equal(2);
  });
});

describe('countLeftIndent', () => {
  it('should behave in basic case', () => {
    const { countLeftIndent } = require('../src/index');
    expect(countLeftIndent('    abc')).equal(4);
    expect(countLeftIndent('  abc')).equal(2);
  });
  it('should behave in zero case', () => {
    const { countLeftIndent } = require('../src/index');
    expect(countLeftIndent('abc')).equal(0);
  });
  it('should respect tab width', () => {
    const { countLeftIndent } = require('../src/index');
    expect(countLeftIndent('\tabc')).equal(4);
  });
  it('should work with mixed tabs and spaces', () => {
    const { countLeftIndent } = require('../src/index');
    expect(countLeftIndent(' \t abc')).equal(6);
    expect(countLeftIndent('\t \tabc')).equal(9);
  });
});

describe('countMinIndent', () => {
  it('should count minimum indent', () => {
    const { countMinIndent } = require('../src/index');
    expect(countMinIndent(`
        this is a test
      this is a test
    `)).equal(6);
  });
});

describe('dedent', () => {
  it('should dedent a string without whitespaces changes', () => {
    const { dedent } = require('../src/index');
    expect(dedent(`
      Hello, yes;
        this is dog.
    `)).equal('\nHello, yes;\n  this is dog.\n');
  });
});

describe('heredoc', () => {
  it('should dedent and trim a string with trailing LF', () => {
    const { heredoc } = require('../src/index');
    // Function style
    expect(heredoc`
      Hello, yes;
        this is dog.
    `).equal('Hello, yes;\n  this is dog.\n');
  });
  it('should handle interpolation cases', () => {
    const { heredoc } = require('../src/index');
    // Function style
    let a = 'Hello', b = 'dog.', c = 'Woof!';
    expect(heredoc`
      ${a}, yes;
        this is ${b}
        ${c}
    `).equal('Hello, yes;\n  this is dog.\n  Woof!\n');
  });
});

describe('ipdent', () => {
  it('should work', () => {
    const { heredoc, ipdent } = require('../src/index');
    expect(heredoc(`
      Hello, yes;
        ${ipdent(heredoc`
          this is dog.
          second line.
        `, 8)}
    `)).equal('Hello, yes;\n  this is dog.\n  second line.\n');
  });
});
