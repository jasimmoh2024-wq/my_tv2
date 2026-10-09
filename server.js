const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const app = express();

const PORT = process.env.PORT || 3000;

// تفعيل CORS الشامل للسماح للمشغل بالوصول إلى البث بدون قيود
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// دالة برمجية مطورة وقوية لقراءة وتحليل ملف القنوات M3U بدقة
function parseM3U() {
    const filePath = path.join(__dirname, 'channels.m3u');
    if (!fs.existsSync(filePath)) return {};
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n'); 
    const channels = {};
    let currentChannel = {};
    let idCounter = 1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('#EXTINF:')) {
            // استخراج اسم القناة بعد آخر فاصلة
            const commaIndex = line.lastIndexOf(',');
            let channelName = `قناة ${idCounter}`;
            if (commaIndex !== -1) {
                channelName = line.substring(commaIndex + 1).trim();
            }

            // استخراج رابط الشعار بطريقة معزولة وآمنة لمنع التشوه
            let logoUrl = 'https://icons8.com';
            const logoMatch = line.match(/tvg-logo="([^"]+)"/);
            if (logoMatch && logoMatch[1]) {
                logoUrl = logoMatch[1];
            }

            currentChannel = { name: channelName, logo: logoUrl };
        } 
        else if (line.startsWith('http')) {
            channels[idCounter] = {
                name: currentChannel.name || `قناة ${idCounter}`,
                logo: currentChannel.logo || 'https://icons8.com',
                url: line
            };
            idCounter++;
            currentChannel = {}; // تصفير البيانات للقناة التالية
        }
    }
    return channels;
}

// مسار جلب قائمة القنوات للواجهة
app.get('/channel/info-all', (req, res) => {
    try {
        const channels = parseM3U();
        const safeChannels = {};
        Object.keys(channels).forEach(id => {
            safeChannels[id] = { name: channels[id].name, logo: channels[id].logo };
        });
        res.json(safeChannels);
    } catch (err) {
        res.status(500).json({ error: "فشل تحليل ملف القنوات" });
    }
});

// مسار معالجة سحب البث وإعادة تدفقه بخفاء تام للمشغل
app.get('/live/:id', (req, res) => {
    let channelId = req.params.id;
    if (channelId.endsWith('.ts')) channelId = channelId.replace('.ts', '');

    const channels = parseM3U();
    const channel = channels[channelId];
    if (!channel) return res.status(404).send('القناة غير موجودة');

    // دمج مخرج البث الصافي مع روابط الـ IP المباشرة
    const targetUrl = channel.url.includes('?') ? `${channel.url}&output=ts` : `${channel.url}?output=ts`;
    const parsedUrl = new URL(targetUrl);

    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 80,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 13; LivePlayer) ExoPlayerLib/2.18.1',
            'Accept': '*/*',
            'Connection': 'keep-alive'
        }
    };

    const proxyReq = http.get(options, (proxyRes) => {
        res.setHeader('Content-Type', 'video/mp2t');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*'); 

        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => { 
        console.error("اتصال مقطوع:", err.message);
        if (!res.headersSent) res.status(500).send('خطأ اتصال بالسيرفر الأصلي'); 
    });
    
    req.on('close', () => proxyReq.destroy());
});

app.get('/', (req, res) => {
    res.status(200).send('Secure IPTV Streaming Server is Active!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
