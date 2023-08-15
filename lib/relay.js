const fs = require('fs')
const config = JSON.parse(fs.readFileSync(`./config.json`))
const axios = require('axios')
const fetch = require('node-fetch')
const { log, error } = require('console')
const saveImage = require('save-image')
const FormData = require('form-data');
const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment-timezone')
const SpottyDL = require('spottydl')
const path = require('path');
const { promisify } = require('util');
const { createCanvas, loadImage } = require('canvas');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const playSound = require('play-sound')({ player: 'ffplay' });
const sound = require('sound-play') //({ player: 'ffplay' });
const { createAudio } = require('node-mp3-player')
const Aplay = require('node-aplay');
const { spawn } = require('child_process');
const Audio = createAudio();
const treeKill = require('tree-kill');
const ig = require('instagram-url-dl')


var line = '---------------------------------------------------------------------------------------------------'

const { 
    sleep
    } = require('./functions')
//const { data } = require('cheerio/lib/api/attributes')

const musicDir = './music';
let ytprefix = `https://youtu.be/`
let linking = JSON.parse(fs.readFileSync('./lib/music.json'))
let { 
        yt1,
        yt2,
        yt3,
        yt4,
        yt5,
        tyt1,
        tyt2,
        tyt3,
        tyt4,
        tyt5
    } = linking

async function uploadFiles(filePath, name) {
    try {
        const fileData = fs.readFileSync(filePath);
    
        const formData = new FormData();
        formData.append('file', fileData, `${name}.txt`);
    
        const config = {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
            ...formData.getHeaders(),
        },
        };
    
        const response = await axios.post('https://file.io', formData, config);
    
        return response.data;
    } catch (error) {
        return error;
    }
    }

        let currentMusicProcess = null;
        
        function playMusic(file) {
          const filePath = path.join(musicDir, file);
        
          fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK, (err) => {
            if (err) {
              console.error(`Cannot access ${file}: ${err.message}`);
              return;
            }
        
            if (currentMusicProcess) {
              // Stop the current music forcefully using treeKill
              treeKill(currentMusicProcess.pid, 'SIGKILL', (err) => {
                if (err) {
                  console.error(`Error stopping music: ${err.message}`);
                }
                playNewMusic(filePath);
              });
            } else {
              playNewMusic(filePath);
            }
          });
        }
        
        function playNewMusic(filePath) {
          currentMusicProcess = spawn('ffplay', ['-nodisp', '-autoexit', filePath], {
            stdio: 'ignore' // Redirect stdin, stdout, and stderr to ignore
          });
        
          currentMusicProcess.on('error', (err) => {
            console.error(`Cannot play music: ${err.message}`);
            currentMusicProcess = null;
          });
        
          currentMusicProcess.on('exit', (code, signal) => {
            currentMusicProcess = null;
          });
        }
        
        function stopMusic() {
            // Kill the ffplay process and all its child processes
            treeKill(currentMusicProcess.pid, 'SIGKILL', (err) => {
              if (err) {
                console.error(`Error stopping music: ${err.message}`);
              }
              currentMusicProcess = null;
            });
        }
        
        const readDirAsync = promisify(fs.readdir);
        
        async function readMusicFiles() {
          try {
            const files = await readDirAsync(musicDir);
        
            return files.filter((file) => {
              const ext = path.extname(file).toLowerCase();
              return ext === '.mp3';
            });
          } catch (err) {
            console.error(`Cannot read ${musicDir}: ${err.message}`);
            return [];
          }
        }

            // Gunakan async/await untuk membuat kode lebih bersih
    async function downloadYouTubeMp3(videoUrl, outputPath) {
        try {
          const info = await ytdl.getInfo(videoUrl);
          const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
          const format = audioFormats.find(format => format.audioBitrate === Math.max(...audioFormats.map(f => f.audioBitrate)));
      
          if (!format) {
            throw new Error('Tidak dapat menemukan format audio yang sesuai');
          }
      
          console.log(`Judul video: ${info.videoDetails.title}`);
          console.log(`Mengunduh...`);
      
          ytdl(videoUrl, {
            format: format,
          }).pipe(fs.createWriteStream(outputPath));
      
          console.log('Unduhan berhasil');
        } catch (error) {
          console.error('Terjadi kesalahan:', error.message);
        }
      }

exports.start = async(lol, name) => {
    text = `Hello ${name}! Im a IoT Chatbot build with ❤️ by  [my master](${config.ownerLink})\n Start Menu Relay : /help\nStart Menu Smartbin : /helpto`
    await lol.replyWithMarkdown(text, { disable_web_page_preview: true })
}

//=====================================================[MASTER RELAY]=======================================================

exports.help = async(lol, name, user_id) => {
    text = `Button Command Relay IoT Control\nCek relay Command : ketik "relay cek"`
    options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Relay On', callback_data: 'relayon-' + user_id },
                    { text: 'Relay Off', callback_data: 'relayoff-' + user_id },
                    { text: 'Relay Cek', callback_data: 'relaycek-' + user_id }
                ],
                [
                    { text: 'Relay 1', callback_data: 'relay1-' + user_id },
                    { text: 'Relay 2', callback_data: 'relay2-' + user_id },
                    { text: 'Relay 5', callback_data: 'relay5-' + user_id },
                    { text: 'Relay 6', callback_data: 'relay6-' + user_id }
                ],
                [
                    { text: 'Relay 3', callback_data: 'relay3-' + user_id },
                    { text: 'Relay 4', callback_data: 'relay4-' + user_id },
                    { text: 'Relay 7', callback_data: 'relay7-' + user_id },
                    { text: 'Relay 8', callback_data: 'relay8-' + user_id }
                ],
                [
                    { text: 'Auto Mode', callback_data: 'autochange-' + user_id },
                    { text: 'Lamp', callback_data: 'lampinfo-' + user_id },
                    { text: 'Servo', callback_data: 'setservo-' + user_id },    
                    { text: 'get data', callback_data: 'dataproject-' + user_id }
                ],
                [
                    { text: 'Smartbin Command', callback_data: 'helpto-' + user_id }
                ],
                [
                    { text: 'Manual Command', callback_data: 'manualc-' + user_id }
                ],

            ]
        }
    }
    try {
        await lol.editMessageText(text, options)
    } catch {
        await lol.reply(text, options)
    }
}


//======================================================[MASTER SMARTBIN]======================================================

exports.helpto = async(lol, name, user_id) => {
    text = `Button Command SmartBin IoT Control\nCek Bin Command : ketik "bin cek"`
    options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Bin On', callback_data: 'binon-' + user_id },
                    { text: 'Bin Off', callback_data: 'binoff-' + user_id },
                    { text: 'Bin Cek', callback_data: 'bincek-' + user_id }
                ],
                [
                    { text: 'Get Log', callback_data: 'getlog-' + user_id },
                    { text: 'Reset Log', callback_data: 'resetlog-' + user_id },
                    { text: 'Play', callback_data: 'play-' + user_id },
                    { text: 'Spotify', callback_data: 'guidespotify-' + user_id }
                ],
                [
                    { text: 'Relay Command', callback_data: 'help-' + user_id }
                ],
                [
                    { text: 'Manual Command', callback_data: 'manualto-' + user_id }
                ],

            ]
        }
    }
    try {
        await lol.editMessageText(text, options)
    } catch {
        await lol.reply(text, options)
    }
}

//==================================================[ MASTER DEVELOPER ]=========================================================

exports.helpdev = async(lol, name, user_id) => {
    text = `Button Command Developer IoT Control\nCek API : ketik "infoapi"`
    options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Info Api', callback_data: 'infoapi-' + user_id },
                    { text: 'Info Server', callback_data: 'infoserver-' + user_id },
                    { text: 'Change Server', callback_data: 'changedata-' + user_id }
                ],
                [
                    { text: 'Get Log', callback_data: 'getlog-' + user_id },
                    { text: 'Play', callback_data: 'play-' + user_id },
                ],
                [
                    { text: 'Manual Command', callback_data: 'manualto-' + user_id }
                ],

            ]
        }
    }
    try {
        await lol.editMessageText(text, options)
    } catch {
        await lol.reply(text, options)
    }
}


//==================================================[ MASTER SEARCH ]=========================================================

exports.playing = async(lol, name, query, user_id) => {
    const fs = require('fs');
    const path = require('path');
    const { promisify } = require('util');
    const { createCanvas, loadImage } = require('canvas');
    const yts = require('yt-search');
    
    async function searchAndCreateThumbnailCanvas(keyword, maxResults) {
      try {
        const { videos } = await yts(keyword);
        
        linking.tyt1 = `${ytprefix}${videos[0].title}`
        tyt1 = `${ytprefix}${videos[0].title}`
        linking.tyt2 = `${ytprefix}${videos[1].title}`
        yt2 = `${ytprefix}${videos[1].title}`
        linking.tyt3 = `${ytprefix}${videos[2].title}`
        tyt3 = `${ytprefix}${videos[2].title}`
        linking.tyt4 = `${ytprefix}${videos[3].title}`
        tyt4 = `${ytprefix}${videos[3].title}`
        linking.tyt5 = `${ytprefix}${videos[4].title}`
        tyt5 = `${ytprefix}${videos[4].title}`
        fs.writeFileSync('./lib/music.json', JSON.stringify(linking))

        const canvasWidth = 800;
        const canvasHeight = 600; // Diperbesar untuk menambahkan judul dan nomor
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');
    
        // Menambahkan latar belakang
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
        const maxItems = Math.min(videos.length, maxResults); // Batasan maksimum jumlah item yang akan ditampilkan
        const itemHeight = (canvasHeight - 100) / maxItems; // Mengurangi 100 untuk judul dan pilihan
    
        // Menambahkan judul
        ctx.fillStyle = '#000';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Result for "${keyword}"`, canvasWidth / 2, 30);
    
        // Menambahkan instruksi pilihan
        ctx.font = '18px sans-serif';
        ctx.fillText('Please choose 1', canvasWidth / 2, 60);

        linking.yt1 = `${ytprefix}${videos[0].videoId}`
        yt1 = `${ytprefix}${videos[0].videoId}`
        linking.yt2 = `${ytprefix}${videos[1].videoId}`
        yt2 = `${ytprefix}${videos[1].videoId}`
        linking.yt3 = `${ytprefix}${videos[2].videoId}`
        yt3 = `${ytprefix}${videos[2].videoId}`
        linking.yt4 = `${ytprefix}${videos[3].videoId}`
        yt4 = `${ytprefix}${videos[3].videoId}`
        linking.yt5 = `${ytprefix}${videos[4].videoId}`
        yt5 = `${ytprefix}${videos[4].videoId}`
        fs.writeFileSync('./lib/music.json', JSON.stringify(linking))

        for (let i = 0; i < maxItems; i++) {
          const video = videos[i];

          // Load thumbnail image
          const thumbnail = await loadImage(video.image);
    
          // Menggambar thumbnail
          ctx.drawImage(thumbnail, canvasWidth - 140, 100 + i * itemHeight + 10, 120, itemHeight - 20); // Menyesuaikan posisi thumbnail
    
          // Menambahkan nomor pilihan di depan thumbnail
          ctx.fillStyle = '#000';
          ctx.font = '18px sans-serif';
          ctx.fillText(`${i + 1}.`, 10, 100 + i * itemHeight + 30); // Menyesuaikan posisi nomor
    
          // Draw title text
          ctx.fillStyle = '#000';
          ctx.font = '18px sans-serif';
          const maxTitleWidth = canvasWidth - 180 - 140; // Lebar maksimum judul yang ditampilkan
          const words = video.title.split(' ');
          let line = '';
          let lines = [];
    
          for (let word of words) {
            const testLine = line ? line + ' ' + word : word;
            const testWidth = ctx.measureText(testLine).width;
            if (testWidth > maxTitleWidth) {
              lines.push(line);
              line = word;
            } else {
              line = testLine;
            }
          }
          lines.push(line);
    
          for (let j = 0; j < lines.length; j++) {
            const line = lines[j];
            const textY = 100 + i * itemHeight + 30 + (j * 24); // Menyesuaikan posisi judul
            ctx.fillText(line, 180, textY);
          }
    
          // Draw video ID text
          ctx.fillStyle = '#777';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          const idText = `ID: ${video.videoId}`;
          const idTextY = 100 + i * itemHeight + itemHeight - 20;
          ctx.fillText(idText, 180, idTextY);
        }
    
        const outputFilePath = 'combined_thumbnail.png'; // Nama file output
        const out = fs.createWriteStream(outputFilePath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
    
        out.on('finish', () => console.log('Canvas berhasil disimpan:', outputFilePath));
      } catch (error) {
        console.error('Terjadi kesalahan:', error.message);
      }
    }
    
    const keyword = query; // Kata kunci pencarian
    const maxResults = 5; // Jumlah maksimum hasil pencarian yang ingin ditampilkan
    const texttt = `
1. ${tyt1}
    -> ${yt1}

2. ${tyt2}
    -> ${yt2}

3. ${tyt3}
    -> ${yt3}

4. ${tyt4}
    -> ${yt4}

5. ${tyt5}
    -> ${yt5}


`

    text = `Here result for '${query}'\nButton for choice options:\n\n${texttt}`
    options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '1', callback_data: 'getmusic1-' + user_id },
                    { text: '2', callback_data: 'getmusic2-' + user_id },
                    { text: '3', callback_data: 'getmusic3-' + user_id },
                    { text: '4', callback_data: 'getmusic4-' + user_id },
                    { text: '5', callback_data: 'getmusic5-' + user_id },
                ],
                [
                    { text: 'Back', callback_data: 'menu-' +user_id },
                ],

            ]
        }
    }
    try {
        await searchAndCreateThumbnailCanvas(keyword, maxResults);
        //await lol.replyWithDocument({ source: './combined_thumbnail.png' }, { caption: '' });
        await lol.editMessageText(text, options)
    } catch {
        await lol.reply(text, options)
    }
}

exports.getmusic1 = async(lol, name, user_id) => {
    const videoUrl = yt1;
    const outputPath = './music/audio.mp3';  

    text = `Succes Added to Playlist!\n${tyt1}\n${yt1}`

    await downloadYouTubeMp3(videoUrl, outputPath); 
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'play', callback_data: 'playyt1-' + user_id },
                    { text: 'send', callback_data: 'sendyt1-' + user_id },
                ],
                [
                    { text: 'Back', callback_data: 'menu-' +user_id },
                ],
            ]
        }
    })
}

exports.playyt1 = async(lol, user_id) => {
    const musicFiles = await readMusicFiles();
          
    text = `Music Played\n${tyt1}\n${yt1}`

        for (const file of musicFiles) {
            playMusic(file);
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
          
        await lol.editMessageText(text, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Again', callback_data: 'playyt1-' + user_id },
                    ],
                    [
                        { text: 'Back', callback_data: 'menu-' +user_id },
                    ],
                ]
            }
        })
}

//============================================================[POPUP NOTIF ONLINE/OFFLINE DEVICE]======================================================//
exports.helponline = async(lol, name, user_id) => {
    text = `Device Online!\nTurn On Smartbin?\nClick button or manual Command"`
    options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'turn On Bin', callback_data: 'binon-' + user_id }
                ],
                [
                    { text: 'Manual Command', callback_data: 'manualto-' + user_id }
                ],

            ]
        }
    }
    try {
        await lol.editMessageText(text, options)
    } catch {
        await lol.reply(text, options)
    }
}

exports.helpoffline = async(lol, name, user_id) => {
    text = `Device Offline!\nSystem auto Turn Off Smartbin\ncek last data or manual Command"`
    options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Bin cek', callback_data: 'bincek-' + user_id }
                ],
                [
                    { text: 'Manual Command', callback_data: 'manualto-' + user_id }
                ],

            ]
        }
    }
    try {
        await lol.editMessageText(text, options)
    } catch {
        await lol.reply(text, options)
    }
}

//==========================================================[AREA PROJECT RASPI]========================================================
exports.dataproject = async(lol, user_id) => {
    try{
    prefix = config.prefix
    const serverblynk = `sgp1.blynk.cloud`
    const tokenblynk = `aw7VIwTBK3iBUMwdzmRMJkvOz-tD7hvd`

    const getdata = await axios.get(`https://${serverblynk}/external/api/get?token=${tokenblynk}&V0&V1&V2&V3&V4&V5&V6&&V7V8`)
    const dataswauto = getdata.data.V8
    const dataswonoff = getdata.data.V0
    const dataswservo = getdata.data.V5
    const datadistance = getdata.data.V1
    const datawarn = getdata.data.V2
    const dataindexldr = getdata.data.V3
    const datalampindex = getdata.data.V4
    const datatemp = getdata.data.V6
    const dataindexservo = getdata.data.V7


    if (dataswauto == '1'){
        var indexswauto = `AUTO`
    } else {
        var indexswauto = `MANUAL`
    }

    if (dataswonoff == '1'){
        var indexswonoff = `ON`
    } else {
        var indexswonoff = `OFF`
    }

    if (dataswservo == '1'){
        var indexswservo = `Open`
    } else {
        var indexswservo = `Close`
    }

    text = `===== [DATA SWITCH] =====
Mode : ${indexswauto}
Switch Lamp (manual) : ${indexswonoff}
Switch Servo (manual) : ${indexswservo}

===== [ Data Sensor & Index ] =====
Distance : ${datadistance}
Warning : ${datawarn}
index LDR : ${dataindexldr}
Lamp Index : ${datalampindex}
ServoIndex : ${dataindexservo}
Temperature Raspi : ${datatemp}
`


    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Refresh Data', callback_data: 'refreshdata-' + user_id },
                    { text: 'Change Mode', callback_data: 'autochange-' + user_id },
                    { text: 'Lamp Switch', callback_data: 'lampinfo-' + user_id }
                ],
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
} catch (err){
    console.log(err)
}
}

exports.refreshdata = async(lol, user_id) => {
    try{
        prefix = config.prefix
        const serverblynk = `sgp1.blynk.cloud`
        const tokenblynk = `aw7VIwTBK3iBUMwdzmRMJkvOz-tD7hvd`
    
        const getdata = await axios.get(`https://${serverblynk}/external/api/get?token=${tokenblynk}&V0&V1&V2&V3&V4&V5&V6&&V7V8`)
        const dataswauto = getdata.data.V8
        const dataswonoff = getdata.data.V0
        const dataswservo = getdata.data.V5
        const datadistance = getdata.data.V1
        const datawarn = getdata.data.V2
        const dataindexldr = getdata.data.V3
        const datalampindex = getdata.data.V4
        const datatemp = getdata.data.V6
        const dataindexservo = getdata.data.V7
    
    
        if (dataswauto == '1'){
            var indexswauto = `AUTO`
        } else {
            var indexswauto = `MANUAL`
        }
    
        if (dataswonoff == '1'){
            var indexswonoff = `ON`
        } else {
            var indexswonoff = `OFF`
        }
    
        if (dataswservo == '1'){
            var indexswservo = `Open`
        } else {
            var indexswservo = `Close`
        }
    
        text = `===== [DATA SWITCH] =====
    Mode : ${indexswauto}
    Switch Lamp (manual) : ${indexswonoff}
    Switch Servo (manual) : ${indexswservo}
    
    ===== [ Data Sensor & Index ] =====
    Distance : ${datadistance}
    Warning : ${datawarn}
    index LDR : ${dataindexldr}
    Lamp Index : ${datalampindex}
    ServoIndex : ${dataindexservo}
    Temperature Raspi : ${datatemp}
    `
    
    
        await lol.editMessageText(text, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Refresh Data', callback_data: 'dataproject-' + user_id },
                        { text: 'Change Mode', callback_data: 'autochange-' + user_id },
                        { text: 'Lamp Switch', callback_data: 'lampinfo-' + user_id }
                    ],
                    [
                        { text: 'Back', callback_data: 'help-' + user_id }
                    ]
                ]
            }
        })
    } catch (err){
        console.log(err)
    }
    }

exports.setservo = async(lol, user_id) => {
    try{
    prefix = config.prefix
    const serverblynk = `sgp1.blynk.cloud`
    const tokenblynk = `aw7VIwTBK3iBUMwdzmRMJkvOz-tD7hvd`

    const getdata = await axios.get(`https://${serverblynk}/external/api/get?token=${tokenblynk}&V0&V8&V5`)
    const dataswauto = getdata.data.V5.toString()

    if (dataswauto == '1'){
        var indexswauto = `Open`
    } else {
        var indexswauto = `Close`
    }

    text = `Pilih mode servo Open/Close \nStatus saat ini : ${indexswauto}`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Open', callback_data: 'setservoopen-' + user_id},
                    { text: 'Close', callback_data: 'setservoclose-' + user_id}
                ],
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
} catch (err){
    console.log(err)
}
}

exports.setservoopen = async(lol, user_id) => {
    try{
    prefix = config.prefix
    const serverblynk = `sgp1.blynk.cloud`
    const tokenblynk = `aw7VIwTBK3iBUMwdzmRMJkvOz-tD7hvd`

    const updata = await axios.get(`https://${serverblynk}/external/api/update?token=${tokenblynk}&V5=1`)

    text = `Berhasil diubah ke Open`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Open', callback_data: 'setservoopen-' + user_id},
                    { text: 'Close', callback_data: 'setservoclose-' + user_id}
                ],
                [
                    { text: 'Back', callback_data: 'setservo-' + user_id }
                ]
            ]
        }
    })
} catch (err){
    console.log(err)
}
}

exports.setservoclose = async(lol, user_id) => {
    try{
    prefix = config.prefix
    const serverblynk = `sgp1.blynk.cloud`
    const tokenblynk = `aw7VIwTBK3iBUMwdzmRMJkvOz-tD7hvd`

    const updata = await axios.get(`https://${serverblynk}/external/api/update?token=${tokenblynk}&V5=0`)

    text = `Berhasil diubah ke Close`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Open', callback_data: 'setservoopen-' + user_id},
                    { text: 'Close', callback_data: 'setservoclose-' + user_id}
                ],
                [
                    { text: 'Back', callback_data: 'setservo-' + user_id }
                ]
            ]
        }
    })
} catch (err){
    console.log(err)
}
}

exports.autochange = async(lol, user_id) => {
    try{
    prefix = config.prefix
    const serverblynk = `sgp1.blynk.cloud`
    const tokenblynk = `aw7VIwTBK3iBUMwdzmRMJkvOz-tD7hvd`

    const getdata = await axios.get(`https://${serverblynk}/external/api/get?token=${tokenblynk}&V0&V8`)
    const dataswauto = getdata.data.V8.toString()

    if (dataswauto == '1'){
        var indexswauto = `AUTO`
    } else {
        var indexswauto = `MANUAL`
    }

    text = `Pilih Mode Auto/Manual untuk sensor\nStatus saat ini : ${indexswauto}`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'AUTO', callback_data: 'setswauto-' + user_id},
                    { text: 'MANUAL', callback_data: 'setswmanual-' + user_id}
                ],
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
} catch (err){
    console.log(err)
}
}

exports.setswauto = async(lol, user_id) => {
    try{
    prefix = config.prefix
    const serverblynk = `sgp1.blynk.cloud`
    const tokenblynk = `aw7VIwTBK3iBUMwdzmRMJkvOz-tD7hvd`

    const updata = await axios.get(`https://${serverblynk}/external/api/update?token=${tokenblynk}&V8=1`)

    text = `Berhasil diubah ke mode auto`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'AUTO', callback_data: 'setswauto-' + user_id},
                    { text: 'MANUAL', callback_data: 'setswmanual-' + user_id}
                ],
                [
                    { text: 'Back', callback_data: 'autochange-' + user_id }
                ]
            ]
        }
    })
} catch (err){
    console.log(err)
}
}

exports.setswmanual = async(lol, user_id) => {
    try{
    prefix = config.prefix
    const serverblynk = `sgp1.blynk.cloud`
    const tokenblynk = `aw7VIwTBK3iBUMwdzmRMJkvOz-tD7hvd`

    const updata = await axios.get(`https://${serverblynk}/external/api/update?token=${tokenblynk}&V8=0`)

    text = `Berhasil diubah ke mode manual`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'AUTO', callback_data: 'setswauto-' + user_id},
                    { text: 'MANUAL', callback_data: 'setswmanual-' + user_id}
                ],
                [
                    { text: 'Back', callback_data: 'autochange-' + user_id }
                ]
            ]
        }
    })
} catch (err){
    console.log(err)
}
}

exports.lampinfo = async(lol, user_id) => {
    try{
    prefix = config.prefix
    const serverblynk = `sgp1.blynk.cloud`
    const tokenblynk = `aw7VIwTBK3iBUMwdzmRMJkvOz-tD7hvd`

    const getdata = await axios.get(`https://${serverblynk}/external/api/get?token=${tokenblynk}&V0&V8`)
    const dataswonoff = getdata.data.V0.toString()

    if (dataswonoff == '1'){
        var indexswonoff = `ON`
    } else {
        var indexswonoff = `OFF`
    }

    text = `Pilih untuk switch on/off lampu\nStatus saat ini : ${indexswonoff}`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'ON', callback_data: 'setswon-' + user_id },
                    { text: 'OFF', callback_data: 'setswoff-' + user_id }
                ],
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
} catch (err){
    console.log(err)
}
}

exports.setswon = async(lol, user_id) => {
    try{
    prefix = config.prefix
    const serverblynk = `sgp1.blynk.cloud`
    const tokenblynk = `aw7VIwTBK3iBUMwdzmRMJkvOz-tD7hvd`

    const updata = await axios.get(`https://${serverblynk}/external/api/update?token=${tokenblynk}&V0=1`)

    text = `Berhasil menghidupkan`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'ON', callback_data: 'setswon-' + user_id },
                    { text: 'OFF', callback_data: 'setswoff-' + user_id }
                ],
                [
                    { text: 'Back', callback_data: 'lampinfo-' + user_id }
                ]
            ]
        }
    })
} catch (err){
    console.log(err)
}
}

exports.setswoff = async(lol, user_id) => {
    try{
    prefix = config.prefix
    const serverblynk = `sgp1.blynk.cloud`
    const tokenblynk = `aw7VIwTBK3iBUMwdzmRMJkvOz-tD7hvd`

    const updata = await axios.get(`https://${serverblynk}/external/api/update?token=${tokenblynk}&V0=0`)

    text = `Berhasil mematikan`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'ON', callback_data: 'setswon-' + user_id},
                    { text: 'OFF', callback_data: 'setswoff-' + user_id}
                ],
                [
                    { text: 'Back', callback_data: 'lampinfo-' + user_id }
                ]
            ]
        }
    })
} catch(err){
    console.log(err)
}
}

//=============================================================[AREA SMARTBIN]==========================================================

exports.bincek = async(lol, user_id) => { //Get Status Bin
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    const endpointcekbin = await fetch(`https://${serverraspi}/external/api/get?token=${tokenraspi}&V0&V1&V2&V3&V4&V5&V6&V7&V8&V9`)
    axios.get(`https://${serverraspi}/external/api/isHardwareConnected?token=${tokenraspi}`)
    .then(async response => {
        const data = response.data;
        const newDataon = Boolean(data);

                    const cekbin = await endpointcekbin.json()
                    if (cekbin.V0.toString() === "1"){
                        var binstat = `ON` 
                    } else {
                        var binstat = `OFF`
                    }

                    if (cekbin.V9.toString() === "1"){
                        var resetcount = `in reset`
                    } else {
                        var resetcount = `counting`
                    }

                    if (newDataon.toString() === "1"){
                        var indexdataon = `Device Online (Realtime)`
                    } else {
                        var indexdataon = `Device Offline (Last Data)`
                    }

                    const datadistancedalam = cekbin.V1
                    const datadistancetutup =  cekbin.V2
                    const datadistancedepan = cekbin.V3
                    const datacounter = cekbin.V4.split("|")
                    const datatemperature = cekbin.V5
                    const datahumidity = cekbin.V6
                    const datamoving = cekbin.V7.split("|")
                    const datalevel = cekbin.V8
                   
const Vall = `
____________[Status SmartBin]___________

----> ${indexdataon}

-> Status Switch : ${binstat}
-> On Auto Mode : ${datacounter[1]}
-> Tank Level : ${datalevel}
-> Distance Dalam: ${datadistancedalam}
-> Distance Tutup: ${datadistancetutup}
-> Distance Depan: ${datadistancedepan}
-> Counter (index): ${datacounter[0]} (${resetcount})
-> Value Right : ${datamoving[0]}
-> Value Center : ${datamoving[1]}
-> Value Left : ${datamoving[2]}
-> Index Moving : ${datamoving[3]}
-> Temperature: ${datatemperature}
-> Humidity: ${datahumidity}
________________________________________
`
    text = `${Vall}`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'helpto-' + user_id },
                    { text: 'Update Data', callback_data: 'bincek2-' + user_id }           
                ]
            ]
        }
    })
})
}

exports.bincek2 = async(lol, user_id) => { //Get Status Bin
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    axios.get(`https://${serverraspi}/external/api/isHardwareConnected?token=${tokenraspi}`)
    .then(async response => {
        const data = response.data;
        const newDataon = Boolean(data);

    const endpointcekbin = await fetch(`https://${serverraspi}/external/api/get?token=${tokenraspi}&V0&V1&V2&V3&V4&V5&V6&V7&V8&V9`)
                    const cekbin = await endpointcekbin.json()
                    if (cekbin.V0.toString() === "1"){
                        var binstat = `ON` 
                    } else {
                        var binstat = `OFF`
                    }

                    if (cekbin.V9.toString() === "1"){
                        var resetcount = `in reset`
                    } else {
                        var resetcount = `counting`
                    }

                    if (newDataon.toString() === "1"){
                        var indexdataon = `Device Online (Realtime)`
                    } else {
                        var indexdataon = `Device Offline (Last Data)`
                    }

                    const datadistancedalam = cekbin.V1
                    const datadistancetutup =  cekbin.V2
                    const datadistancedepan = cekbin.V3
                    const datacounter = cekbin.V4.split("|")
                    const datatemperature = cekbin.V5
                    const datahumidity = cekbin.V6
                    const datamoving = cekbin.V7.split("|")
                    const datalevel = cekbin.V8
                   
const Vall = `
____________[Status SmartBin]___________

----> ${indexdataon}

-> Status Switch : ${binstat}
-> On Auto Mode : ${datacounter[1]}
-> Tank Level : ${datalevel}
-> Distance Dalam: ${datadistancedalam}
-> Distance Tutup: ${datadistancetutup}
-> Distance Depan: ${datadistancedepan}
-> Counter (index): ${datacounter[0]} (${resetcount})
-> Value Right : ${datamoving[0]}
-> Value Center : ${datamoving[1]}
-> Value Left : ${datamoving[2]}
-> Index Moving : ${datamoving[3]}
-> Temperature: ${datatemperature}
-> Humidity: ${datahumidity}
________________________________________
`
    text = `${Vall}`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'helpto-' + user_id },
                    { text: 'Update Data', callback_data: 'bincek-' + user_id }           
                ]
            ]
        }
    })
})
}

exports.binon = async(lol, user_id) => { //Switch On SmartBin
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    axios.get(`https://${serverraspi}/external/api/isHardwareConnected?token=${tokenraspi}`)
    .then(async response => {
        const data = response.data;
        const newDataon = Boolean(data);

        if(newDataon.toString() === "1"){
    const endpointcekbin = await fetch(`https://${serverraspi}/external/api/get?token=${tokenraspi}&V0&V1`)
    const cekbin = await endpointcekbin.json()
    if (cekbin.V0.toString() === "1"){
        text = `Device Online\nSmartBin sudah hidup`
        var keyboardline = [
            { text: 'Off', callback_data: 'binoff-' + user_id },
            { text: 'Back', callback_data: 'helpto-' + user_id }
        ]
    } else {
        await axios.get(`https://${serverraspi}/external/api/update?token=${tokenraspi}&V0=1`)
        text = `Device Online\nSmartBin Berhasil dihidupkan!`
        var keyboardline = [
            { text: 'Off', callback_data: 'binoff-' + user_id },
            { text: 'Back', callback_data: 'helpto-' + user_id }
        ]
    }
    } else {
        text = `Device Offline\nForce Switch On?`
        var keyboardline = [
            { text: 'Force ON', callback_data: 'binforceon-' + user_id },
            { text: 'Back', callback_data: 'helpto-' + user_id }
            ]
    }
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                keyboardline
            ]
        }
    })
})
}

exports.binforceon = async(lol, user_id) => { //Switch Off SmartBin
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    const endpointcekbin = await fetch(`https://${serverraspi}/external/api/get?token=${tokenraspi}&V0&V1`)
    const cekbin = await endpointcekbin.json()
    if (cekbin.V0.toString() === "1"){
        text = `Switch SmartBin sudah Hidup\nForce On, mungkin tidak akan mempengaruhi device, karena device offline`
    } else {
        await axios.get(`https://${serverraspi}/external/api/update?token=${tokenraspi}&V0=1`)
        text = `Switch SmartBin berhasil dihidupkan\nForce On, mungkin tidak akan mempengaruhi device, karena device offline`
    }
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'binoff-' + user_id },
                    { text: 'Back', callback_data: 'helpto-' + user_id }
                ]
            ]
        }
    })
}

exports.binoff = async(lol, user_id) => { //Switch Off SmartBin
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    const endpointcekbin = await fetch(`https://${serverraspi}/external/api/get?token=${tokenraspi}&V0&V1`)
    const cekbin = await endpointcekbin.json()
    if (cekbin.V0.toString() === "0"){
        text = `SmartBin sudah mati`
    } else {
        await axios.get(`https://${serverraspi}/external/api/update?token=${tokenraspi}&V0=0`)
        text = `SmartBin Berhasil dimatikan!`
    }
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'binon-' + user_id },
                    { text: 'Back', callback_data: 'helpto-' + user_id }
                ]
            ]
        }
    })
}

exports.getlog = async(lol, user_id) => {
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    tokenbot = config.blynk_tokenb
    serverbot = config.blynk_serverb

    text = `Pilih data yang ingin didapat\ndata berupa file .txt, file akan dikirim & diupload ke tempfile\nanda juga bisa mendapatkan live url`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Datalog Switch', callback_data: 'getlogswitch-' + user_id},
                    { text: 'Datalog Count', callback_data: 'getlogcount-' + user_id},
                    { text: 'Datalog Datasensor', callback_data: 'getlogsensor-' + user_id}
                ],
                [
                    { text: 'Back', callback_data: 'helpto-' + user_id }
                ]
            ]
        }
    })
}

exports.getlogswitch = async(lol, user_id) => {
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    tokenbot = config.blynk_tokenb
    serverbot = config.blynk_serverb

    const pathlog = './lib/database/logswitch.txt'
    const uploading = await uploadFiles(pathlog, `logswitch`)
    const caption = `FILE UPLOADED\n\nLive URL : -\n\nFileName : ${uploading.name}\nlink : ${uploading.link}\nExpired Link : ${uploading.expires}\n\nFile hanya dapat diunduh 1x sebelum link expired`
    //await saveImage(logURL, pathlog)
    await lol.replyWithDocument({ source: pathlog }, { caption: caption });
    text = `file anda telah dikirimkan\nanda dapat mereset data/abaikan`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Reset', callback_data: 'resetlog-' + user_id},
                    { text: 'Back', callback_data: 'getlog-' + user_id }
                ]
            ]
        }
    })
}

exports.getlogcount = async(lol, user_id) => {
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    tokenbot = config.blynk_tokenb
    serverbot = config.blynk_serverb

    const pathlog = './lib/database/logcount.txt'
    const uploading = await uploadFiles(pathlog, `logcount`)
    const caption = `FILE UPLOADED\n\nLive URL : -\n\nFileName : ${uploading.name}\nlink : ${uploading.link}\nExpired Link : ${uploading.expires}\n\nFile hanya dapat diunduh 1x sebelum link expired`
    //await saveImage(logURL, pathlog)
    await lol.replyWithDocument({ source: pathlog }, { caption: caption });
    text = `file anda telah dikirimkan\nanda dapat mereset data/abaikan`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Reset', callback_data: 'resetlog-' + user_id},
                    { text: 'Back', callback_data: 'getlog-' + user_id }
                ]
            ]
        }
    })
}

exports.getlogsensor = async(lol, user_id) => {
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    tokenbot = config.blynk_tokenb
    serverbot = config.blynk_serverb

    const pathlog = './lib/database/datasensor.txt'
    const uploading = await uploadFiles(pathlog, `datasensor`)
    const caption = `FILE UPLOADED\n\nLive URL : -\n\nFileName : ${uploading.name}\nlink : ${uploading.link}\nExpired Link : ${uploading.expires}\n\nFile hanya dapat diunduh 1x sebelum link expired`
    //await saveImage(logURL, pathlog)
    await lol.replyWithDocument({ source: pathlog }, { caption: caption });
    text = `file anda telah dikirimkan\nanda dapat mereset data/abaikan`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Reset', callback_data: 'resetlog-' + user_id},
                    { text: 'Back', callback_data: 'getlog-' + user_id }
                ]
            ]
        }
    })
}

exports.resetlog = async(lol, user_id) => {
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    tokenbot = config.blynk_tokenb
    serverbot = config.blynk_serverb

    text = `Pilih data yang ingin direset\nHATI-HATI! : data akan dihapus lalu dibuat struktur yang baru`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Datalog Switch', callback_data: 'nosetlogswitch-' + user_id},
                    { text: 'Datalog Count', callback_data: 'nosetlogcount-' + user_id},
                    { text: 'Datalog Datasensor', callback_data: 'nosetlogsensor-' + user_id}
                ],
                [
                    { text: 'Back', callback_data: 'helpto-' + user_id }
                ]
            ]
        }
    })
}

exports.nosetlogswitch = async(lol, user_id) => {
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    tokenbot = config.blynk_tokenb
    serverbot = config.blynk_serverb

    text = `Anda yakin ingin mereset file log?`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Yes', callback_data: 'setlogswitch-' + user_id},
                    { text: 'No', callback_data: 'resetlog-' + user_id}
                ],
                [
                    { text: 'Main Menu', callback_data: 'helpto-' + user_id }
                ]
            ]
        }
    })
}

exports.setlogswitch = async(lol, user_id) => {
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    tokenbot = config.blynk_tokenb
    serverbot = config.blynk_serverb

    const pathlog = './lib/database/logswitch.txt'
    fs.unlinkSync(pathlog)
    fs.appendFileSync(pathlog,  line+`\nFile dibuat pada : ${moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')}\nFORMAT ISI FILE INI\n[waktu] (Status Switch) (Waktu terakhir)\n`+line+'\n');
    text = `berhasil reset logswitch.txt\nfile baru telah dibuat pada :  ${moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')}`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'resetlog-' + user_id}
                ]
            ]
        }
    })
}

exports.nosetlogcount = async(lol, user_id) => {
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    tokenbot = config.blynk_tokenb
    serverbot = config.blynk_serverb

    text = `Anda yakin ingin mereset file log?`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Yes', callback_data: 'setlogcount-' + user_id},
                    { text: 'No', callback_data: 'resetlog-' + user_id}
                ],
                [
                    { text: 'Main Menu', callback_data: 'helpto-' + user_id }
                ]
            ]
        }
    })
}

exports.setlogcount = async(lol, user_id) => {
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    tokenbot = config.blynk_tokenb
    serverbot = config.blynk_serverb

    const pathlog = './lib/database/logcount.txt'
    fs.unlinkSync(pathlog)
    fs.appendFileSync(pathlog,  line+`\nFile dibuat pada : ${moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')}\nFORMAT ISI FILE INI\n[waktu] (dibuka berapa kali) | (jarak tutup) | (kapasitas)\n`+line+'\n');
    text = `berhasil reset logcount.txt\nfile baru telah dibuat pada :  ${moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')}`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'resetlog-' + user_id}
                ]
            ]
        }
    })
}

exports.nosetlogsensor = async(lol, user_id) => {
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    tokenbot = config.blynk_tokenb
    serverbot = config.blynk_serverb

    text = `Anda yakin ingin mereset file log?`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Yes', callback_data: 'setlogsensor-' + user_id},
                    { text: 'No', callback_data: 'resetlog-' + user_id}
                ],
                [
                    { text: 'Main Menu', callback_data: 'helpto-' + user_id }
                ]
            ]
        }
    })
}

exports.setlogsensor = async(lol, user_id) => {
    prefix = config.prefix
    tokenraspi = config.blynk_tokenr
    serverraspi = config.blynk_serverr
    tokenbot = config.blynk_tokenb
    serverbot = config.blynk_serverb

    const pathlog = './lib/database/datasensor.txt'
    fs.unlinkSync(pathlog)
    fs.appendFileSync(pathlog,  line+`\nFile dibuat pada : ${moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')}\nFORMAT ISI FILE INI\n[waktu] (Semua data sensor)\n`+line+'\n');
    text = `berhasil reset datasensor.txt\nfile baru telah dibuat pada :  ${moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')}`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'resetlog-' + user_id}
                ]
            ]
        }
    })
}
    exports.play = async(lol, user_id) => { 
        text = `
Usage Play Command :

/playhere [judul lagu] -> sending music in bot
/playbin  [judul lagu] -> sending music to smartbin

Example :

/playhere payphone 
/playbin payphone
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'helpto-' + user_id }
                ]
            ]
        }
    })
}

    exports.guidespotify = async(lol, user_id) => { 
        text = `
Usage Spotify Command :

/spotifysearch [judul lagu] -> search query
/spotifyhere  [link spotify] -> sending music to bot
/spotifybin  [link spotify] -> sending music to bin

Example :

/spotifysearch melukis senja 
/spotifyhere https://open.spotify.com/track/0ZEYRVISCaqz5yamWZWzaA
/spotifybin https://open.spotify.com/track/0ZEYRVISCaqz5yamWZWzaA
`
await lol.editMessageText(text, {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Back', callback_data: 'helpto-' + user_id }
            ]
        ]
    }
})
}

exports.manualto = async(lol, user_id) => {
    prefix = config.prefix
    text = `Manual Menu :

❏ ${prefix}bin cek
❏ ${prefix}bin on
❏ ${prefix}bin off
❏ ${prefix}getlog
❏ ${prefix}playhere
❏ ${prefix}playbin
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'helpto-' + user_id }
                ]
            ]
        }
    })
}

//=======================================================================[AREA RELAY]===========================================================

exports.relaycek = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    const cekrelayy = await fetch(`https://${server}/external/api/get?token=${token}&V1&V2&V3&V4&V5&V6&V7&V8`)
                    const cekmcuu = await fetch(`https://${server}/external/api/isHardwareConnected?token=${token}`)
                    const cekrelay = await cekrelayy.json()
                    const cekmcu = await cekmcuu.json()
                    console.log(cekmcu)
                    if (cekmcu === true){
                        var nodemcustat = `Online`
                    } else if (cekmcu === false){
                        var nodemcustat = `offline`    
                    } else {
                        var nodemcustat = `Device Not Installed`
                    }
                    if (cekrelay.V1 === 1){
                        var V1stat = `Hidup`
                    } else if (cekrelay.V1 === 0){
                        var V1stat = `Mati`
                    } else {
                        var V1stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V2 === 1){
                        var V2stat = `Hidup`
                    } else if (cekrelay.V2 === 0){
                        var V2stat = `Mati`
                    } else {
                        var V2stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V3 === 1){
                        var V3stat = `Hidup`
                    } else if (cekrelay.V3 === 0){
                        var V3stat = `Mati`
                    } else {
                        var V3stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V4 === 1){
                        var V4stat = `Hidup`
                    } else if (cekrelay.V4 === 0){
                        var V4stat = `Mati`
                    } else {
                        var V4stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V5 === 1){
                        var V5stat = `Hidup`
                    } else if (cekrelay.V5 === 0){
                        var V5stat = `Mati`
                    } else {
                        var V5stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V6 === 1){
                        var V6stat = `Hidup`
                    } else if (cekrelay.V6 === 0){
                        var V6stat = `Mati`
                    } else {
                        var V6stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V7 === 1){
                        var V7stat = `Hidup`
                    } else if (cekrelay.V7 === 0){
                        var V7stat = `Mati`
                    } else {
                        var V7stat = `Pin Tidak Terdeteksi`
                    }
                    if (cekrelay.V8 === 1){
                        var V8stat = `Hidup`
                    } else if (cekrelay.V8 === 0){
                        var V8stat = `Mati`
                    } else {
                        var V8stat = `Pin Tidak Terdeteksi`
                    }
const Vall = `
NODEMCU : ${nodemcustat}

RELAY STATUS :
Relay 1 : ${V1stat}
Relay 2 : ${V2stat}
Relay 3 : ${V3stat}
Relay 4 : ${V4stat}
Relay 5 : ${V5stat}
Relay 6 : ${V6stat}
Relay 7 : ${V7stat}
Relay 8 : ${V8stat}
`
    text = `${Vall}`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relayon = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    await axios.get(`https://${server}/external/api/batch/update?token=${token}&V1=1&V2=1&V3=1&V4=1&V5=1&V6=1&V7=1&V8=1`)
    text = `Semua Relay Dinyalakan!
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relayoff-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relayoff = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    await axios.get(`https://${server}/external/api/batch/update?token=${token}&V1=0&V2=0&V3=0&V4=0&V5=0&V6=0&V7=0&V8=0`)
    text = `Semua Relay Dimatikan!
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relayon-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay1 = async(lol, user_id) => {
    prefix = config.prefix
    text = `Relay 1 Controll Button
Pin Metadata : V1(D0)    
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay1on-' + user_id },
                    { text: 'Off', callback_data: 'relay1off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay1on = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    on = config.on_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V1=${on}`)
    text = `Relay 1 Dihidupkan!
Pin Metadata = V1(D0)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relay1off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay1off = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    off = config.off_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V1=${off}`)
    text = `Relay 1 Dimatikan!
Pin Metadata = V1(D0)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay1on-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay2 = async(lol, user_id) => {
    prefix = config.prefix
    text = `Relay 2 Controll Button
Pin Metadata : V2(D1)    
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay2on-' + user_id },
                    { text: 'Off', callback_data: 'relay2off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay2on = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    on = config.on_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V2=${on}`)
    text = `Relay 2 Dihidupkan!
Pin Metadata = V2(D1)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relay2off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay2off = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    off = config.off_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V2=${off}`)
    text = `Relay 2 Dimatikan!
Pin Metadata = V2(D1)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay2on-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay3 = async(lol, user_id) => {
    prefix = config.prefix
    text = `Relay 3 Controll Button
Pin Metadata : V3(D2)    
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay3on-' + user_id },
                    { text: 'Off', callback_data: 'relay3off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay3on = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    on = config.on_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V3=${on}`)
    text = `Relay 3 Dihidupkan!
Pin Metadata = V3(D2)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relay3off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay3off = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    off = config.off_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V3=${off}`)
    text = `Relay 3 Dimatikan!
Pin Metadata = V3(D2)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay3on-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay4 = async(lol, user_id) => {
    prefix = config.prefix
    text = `Relay 1 Controll Button
Pin Metadata : V4(D3)    
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay4on-' + user_id },
                    { text: 'Off', callback_data: 'relay4off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay4on = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    on = config.on_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V4=${on}`)
    text = `Relay 4 Dihidupkan!
Pin Metadata = V4(D3)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relay4off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay4off = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    off = config.off_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V4=${off}`)
    text = `Relay 4 Dimatikan!
Pin Metadata = V4(D3)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay4on-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay5 = async(lol, user_id) => {
    prefix = config.prefix
    text = `Relay 5 Controll Button
Pin Metadata : V5(D5)    
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay5on-' + user_id },
                    { text: 'Off', callback_data: 'relay5off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay5on = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    on = config.on_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V5=${on}`)
    text = `Relay 5 Dihidupkan!
Pin Metadata = V5(D5)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relay5off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay5off = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    off = config.off_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V5=${off}`)
    text = `Relay 5 Dimatikan!
Pin Metadata = V5(D5)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay5on-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay6 = async(lol, user_id) => {
    prefix = config.prefix
    text = `Relay 5 Controll Button
Pin Metadata : V6(D6)    
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay6on-' + user_id },
                    { text: 'Off', callback_data: 'relay6off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay6on = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    on = config.on_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V6=${on}`)
    text = `Relay 6 Dihidupkan!
Pin Metadata = V6(D6)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relay6off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay6off = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    off = config.off_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V6=${off}`)
    text = `Relay 6 Dimatikan!
Pin Metadata = V6(D6)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay6on-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay7 = async(lol, user_id) => {
    prefix = config.prefix
    text = `Relay 1 Controll Button
Pin Metadata : V7(D7)    
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay7on-' + user_id },
                    { text: 'Off', callback_data: 'relay7off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay7on = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    on = config.on_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V7=${on}`)
    text = `Relay 7 Dihidupkan!
Pin Metadata = V7(D7)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relay7off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay7off = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    off = config.off_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V7=${off}`)
    text = `Relay 7 Dimatikan!
Pin Metadata = V7(D7)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay7on-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay8 = async(lol, user_id) => {
    prefix = config.prefix
    text = `Relay 8 Controll Button
Pin Metadata : V8(D8)    
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay8on-' + user_id },
                    { text: 'Off', callback_data: 'relay8off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay8on = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    on = config.on_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V8=${on}`)
    text = `Relay 8 Dihidupkan!
Pin Metadata = V8(D8)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Off', callback_data: 'relay8off-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.relay8off = async(lol, user_id) => {
    prefix = config.prefix
    token = config.blynk_token
    server = config.blynk_server
    off = config.off_value
    await axios.get(`https://${server}/external/api/update?token=${token}&V8=${off}`)
    text = `Relay 8 Dimatikan!
Pin Metadata = V8(D8)
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'On', callback_data: 'relay8on-' + user_id },
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}


exports.manualc = async(lol, user_id) => {
    prefix = config.prefix
    text = `Manual Menu :

❏ ${prefix}relay cek
❏ ${prefix}relay on
❏ ${prefix}relay off
❏ ${prefix}relay 1 on
❏ ${prefix}relay 1 off
❏ ${prefix}relay 2 on
❏ ${prefix}relay 2 off
❏ ${prefix}relay 3 on
❏ ${prefix}relay 3 off
❏ ${prefix}relay 4 on
❏ ${prefix}relay 4 off
❏ ${prefix}relay 5 on
❏ ${prefix}relay 5 off
❏ ${prefix}relay 6 on
❏ ${prefix}relay 6 off
❏ ${prefix}relay 7 on
❏ ${prefix}relay 7 off
❏ ${prefix}relay 8 on
❏ ${prefix}relay 8 off
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

//========================================================================[DEV AREA]========================================================================

exports.infoapi = async(lol, user_id) => {
    prefix = config.prefix

    const getcheckingAPI = await axios.get(`https://api.lolhuman.xyz/api/checkapikey?apikey=RuiWithTier`)
    const getinfoAPI = getcheckingAPI.data.result

    text = `
API USAGE INFORMATION :

- Username : ${getinfoAPI.username}
- Today Request : ${getinfoAPI.today}
- Total Request : ${getinfoAPI.requests}
- Account Type : ${getinfoAPI.account_type}
- Expired : ${getinfoAPI.expired}
`

await lol.editMessageText(text, {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Back', callback_data: 'helpdev-' + user_id }
            ]
        ]
    }
})
}

exports.infoserver = async(lol, user_id) => {
    prefix = config.prefix

    text = `
DATABASE SERVER ACCES INFORMATION (Blynk):

- Relay Server : ${config.blynk_server}
- Relay Token : ${config.blynk_token}
- Raspberry/ESP Server : ${config.blynk_serverr}
- Raspberry Token/ESP : ${config.blynk_tokenr}
- Bot Server (not used) : ${config.blynk_serverb}
- Bot Token (not used) : ${config.blynk_tokenb}
`

await lol.editMessageText(text, {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Change', callback_data: 'changedata-' + user_id },
                { text: 'Back', callback_data: 'helpdev-' + user_id }
            ]
        ]
    }
})
}

exports.changedata = async(lol, user_id) => {
    prefix = config.prefix

    text = `
Cara mengubah akses bot ke blynk :

-> ${prefix}change [kode] [token/server]

contoh : ${prefix}change 1 sgp1.blynk.cloud
         ${prefix}change 2 l7V8YnasSQ7pHJVJFwVChgyQH3xTAM4x

Kode yang tersedia :
1. Relay Server
2. Relay Token
3. Raspberry Server
4. Raspberry Token
5. Bot Server
6. Bot Token
`
await lol.editMessageText(text, {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Back', callback_data: 'infoserver-' + user_id }
            ]
        ]
    }
})
}

exports.messageError = async(lol) => {
    await lol.reply(`Error! Please report to the [${config.owner}](${config.ownerLink}) about this`, { parse_mode: "Markdown", disable_web_page_preview: true })
}