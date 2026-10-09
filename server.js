// استبدل دالة parseM3U القديمة بهذه الدالة الدقيقة:
function parseM3U() {
    const filePath = path.join(__dirname, 'channels.m3u');
    if (!fs.existsSync(filePath)) return {};
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(\(/\r\)?\n/);
    const channels = {};
    let currentChannel = {};
    let idCounter = 1;

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('#EXTINF:')) {
            const logoMatch = line.match(/tvg-logo="([^"]+)"/);
            const nameParts = line.split(',');
            const channelName = nameParts.length > 1 ? nameParts[nameParts.length - 1].trim() : `قناة ${idCounter}`;
            currentChannel = {
                name: channelName,
                logo: logoMatch ? logoMatch[1] : 'https://icons8.com'
            };
        } else if (line.startsWith('http')) {
            channels[idCounter] = {
                name: currentChannel.name || `قناة ${idCounter}`,
                logo: currentChannel.logo || 'https://icons8.com',
                url: line
            };
            idCounter++;
            currentChannel = {}; // تصفير المتغير للقناة التالية
        }
    });
    return channels;
}

// استبدل مسار تشغيل البث المباشر /live/:id بهذا الكود لتجاوز حظر المتصفحات:
app.get('/live/:id', (req, res) => {
    let channelId = req.params.id;
    if (channelId.endsWith('.ts')) channelId = channelId.replace('.ts', '');

    const channels = parseM3U();
    const channel = channels[channelId];
    if (!channel) return res.status(404).send('القناة غير موجودة');

    // إضافة صيغة دفق البث المباشر للسيرفر الأصلي
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

    // إرسال هيدرات الأمان للمتصفح قبل ضخ الفريمات لمنع الـ Mixed Content Block
    const proxyReq = http.get(options, (proxyRes) => {
        res.setHeader('Content-Type', 'video/mp2t');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*'); // تأكيد الـ CORS للبث نفسه

        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => { 
        console.error("اتصال مقطوع:", err.message);
        if (!res.headersSent) res.status(500).send('خطأ اتصال بالسيرفر الأصلي'); 
    });
    req.on('close', () => proxyReq.destroy());
});
