const handler = async (m, { conn, text }) => {
  const user = global.db.data.users[m.sender]

  // Marca al usuario como AFK
  user.afk = +new Date
  user.afkReason = text || ''

  await conn.reply(
    m.chat,
    `🖤 *vuelve pronto* 👻\nHas entrado en estado AFK.\n○ Motivo » *${text || 'sin especificar'}*`,
    m
  )
}

handler.help = ['afk [razón]']
handler.tags = ['tools']
handler.command = ['afk']

export default handler