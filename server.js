// مسار إرسال الأسماء والشعارات فقط لحماية الروابط الأصلية من السرقة
app.get('/channel/info-all', (req, res) => {
    const channels = parseM3U();
    const safeChannels = {};
    Object.keys(channels).forEach(id => {
        safeChannels[id] = { name: channels[id].name, logo: channels[id].logo };
    });
    res.json(safeChannels); 
});

// مسار معالجة سحب البث وإعادة تدفقه بخفاء تام
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
            // محاكاة نظام أندرويد ومشغل ExoPlayer لتخطي جدران حماية الـ IPTV ومنع التعليق
            'User-Agent': 'Mozilla/5.0 (Linux; Android 13; LivePlayer) ExoPlayerLib/2.18.1',
            'X-Forwarded-For': '1.1.1.1', 
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

app.get('/', (req, res) => {
    res.status(200).send('Proxy Server for 44 Channels is Running and Secured!');
});

app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});
