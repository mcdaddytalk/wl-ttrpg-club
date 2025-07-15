module.exports = {
    branches: ['main'],
    plugins: [
    '@semantic-release/commit-analyzer',       // determines version bump (based on commit messages)
    '@semantic-release/release-notes-generator', // generates changelog content
    ['@semantic-release/changelog', {
      changelogFile: 'CHANGELOG.md',
      changelogTitle: '# 📦 Changelog'
    }],
    '@semantic-release/github'
  ]
  };