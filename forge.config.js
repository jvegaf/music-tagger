const path = require('path');

module.exports = {
  'packagerConfig': {},
  'makers': [
    {
      'name': '@electron-forge/maker-squirrel',
      'config': {
        'name': 'music_tagger',
        'loadingGif': path.join('src', 'assets', 'splash-screen.gif')
      }
    },
    {
      'name': '@electron-forge/maker-zip',
      'platforms': [
        'darwin'
      ]
    },
    {
      'name': '@electron-forge/maker-deb',
      'config': {
        'options': {
          'maintainer': 'Jose Vega',
          'homepage': 'https://github.com/jvegaf/music-tagger',
          'icon': 'src/assets/icons/music-tagger.png'
        }
      }
    }
  ],
  'publishers': [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'jvegaf',
          name: 'music-tagger'
        }
      }
    }
  ]
}
