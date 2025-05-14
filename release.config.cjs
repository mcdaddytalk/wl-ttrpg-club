module.exports = {
    branches: ['main'],
    plugins: [
    '@semantic-release/commit-analyzer',       // determines version bump (based on commit messages)
    '@semantic-release/release-notes-generator', // generates changelog content
    ['@semantic-release/changelog', {
      changelogFile: 'CHANGELOG.md',
      changelogTitle: '# 📦 Changelog'
    }],
    ['@semantic-release/git', {
      assets: ['CHANGELOG.md', 'package.json', 'pnpm-lock.yaml'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }],
    '@semantic-release/github'
  ],
    verifyConditions: [
      '@semantic-release/github',
      [
        'semantic-release-discord',
        {
          webhookUrl: process.env.DISCORD_RELEASE_WEBHOOK,
          avatar_url: 'https://i.imgur.com/bRMyEWh.png',
          username: 'ReleaseBot'
        }
      ]
    ]
  };