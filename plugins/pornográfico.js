let handler = async (m, { conn, text, participants, groupMetadata }) => {
  // Verificar si es grupo
  if (!m.isGroup) return
  
  const command = (text || '').toLowerCase()
  const malasPalabras = ['porno', 'xxx', 'paja', 'porno', 'sexo', 'nopor', 'onlyfans']
  const tieneContenidoProhibido = malasPalabras.some(palabra => command.includes(palabra))
  
  if (tieneContenidoProhibido) {
    try {
      // Responder con groserías
      const groserias = [
        'Eres un maldito degenerado, vete a la mierda',
        'Pedazo de mierda, aquí no queremos gente como tú',
        'Hijo de puta, vete a buscar porno a otro lado',
        'Cállate perro, nadie quiere tu contenido asqueroso'
      ]
      const groseria = groserias[Math.floor(Math.random() * groserias.length)]
      
      await conn.reply(m.chat, `@${m.sender.split('@')[0]} ${groseria}`, m, { mentions: [m.sender] })
      
      // Esperar un poco y expulsar
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      
    } catch (e) {
      console.error(e)
      await conn.reply(m.chat, `Hubo un error al expulsar al degenerado`, m)
    }
  }
}

handler.command = /^\.(porno|xxx|sexo|nopor|paja)$/i
handler.group = true
export default handler