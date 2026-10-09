const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// 📡 🎯 رابط الـ Raw الصافي لملف قنوات باقتك المحدثة داخل مستودع غيت هاب مالتك عينه
const GITHUB_M3U_URL = "https://githubusercontent.com";

// 🛡️ تفعيل ميزة التخطي والعبور الآمن لكافة المتصفحات والتطبيقات (CORS Free Engine)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// 🧭 المسار الأول: جلب وتفكيك ملف الـ M3U وتحويل القنوات لـ مصفوفة JSON صافية ومحمية
app.get('/channels', async (req, res) => {
    try {
        const response = await axios.get(GITHUB_M3U_URL);
        const m3uText = response.data;
        const lines = m3uText.split('\n');
        
        let channelsList = [];
        let currentName = "";
        let idCounter = 1;

        const hostUrl = `${req.protocol}://${req.get('host')}`;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith("#EXTINF:")) {
                const parts = line.split(',');
                currentName = parts.length > 1 ? parts[parts.length - 1].trim() : "Premium Channel " + idCounter;
            } else if (line.startsWith("http")) {
                channelsList.push({
                    id: idCounter.toString(),
                    name: currentName || ("Channel " + idCounter),
                    // توليد رابط وسيط آمن يوجه طلبات المشاهدين إلى سيرفر ريندر بدلاً من سيرفرك الأصلي
                    proxy_url: `${hostUrl}/stream/${idCounter}?stream_url=${encodeURIComponent(line)}`
                });
                currentName = "";
                idCounter++;
            }
        }
        res.json(channelsList);
    } catch (error) {
        res.status(500).json({ error: "فشل السيرفر في جلب البيانات السحابية الحين" });
    }
});

// 🎬 المسار الثاني: الدرع الحديدي (Reverse Proxy) لـحقن البصمة الأمنية (سر مشغلات Xtream)
app.get('/stream/:id', async (req, res) => {
    const targetStreamUrl = req.query.stream_url;
    if (!targetStreamUrl) {
        return res.status(400).send("رابط البث الحي مفقود");
    }

    try {
        // الحركة السرية: إرسال الطلب للسيرفر الرئيسي ببصمة مخصصة تمنع حظر الحساب كلياً بسبب التعدد
        const streamResponse = await axios({
            method: 'get',
            url: targetStreamUrl,
            responseType: 'stream',
            headers: {
                "Referer": "http://tyqw.site",
                "User-Agent": "LC_CORE_PLAYER/2.1 (Linux; Android 13; Mobile) ExoPlayerLib/2.18.5"
            }
        });

        // إيقاظ ولصق ترميز دفق الـ TS الرقمي الصافي المباشر (video/mp2t) رغماً عن غياب الامتداد بالرابط
        res.setHeader('Content-Type', streamResponse.headers['content-type'] || 'video/mp2t');
        streamResponse.data.pipe(res);

    } catch (error) {
        res.status(500).send("تعذر إنعاش دفق القناة من السيرفر الرئيسي الحين");
    }
});

app.listen(PORT, () => {
    console.log(`الدرع الحديدي يعمل بنجاح على البورت: ${PORT}`);
});
