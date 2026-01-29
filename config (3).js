import { watchFile, unwatchFile } from 'fs'

import chalk from 'chalk'

import { fileURLToPath } from 'url'

// ================= OWNER =================

global.owner = [

  ['50432788804', 'Fer', true],

  ['50492777136', 'Fer'] // si quieres, puedes poner nombre aquí

]

// ================= MODS / PREMIUM =================

global.mods = []

global.prems = []

// ================= BOT INFO =================

global.namebot = 'Denji-Bot'

global.packname = ''

global.author = 'Fer | © 2026'

global.moneda = 'denjis'

// ================= LIBRERIAS =================

global.libreria = 'Baileys'

global.baileys = 'V 6.7.16'

global.vs = '2.2.0'

global.sessions = 'Sessions'

global.jadi = 'JadiBots'

global.yukiJadibts = true

// ================= CANALES =================

global.namecanal = '❇️'

global.idcanal = '120363403739366547@newsletter'

global.idcanal2 = '120363403739366547@newsletter'

global.canal = 'https://whatsapp.com/channel/0029Vb7C4sr5fM5abFr6bL0W'

global.canalreg = '120363402895449162@newsletter'

global.ch = {

  ch1: '120363420941524030@newsletter'

}

// ================= AJUSTES =================

global.multiplier = 69

global.maxwarn = 2

// ================= AUTO-REFRESH =================

let file = fileURLToPath(import.meta.url)

watchFile(file, () => {

  unwatchFile(file)

  console.log(chalk.redBright('🔄 Se actualizó config.js'))

  import(`file://\( {file}?update= \){Date.now()}`)

})