module.exports = {
    branches: ['main'],
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      '@semantic-release/changelog',
      '@semantic-release/github',
      '@semantic-release/git'
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