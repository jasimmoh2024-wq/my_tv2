const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const app = express();

const PORT = process.env.PORT || 3000;

// تفعيل CORS الشامل لحل قيود المتصفحات
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// دالة تفكيك ملف M3U وإصلاح خطأ الشعارات الحركية
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
            const commaIndex = line.lastIndexOf(',');
            let channelName = `قناة ${idCounter}`;
            if (commaIndex !== -1) {
                channelName = line.substring(commaIndex + 1).trim();
            }

            let logoUrl = 'https://icons8.com';
            const logoMatch = line.match(/tvg-logo="([^"]+)"/);
            // 🚀 تم الإصلاح: سحب الرابط النصي الصافي فقط وتجاوز كتل الـ Object
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
            currentChannel = {}; 
        }
    }
    return channels;
}

// مسار جلب القنوات
app.get('/channel/info-all', (req, res) => {
    try {
        const channels = parseM3U();
        const safeChannels = {};
        Object.keys(channels).forEach(id => {
            safeChannels[id] = { name: channels[id].name, logo: channels[id].logo };
        });
        res.json(safeChannels);
    } catch (err) {
        res.status(500).json({ error: "خطأ تحليل الملف" });
    }
});

// مسار تدفق البث وحل معضلة الانقطاع
app.get('/live/:id', (req, res) => {
    let channelId = req.params.id;
    if (channelId.endsWith('.ts')) channelId = channelId.replace('.ts', '');

    const channels = parseM3U();
    const channel = channels[channelId];
    if (!channel) return res.status(404).send('غير موجود');

    const targetUrl = `${channel.url}?output=ts`;
    const parsedUrl = new URL(targetUrl);

    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 80,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
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

    proxyReq.on('error', () => { if (!res.headersSent) res.status(500).send('خطأ'); });
    req.on('close', () => proxyReq.destroy());
});

app.listen(PORT, () => console.log(`Active on ${PORT}`));
