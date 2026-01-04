import yts from 'yt-search'

// Configuración
const API_URL = 'https://api-adonix.ultraplus.click/download/ytaudio'
const API_KEY = 'WilkerKeydukz9l6871'
const MAX_SECONDS = 90 * 60
const HTTP_TIMEOUT_MS = 90 * 1000

globalThis.apikey = API_KEY

// ... (las funciones parseDurationToSeconds, formatErr, fetchJson, fetchBuffer se mantienen igual)

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const chatId = m?.chat || m?.key?.remoteJid
  if (!chatId) return

  if (!text) {
    return conn.sendMessage(
      chatId,
      { 
        text: `🎵 *Descargador de Audio*\n\n` +
              `Ejemplo: *${usedPrefix + command} hola remix dalex*`
      },
      { quoted: m }
    )
  }

  // Reacción de espera
  await conn.sendMessage(chatId, { react: { text: '⏳', key: m.key } }).catch(() => {})

  let ytUrl = text.trim()
  let ytInfo = null

  try {
    if (!/youtu\.be|youtube\.com|y2u\.be|yt\.be/i.test(ytUrl)) {
      const search = await yts(ytUrl)
      const first = search?.videos?.[0]
      
      if (!first) {
        await conn.sendMessage(chatId, { text: '❌ No se encontró el video.' }, { quoted: m })
        return
      }
      
      ytInfo = first
      ytUrl = first.url
    } else {
      const search = await yts({ query: ytUrl, pages: 1 })
      if (search?.videos?.length) {
        ytInfo = search.videos[0]
      }
    }
  } catch (e) {
    await conn.sendMessage(
      chatId,
      { text: `❌ Error: ${formatErr(e, 800)}` },
      { quoted: m }
    )
    return
  }

  // Verificar duración
  const durSec = parseDurationToSeconds(ytInfo?.timestamp)
  if (durSec && durSec > MAX_SECONDS) {
    await conn.sendMessage(
      chatId,
      { text: `❌ Video muy largo (máx ${Math.floor(MAX_SECONDS/60)} min)` },
      { quoted: m }
    )
    return
  }

  // Información del video
  const title = ytInfo?.title || 'Audio'
  const author = ytInfo?.author?.name || ytInfo?.author || 'Desconocido'
  const thumbnail = ytInfo?.thumbnail

  // Usar la API para descargar audio
  try {
    const apiUrl = `${API_URL}?apikey=${encodeURIComponent(API_KEY)}&url=${encodeURIComponent(ytUrl)}`
    
    const apiResp = await fetchJson(apiUrl, HTTP_TIMEOUT_MS)
    
    if (!apiResp?.status || !apiResp?.data?.url) {
      throw new Error('API no devolvió enlace de descarga')
    }

    const directUrl = String(apiResp.data.url)
    const apiTitle = apiResp?.data?.title || title

    // Descargar buffer de audio
    const audioBuffer = await fetchBuffer(directUrl, HTTP_TIMEOUT_MS)

    // ENVIAR TODO EN UN SOLO MENSAJE
    await conn.sendMessage(
      chatId,
      {
        // El audio principal
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        fileName: `${apiTitle.substring(0, 70)}.mp3`.replace(/[^\w\s-]/gi, ''),
        
        // Metadata que se mostrará en WhatsApp
        contextInfo: {
          externalAdReply: {
            // Título principal que aparece arriba
            title: `🎧 ${apiTitle.substring(0, 50)}`,
            
            // Descripción que aparece abajo
            body: `👤 ${author}`,
            
            // Thumbnail/portada del audio
            thumbnailUrl: thumbnail,
            
            // Tipo de media (2 = audio con imagen)
            mediaType: 2,
            
            // URL que se abre al tocar (opcional)
            mediaUrl: ytUrl,
            
            // URL de origen (opcional)
            sourceUrl: ytUrl,
            
            // Mostrar como vista previa de URL
            showAdAttribution: true,
            
            // Texto de atribución (opcional)
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    )

    // Reacción de éxito
    await conn.sendMessage(chatId, { react: { text: '✅', key: m.key } }).catch(() => {})

  } catch (e) {
    await conn.sendMessage(
      chatId,
      { 
        text: `❌ Error al descargar:\n${formatErr(e, 1000)}`
      },
      { quoted: m }
    )
  }
}

// Configuración del comando
handler.help = ['play <texto|enlace>']
handler.tags = ['multimedia', 'descargas']
handler.command = ['play', 'ytplay', 'ytmp3', 'audio', 'song']
handler.limit = true

export default handler