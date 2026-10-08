<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بث مباشر - قنوات beIN Sports الآمنة</title>
    
    <!-- تضمين مشغل الفيديو Clappr والمكتبة المساعدة لدعم قنوات الـ TS الحية -->
    <script type="text/javascript" src="https://jsdelivr.net"></script>
    <script type="text/javascript" src="https://jsdelivr.net"></script>

    <style>
        body {
            background-color: #0c0d14;
            color: #ffffff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .container {
            max-width: 1000px;
            width: 100%;
            background: #161722;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        .header-area {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 20px;
            border-bottom: 1px solid #282a3a;
            padding-bottom: 15px;
        }
        .main-logo {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 2px solid #7a22c5;
            object-fit: cover;
        }
        .main-content {
            display: flex;
            gap: 20px;
        }
        .video-section {
            flex: 2;
            position: relative;
        }
        #player {
            width: 100%;
            border-radius: 8px;
            overflow: hidden;
            background: #000;
            border: 1px solid #282a3a;
        }
        .playlist-section {
            flex: 1;
            max-height: 430px;
            overflow-y: auto;
            background: #1f2030;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #282a3a;
        }
        .playlist-section h3 {
            margin-top: 0;
            font-size: 16px;
            text-align: center;
            border-bottom: 1px solid #383a52;
            padding-bottom: 8px;
            color: #b3b5c6;
        }
        .channel-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            background: #282a3a;
            border: none;
            color: white;
            padding: 10px;
            margin-bottom: 8px;
            border-radius: 6px;
            cursor: pointer;
            text-align: right;
            transition: all 0.2s ease;
            font-size: 14px;
        }
        .channel-btn:hover {
            background: #3e415b;
        }
        .channel-btn.active {
            background: #7a22c5;
            box-shadow: 0 0 10px rgba(122, 34, 197, 0.5);
        }
        .thumb-logo {
            width: 35px;
            height: 35px;
            border-radius: 4px;
            background: #fff;
            object-fit: contain;
        }
        @media (max-width: 768px) {
            .main-content { flex-direction: column; }
            .playlist-section { max-height: 250px; }
        }
    </style>
</head>
<body>

    <div class="container">
        <!-- منطقة عرض اسم القناة الحالي واللوجو المحدث تلقائياً -->
        <div class="header-area">
            <img id="current-logo" class="main-logo" src="https://lo1.in" alt="شعار القناة">
            <h2 id="current-title" style="margin:0;">beIN Sports 1 - بث مباشر</h2>
        </div>

        <div class="main-content">
            <!-- مساحة مشغل الفيديو السري والمحمي -->
            <div class="video-section">
                <div id="player"></div>
            </div>

            <!-- قائمة التنقل الجانبية بين الـ 8 قنوات -->
            <div class="playlist-section">
                <h3>قائمة القنوات المتاحة</h3>
                <div id="channels-list"></div>
            </div>
        </div>
    </div>

    <script>
        // ⚠️ ضَع هنا رابط سيرفر Render الخاص بك الذي حصلت عليه بدون شرطة مائلة في النهاية
        const RENDER_SERVER_URL = "https://my-secure-iptv.onrender.com"; 

        // مصفوفة تعريفية للقنوات لمساعدة كود الواجهة على بناء الأزرار واللوجو فوراً
        const localChannels = [
            { id: "1", name: "beIN Sports 1", logo: "https://lo1.in" },
            { id: "2", name: "beIN Sports 2", logo: "https://lo1.in" },
            { id: "3", name: "beIN Sports 3", logo: "https://lo1.in" },
            { id: "4", name: "beIN Sports 4", logo: "https://lo1.in" },
            { id: "5", name: "beIN Sports 5", logo: "https://lo1.in" },
            { id: "6", name: "beIN Sports 6", logo: "https://lo1.in" },
            { id: "7", name: "beIN Sports 7", logo: "https://lo1.in SPORTS 07.png" },
            { id: "8", name: "beIN Sports 8", logo: "https://lo1.in" }
        ];

        let clapprPlayer;

        // دالة لتشغيل وتحديث القناة المحددة داخل المشغل
        function playChannel(id, name, logo) {
            // تحديث العناوين والشعارات في الصفحة لقيم القناة الحالية
            document.getElementById('current-title').innerText = `${name} - بث مباشر`;
            document.getElementById('current-logo').src = logo;

            // تحديث تأثير الزر النشط في القائمة الجانبية
            document.querySelectorAll('.channel-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(`btn-${id}`).classList.add('active');

            // رابط دفق البث المحمي الموجه نحو سيرفر Render مباشرة
            const streamUrl = `${RENDER_SERVER_URL}/channel/stream/${id}`;

            // إذا كان المشغل مبنياً مسبقاً، نقوم بتدميره لتهيئة بث جديد نظيف لمنع تداخل الصوت
            if (clapprPlayer) {
                clapprPlayer.destroy();
            }

            // بناء مشغل Clappr وتغذيته بنوع ومصدر بيانات البث المباشر لـ Xtream
            clapprPlayer = new Clappr.Player({
                source: streamUrl,
                parentId: "#player",
                width: '100%',
                height: '400px',
                autoPlay: true,
                mimeType: "video/mp2t", // إخبار المشغل أن البيانات هي بث دفق MPEG-TS حي
                playbackNotSupportedMessage: "جاري تشغيل القناة أو البث غير متوفر حالياً..."
            });
        }

        // دالة ذكية لبناء قائمة الأزرار الجانبية ديناميكياً فور تحميل الصفحة
        function initPlaylist() {
            const listContainer = document.getElementById('channels-list');
            localChannels.forEach((ch, index) => {
                const btn = document.createElement('button');
                btn.className = `channel-btn ${index === 0 ? 'active' : ''}`;
                btn.id = `btn-${ch.id}`;
                btn.onclick = () => playChannel(ch.id, ch.name, ch.logo);
                
                btn.innerHTML = `
                    <img class="thumb-logo" src="${ch.logo}" alt="logo">
                    <span>${ch.name}</span>
                `;
                listContainer.appendChild(btn);
            });

            // تم تصحيح القراءة التلقائية لأول قناة هنا بنجاح:
            playChannel(localChannels[0].id, localChannels[0].name, localChannels[0].logo);
        }

        // بدء تشغيل الواجهة والقائمة بمجرد اكتمال تحميل كود المتصفح
        window.onload = initPlaylist;
    </script>
</body>
</html>
