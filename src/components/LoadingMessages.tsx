export function getLoadingMessage () {
  const messages = [
    'asking...',
    'connecting to user...',
    'intercepting signals...',
    'decoding fragments...',
    'parsing echoes...',
    'gathering whispers...',
    'analyzing frequencies...',
    'seeking patterns...'
  ]

  const selectedMessage = Math.floor(Math.random() * messages.length)

  return selectedMessage
}
