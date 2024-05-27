<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<p align='center'>
  <img src='https://github.com/termsurf/bead.tree/blob/make/view/bead.svg?raw=true' width='192'>
</p>

<h3 align='center'>bead.tree</h3>
<p align='center'>
  The BaseTree Package Manager
</p>

<br/>
<br/>
<br/>

## Theory

### Goals

Should be able to:

- Link packages globally for sharing between projects during
  development.

### Storage

When you install packages, it hard symlinks them from your
`~/Library/base` folder to your `./link` folder.

```
~/Library/base/v000
  # global dependencies
  /hook
    /deck
      /<host+deck>
        /...files
        /link
          /base.js
          /package.json
  # shared dependencies
  /deck
    /<host+deck>
      /...files
      /link
        /base.js
        /package.json
  /file # file store
    /<hash-code>
      /<hash>.{js,tree}
```

```
./link
  /:host
    /:deck
      /:mark
```

Then, `/:host/:deck/:mark` is hard linked from:

```
~/Library/base/deck/:host+deck
```

And inside `~/Library/base/deck/*`, the files are hard linked to
`~/Library/base/file/:code/:hash`.

When you `base link <deck>`, it symlinks from the symlink inside of
`~/Library/base/deck/*`.

This handles:

- Globally installed decks go into `hook/link`.
- The rest of the installed decks get shared in `link`.

#### Using `package.json`

It installs them from any available NPM compatible hosting service, like
npmjs.org or github.com.

Here is the `package.json` that gets generated for the package.

```json
{
  "name": "@termsurf/base.tree",
  "base": true,
  "version": "0.0.1"
}
```

It simply uses the NPM ecosystem as a generic package hosting system.

#### Package size

Max package size is **8mb**. This is basically the same as what NPM
enforces (they say they support 20mb, but people have encountered errors
publishing 10mb packages, so we choose 8mb).

### Searching

When it searches for files, it assumes the `CWD` is the deck base
folder, and so looks for the `./base.tree` file for that deck. It then
uses this information to determine the `role` of each nested file. Some
nested folders can also be nested decks, so those are determined too at
this point.

It then looks for the `link/lock.tree` file to make sure it is a folder
which contains installed decks. The `link` folder can be customized
using the `hold link` tree code.

```
/something/deeply/nested.tree
/something/deeply/nested/base.tree
```

### Lockfile

```
base <0.0.1>

load @termsurf/moon
  mark <*>
  lock <0.0.1>
load @termsurf/bolt
  mark <*>
  lock <0.0.1>
load @termsurf/wolf
  mark <*>
  lock <0.0.1>

link <@termsurf/wolf:0.0.1>
  hash <sha512-O8jcjabXaleOG9DQ0+ARXWZBTfnP4WNAqzuiJK7ll44AmxGKv/J2M4TPjxjY3znBCfvBXFzucm1twdyFybFqEA==>
  load @termsurf/bolt
    mark <0.0.1>
```

## License

Copyright 2023 <a href='https://term.surf'>TermSurf</a>

Licensed under the Apache License, Version 2.0 (the "License"); you may
not use this file except in compliance with the License. You may obtain
a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## TermSurf

This is being developed by the folks at [TermSurf](https://term.surf), a
California-based project for helping humanity master information and
computation. TermSurf started off in the winter of 2008 as a spark of an
idea, to forming a company 10 years later in the winter of 2018, to a
seed of a project just beginning its development phases. It is entirely
bootstrapped by working full time and running
[Etsy](https://etsy.com/shop/termsurf) and
[Amazon](https://www.amazon.com/s?rh=p_27%3AMount+Build) shops. Also
find us on [Facebook](https://www.facebook.com/termsurf),
[Twitter](https://twitter.com/termsurf), and
[LinkedIn](https://www.linkedin.com/company/termsurf). Check out our
other GitHub projects as well!
