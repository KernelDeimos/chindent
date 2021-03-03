# chindent : **ch**ange **indent**

## Examples

### `heredoc`

Use `heredoc` for string literals.
Heredoc removes indentation, similar to block strings like in YAML.

```
const { heredoc } = require('chindent');

var yml = heredoc`
  properties:
    name: 'Phone Dog',
    catchphrase: 'Hello! Yes; this is dog.',
`;
```

produces:

```
"properties:\n  name: 'Phone Dog',\n  catchphrase: 'Hello! Yes; this is dog.',\n"
```

## `dedent`

Use `dedent` for string variables. This `dedent` is idempotent,
and preserves leading and trailing whitespace.

```
dedent('  foo\n    bar'); // 'foo\n  bar'
dedent('foo\n  bar'); // 'foo\n  bar' (no change)
```

## `ipdent` (**i**n-**p**lace in**dent**)

Use `ipdent` to specify the minimum indentation, without modifying
the first string. The indentation is specified as a string of whitspace
or a number indicating how many spaces of indentation are needed.

```
var myString = `
  if ( ${a} == ${b} ) {
    ${ipdent(contents, '    ')}
  }
`
```



## Setup

### Add with `npm` or `yarn`

```
npm install chindent
```

```
yarn add chindent
```

### `require` with or without custom settings

```
const chindent = require('chindent');
```

```
const myChindent = require('chindent')({ tabWidth: 8 });
```

## Contributing

- Install dev dependancies (mocha and chai)
- Always check `npm test` before submitting code
