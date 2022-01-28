import plugin from 'windicss/plugin'

plugin(({ addComponents }) => {
  addComponents({
    '.example': {
      borderRadius: '5px',
      overflow: 'hidden',
      shadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    },
  })
})
