const path = require('path');

const appIcon = () => {
  switch (process.platform) {
    case 'win32': return path.join('src', 'renderer', 'assets', 'icons','win','icon.ico');
    case 'linux': return path.join('src', 'renderer','assets', 'icons','png','1024x1024.png');
    case 'darwin': return path.join('src', 'renderer','assets', 'icons','mac','icon.icns');
  }
}

module.exports = {
  'packagerConfig': {
    'icon': appIcon(),
    'asar': true
  },
  'makers': [
    {
      'name': '@electron-forge/maker-squirrel',
      'config': {
        'name': 'music_tagger',
        'loadingGif': path.join('src', 'renderer', 'assets', 'splash-screen.gif'),
        'setupIcon': path.join('src', 'renderer', 'assets', 'icons','win','icon.ico'),
        'skipUpdateIcon': true
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
          'icon': 'src/renderer/assets/icons/mac/icon.icns',
          'categories': [
            'AudioVideo',
            'Audio',
            'AudioVideoEditing'
          ]
        }
      }
    },
    {
      'name': '@electron-forge/maker-rpm',
      'config': {
        'options': {
          'maintainer': 'Jose Vega',
          'homepage': 'https://github.com/jvegaf/music-tagger',
          'icon': 'src/renderer/assets/icons/mac/icon.icns',
          'categories': [
            'AudioVideo',
            'Audio',
            'AudioVideoEditing'
          ]
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
