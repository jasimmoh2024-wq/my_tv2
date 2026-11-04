const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true);

const SUPABASE_URL = process.env.SUPABASE_URL || "https://djrljivwmwywammiuixr.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "sb_publishable_pHEayYHNNS-sPM4-sepq0A_jvpdgaUi";
const ADMIN_PASS = process.env.ADMIN_PASS || "jasim1241979@";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

// ===== قنواتك هنا - رجع روابطك هنا =====
const CHANNELS = [
 {"name":"1 - bein sport 1","logo":"https://lo1.in/bss/bsS1.png","url":"http://tyqw.site:2052/10675785266958/99039021857485/677003"},
  {"name":"2 - bein sport 2","logo":"https://lo1.in/bss/bsS2.png","url":"http://tyqw.site:2052/10675785266958/99039021857485/677004"},
  {"name":"3 - bein sport 3","logo":"https://lo1.in/bss/bs3.png","url":"http://tyqw.site:2052/10675785266958/99039021857485/677005"},
  {"name":"4 - bein sport 4","logo":"https://lo1.in/bss/bs4.png","url":"http://tyqw.site:2052/10675785266958/99039021857485/677006"},
  {"name":"5 - bein sport 5","logo":"https://lo1.in/bein/beinn5.png","url":"http://tyqw.site:2052/10675785266958/99039021857485/677007"},
  {"name":"6 - bein sport 6","logo":"https://lo1.in/bein/beinn6.png","url":"http://tyqw.site:2052/10675785266958/99039021857485/677008"},
  {"name":"7 - bein sport 7","logo":"https://lo1.in/bss/BEIN SPORTS 07.png","url":"http://tyqw.site:2052/10675785266958/99039021857485/677009"},
  {"name":"8 - bein sport 8","logo":"https://lo1.in/bss/bss8.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/677010.m3u8"},
  {"name":"9 - ALWAN SPORT 1","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649689.m3u8"},
  {"name":"10 - ALWAN SPORT 2","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649690.m3u8"},
  {"name":"11 - ALWAN SPORT 3","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649691.m3u8"},
  {"name":"12 - ALWAN SPORT 4","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649692.m3u8"},
  {"name":"13 - ALWAN SPORT 5","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649693.m3u8"},
  {"name":"14 - ALWAN SPORT 6","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649694.m3u8"},
  {"name":"15 - ALWAN SPORT 7","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649695.m3u8"},
  {"name":"16 - ALWAN SPORT 8","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649696.m3u8"},
  {"name":"17 - STARZPLAY SPORTS 1","logo":"https://lo1.in/stplay1/adp1.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/67376.m3u8"},
  {"name":"18 - STARZPLAY SPORTS 2","logo":"https://lo1.in/stplay1/sadh2.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/67378.m3u8"},
  {"name":"19 - Thamanya Sport 1","logo":"https://images.seeklogo.com/logo-png/51/1/thmanyah-logo-png_seeklogo-518881.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/646086.m3u8"},
  {"name":"20 - Thamanya Sport 2","logo":"https://images.seeklogo.com/logo-png/51/1/thmanyah-logo-png_seeklogo-518881.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/646087.m3u8"},
  {"name":"21 - Alwan Aflam 1","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649714.m3u8"},
  {"name":"22 - Alwan Aflam 2","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649715.m3u8"},
  {"name":"23 - Alwan Aflam 3","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649716.m3u8"},
  {"name":"24 - Alwan Aflam 4","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649717.m3u8"},
  {"name":"25 - ALWAN TURKEY","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649718.m3u8"},
  {"name":"26 - Alwan Documentary","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649719.m3u8"},
  {"name":"27 - ALWAN ATFAL","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649720.m3u8"},
  {"name":"28 - ALWAN MOSALSALAT","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649721.m3u8"},
  {"name":"29 - ALWAN MOSALSALAT +","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649725.m3u8"},
  {"name":"30 - ALWAN ANIME","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649726.m3u8"},
  {"name":"31 - BEIN MOVIES 1","logo":"https://lo1.in/beinn/beinm1pre0.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/427.m3u8"},
  {"name":"32 - BEIN MOVIES 2","logo":"https://lo1.in/beinn/beinm2act0.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/428.m3u8"},
  {"name":"33 - BEIN MOVIES 3","logo":"https://lo1.in/beinn/bm3.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/429.m3u8"},
  {"name":"34 - BEIN MOVIES 4","logo":"https://lo1.in/beinn/beinm4famm.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/430.m3u8"},
  {"name":"35 - BEIN SERIES 1","logo":"https://lo1.in/beinn/beinser100.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/431.m3u8"},
  {"name":"36 - BEIN SERIES 2","logo":"https://lo1.in/beinn/beinser20.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/432.m3u8"},
  {"name":"37 - BEIN DRAMA","logo":"https://lo1.in/beinn/beindra0.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/433.m3u8"},
  {"name":"38 - vivo OSCAR","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192835.m3u8"},
  {"name":"39 - vivo CLUB","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192834.m3u8"},
  {"name":"40 - vivo CINEMA 1","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192833.m3u8"},
  {"name":"41 - vivo CINEMA 2","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192832.m3u8"},
  {"name":"42 - vivo SHOWTIME","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192836.m3u8"},
  {"name":"43 - vivo PLUS","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192837.m3u8"},
  {"name":"44 - vivo SHOWTIME 2","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192836.m3u8"},
  {"name":"45 - vivo MOVIES","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192838.m3u8"},
  {"name":"46 - vivo SENTRAL","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192839.m3u8"},
  {"name":"47 - vivo WAR TIME","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192840.m3u8"},
  {"name":"48 - signal Comedy","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192634.m3u8"},
  {"name":"49 - signal ACTION","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192633.m3u8"},
  {"name":"50 - signal Cinema","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192635.m3u8"},
  {"name":"51 - signal AFLAM","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192636.m3u8"},
  {"name":"52 - signal CLASSIC","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192637.m3u8"},
  {"name":"53 - signal 90s AR","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192638.m3u8"},
  {"name":"54 - signal VOX","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192639.m3u8"},
  {"name":"55 - signal GOLD","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192640.m3u8"},
  {"name":"56 - signal ANIME AR","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192642.m3u8"},
  {"name":"57 - SHAHID ACTION 1","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192749.m3u8"},
  {"name":"58 - SHAHID ANIME 1","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192746.m3u8"},
  {"name":"59 - SHAHID ANIME 2","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192745.m3u8"},
  {"name":"60 - SHAHID Comedy","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192739.m3u8"},
  {"name":"61 - SHAHID ACTION 2","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192739.m3u8"},
  {"name":"62 - SHAHID MARVEL","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192740.m3u8"},
  {"name":"63 - SHAHID ASIAN","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192742.m3u8"},
  {"name":"64 - SHAHID BOLLYWOOD","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192743.m3u8"},
  {"name":"65 - ACTION MOVIES","logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnCnyZPaaBaB1owfAyrhVdObsfr8PwJdrzJDKTKMLXB5ps3xDqti7Q2Cqh&s=10","url":"http://jbfgrjbn.fhkadvnp.com:80/live/7901885855/7610043061/1396793.m3u8"},
  {"name":"66 - SHAHID FILMS 1","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx001/playlist.m3u8"},
  {"name":"67 - SHAHID FILMS 2","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx007/playlist.m3u8"},
  {"name":"68 - SHAHID 1","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx017/playlist.m3u8"},
  {"name":"69 - SHAHID 2","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx015/playlist.m3u8"},
  {"name":"70 - SHAHID 3","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx014/playlist.m3u8"},
  {"name":"71 - SHAHID 4","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx010/playlist.m3u8"},
  {"name":"72 - SHAHID 5","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx013/playlist.m3u8"},
  {"name":"73 - SHAHID 6","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx003/playlist.m3u8"},
  {"name":"74 - SHAHID 7","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx005/playlist.m3u8"},
  {"name":"75 - SHAHID 8","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx008/playlist.m3u8"},
  {"name":"76 - SHAHID 9","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx009/playlist.m3u8"},
  {"name":"77 - THRILLER Movies","logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnCnyZPaaBaB1owfAyrhVdObsfr8PwJdrzJDKTKMLXB5ps3xDqti7Q2Cqh&s=10","url":"https://shd-amg-fast.edgenextcdn.net/tx011/playlist.m3u8"},
  {"name":"78 - WILD","logo":"https://lo1.in/FCB/osnngp.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625061.m3u8"},
  {"name":"79 - travelXP","logo":"https://images.seeklogo.com/logo-png/63/1/travelxp-logo-png_seeklogo-632248.png","url":"http://stream.mcquack.net/451/index.m3u8"},
  {"name":"80 - trave","logo":"https://images.seeklogo.com/logo-png/32/1/travel-channel-logo-png_seeklogo-326359.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625063.m3u8"},
  {"name":"81 - Asharq Documentary 1","logo":"https://tlfaz.com/wp-content/uploads/2023/03/Asharq-Documentary.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625069.m3u8"},
  {"name":"82 - Animal Planet","logo":"https://lo1.in/ger/ANIMAL PLANET.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625075.m3u8"},
  {"name":"83 - H HISORY","logo":"https://logos-world.net/wp-content/uploads/2023/07/History-Logo.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625076.m3u8"},
  {"name":"84 - Discovery","logo":"https://logos-world.net/wp-content/uploads/2022/01/Discovery-Channel-Logo-2009.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625080.m3u8"},
  {"name":"85 - Asharq Documentary 1","logo":"https://tlfaz.com/wp-content/uploads/2023/03/Asharq-Documentary.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625067.m3u8"},
  {"name":"86 - Al Jazeera Documents","logo":"https://i1.sndcdn.com/avatars-epnszgJqJz87Hupm-SB4uiw-t1080x1080.jpg","url":"https://live-hls-apps-ajd-fa.getaj.net/AJD/index.m3u8"},
  {"name":"87 - Kids Music 1","logo":"https://www.shutterstock.com/image-photo/create-cartoon-logo-my-kid-260nw-2799354323.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193350.m3u8"},
  {"name":"88 - Kids Music 2","logo":"https://www.shutterstock.com/image-photo/create-cartoon-logo-my-kid-260nw-2799354323.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193347.m3u8"},
  {"name":"89 - Kids Music 3","logo":"https://www.shutterstock.com/image-photo/create-cartoon-logo-my-kid-260nw-2799354323.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193346.m3u8"},
  {"name":"90 - Kids Music 4","logo":"https://www.shutterstock.com/image-photo/create-cartoon-logo-my-kid-260nw-2799354323.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193348.m3u8"},
  {"name":"91 - TOM And jerry 1","logo":"https://i.pinimg.com/originals/4f/cb/c8/4fcbc802581380b68951ad455b3e7208.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193324.m3u8"},
  {"name":"92 - TOM And jerry 2","logo":"https://i.pinimg.com/originals/4f/cb/c8/4fcbc802581380b68951ad455b3e7208.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193323.m3u8"},
  {"name":"93 - TOM And jerry 3","logo":"https://i.pinimg.com/originals/4f/cb/c8/4fcbc802581380b68951ad455b3e7208.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193321.m3u8"},
  {"name":"94 - Nickelodeon 1","logo":"https://m.eyeofriyadh.com/news_images/2015/11/630659467.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/151195.m3u8"},
  {"name":"95 - Nickelodeon 2","logo":"https://m.eyeofriyadh.com/news_images/2015/11/630659467.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/151192.m3u8"},
  {"name":"96 - pink panther 1","logo":"https://elyafgroup.com/cdn/shop/products/PINK-PANTHER_1080x.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193316.m3u8"},
  {"name":"97 - pink panther 2","logo":"https://elyafgroup.com/cdn/shop/products/PINK-PANTHER_1080x.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193317.m3u8"}
];

async function getSubscriber(code) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}&select=*`, { headers });
  const data = await r.json();
  return data[0];
}

app.get('/playlist', async (req, res) => {
  const code = req.query.code;
  // MAC يجي من الرابط: ?code=ali123&mac=AA:BB:CC:DD:EE:FF
  // او ?code=ali123&device=AA:BB:CC:DD:EE:FF
  let mac = (req.query.mac || req.query.device || '').toString().trim().toUpperCase();
  if (!code) return res.status(403).send("No code");
  const sub = await getSubscriber(code);
  if (!sub) return res.status(403).send("Code not found");
  if (!sub.active) return res.status(403).send("Account disabled - الاشتراك موقوف");
  if (sub.expiry && new Date(sub.expiry) < new Date()) return res.status(403).send("Expired - انتهى اشتراكك");

  const ip = (req.headers['x-forwarded-for'] || req.ip || '').toString().split(',')[0].trim();
  const now = new Date().toISOString();

  // ===== تقييد MAC - جهاز واحد فقط =====
  if (sub.mac_address) {
    // المشترك اله MAC مربوط من قبل
    if (!mac) return res.status(403).send("يجب اضافة MAC الرسيفر للرابط - تواصل مع الموزع");
    if (mac !== sub.mac_address.toUpperCase()) {
      return res.status(403).send("هذا الاشتراك مربوط برسيفر اخر - MAC غير مطابق");
    }
    // نفس الجهاز - حدث اخر ظهور
    await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ last_seen: now, device_ip: ip }) });
  } else {
    // اول مرة - اربط اول MAC يدخل
    if (mac) {
      await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ mac_address: mac, device_id: mac, last_seen: now, device_ip: ip }) });
    } else {
      // اذا ما دز MAC، حدث اخر ظهور فقط وخلي الربط مفتوح لاول MAC
      await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ last_seen: now, device_ip: ip }) });
    }
  }

  let m3u = "#EXTM3U\n";
  CHANNELS.forEach(c => {
    m3u += `#EXTINF:-1,${c.name}\n${c.url}\n`;
  });
  res.setHeader('Content-Type', 'application/x-mpegURL');
  res.send(m3u);
});

app.get('/admin', (req, res) => {
  res.send(`
  <!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>لوحة تحكم</title>
  <style>
  *{box-sizing:border-box}
  body{font-family:'Segoe UI',Tahoma,sans-serif;background:#f1f5f9;color:#0f172a;margin:0;padding:20px}
  .wrap{max-width:1000px;margin:auto}
  .header{background:#fff;padding:18px 20px;border-radius:16px;box-shadow:0 2px 10px rgba(0,0,0,.06);display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
  .header h2{margin:0;font-size:19px}
  .header span{font-size:12px;background:#dcfce7;color:#166534;padding:5px 10px;border-radius:20px}
  .card{background:#fff;padding:16px;border-radius:16px;box-shadow:0 2px 10px rgba(0,0,0,.06);margin-bottom:14px}
  .card h3{margin:0 0 12px;font-size:15px}
  label{font-size:12px;color:#64748b;display:block;margin-bottom:4px}
  input{padding:8px 10px;margin-bottom:10px;width:100%;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc}
  input:focus{border-color:#2563eb;background:#fff}
  input[type="date"]{padding:6px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .grid-full{grid-column:1/3}
  .btn{padding:10px;border:none;border-radius:10px;font-weight:bold;cursor:pointer;font-size:14px;width:100%}
  .btn-add{background:#2563eb;color:#fff}
  .btn-export{background:#0f172a;color:#fff}
  .btn-small{width:auto;padding:6px 10px;font-size:12px;border-radius:8px;margin:2px;border:none;cursor:pointer;font-weight:bold}
  .btn-green{background:#dcfce7;color:#166534}
  .btn-red{background:#fee2e2;color:#991b1b}
  .btn-gray{background:#f1f5f9;color:#334155}
  .btn-orange{background:#fef3c7;color:#92400e}
  .btn-blue{background:#dbeafe;color:#1e40af}
  table{width:100%;background:#fff;border-collapse:collapse;border-radius:16px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.06)}
  th{background:#f8fafc;padding:10px;font-size:12px;color:#64748b}
  td{padding:10px;border-top:1px solid #f1f5f9;text-align:center;font-size:12px;vertical-align:middle}
  .badge{padding:4px 8px;border-radius:20px;font-size:11px;white-space:nowrap}
  .on{background:#dcfce7;color:#166534}.off{background:#fee2e2;color:#991b1b}
  .mac-input{width:130px !important;margin:0 !important;font-size:11px !important;direction:ltr;text-align:center}
  .date-input{width:125px !important;margin:0 !important;font-size:12px !important}
  .hint{font-size:11px;color:#64748b;margin-top:4px}
  @media(max-width:700px){.grid{grid-template-columns:1fr}.grid-full{grid-column:1}}
  </style></head>
  <body><div class="wrap">
  <div class="header"><h2>📺 لوحة تحكم المشتركين</h2><span>● حماية MAC - جهاز واحد</span></div>
  <div class="card"><h3>➕ اضافة مشترك جديد</h3>
  <label>كلمة سر الادمن</label><input id="pass" type="password" value="jasim1241979@">
  <div class="grid">
  <div><label>اسم المشترك</label><input id="name" placeholder=" "></div>
  <div><label>كود المشترك</label><input id="code" placeholder=" "></div>
  <div><label>MAC الرسيفر (اختياري - اذا تركته فارغ ينربط اول جهاز يفتح)</label><input id="mac" placeholder="مثال: AA:BB:CC:DD:EE:FF" style="direction:ltr"></div>
  <div><label>تاريخ الانتهاء</label><input id="expiry" type="date"></div>
  </div>
  <button class="btn btn-add" onclick="addSub()">+ اضافة مشترك</button>
  <div class="hint">الرابط راح يصير: your-server/playlist?code=الكود&mac=MAC-الرسيفر</div>
  </div>
  <div class="card"><h3>🔍 بحث</h3><input id="search" placeholder="ابحث بالاسم او الكود او MAC..." oninput="load()" style="margin-bottom:0"></div>
  <div class="card" style="display:flex;gap:10px"><button class="btn btn-export" onclick="load()">تحديث القائمة</button><button class="btn btn-export" style="background:#fff;color:#0f172a;border:1px solid #e2e8f0" onclick="exportCSV()">📥 تصدير اكسل CSV</button></div>
  <div id="list"></div>
  <div id="debug" class="card" style="display:none;color:#991b1b;font-size:12px;white-space:pre-wrap"></div>
  </div>
  <script>
  function showErr(t){ const d=document.getElementById('debug'); d.style.display='block'; d.textContent=t; }
  function formatLast(s){
    if(!s) return 'لم يدخل بعد';
    const d=new Date(s);
    const now=new Date();
    const diffMin=Math.floor((now-d)/60000);
    if(diffMin<1) return 'الان 🟢';
    if(diffMin<60) return 'قبل '+diffMin+' دقيقة';
    if(diffMin<1440) return 'قبل '+Math.floor(diffMin/60)+' ساعة';
    return d.toLocaleString('ar-IQ',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
  }
  async function load(){
    const pass=document.getElementById('pass').value;
    const q=document.getElementById('search').value||'';
    const r=await fetch('/api/subs?pass='+pass+'&q='+encodeURIComponent(q));
    const data=await r.json();
    if(data.error){ showErr('خطأ بالقراءة: '+JSON.stringify(data)); return; }
    if(!data.length){document.getElementById('list').innerHTML='<div class="card" style="text-align:center;color:#64748b">لا يوجد مشتركين بعد</div>';return;}
    let h='<table><tr><th>الاسم / الكود</th><th>MAC الرسيفر</th><th>تعديل الانتهاء</th><th>اخر ظهور</th><th>حالة</th><th>اجراء</th></tr>';
    data.forEach(s=>{
      h+=\`<tr>
        <td><b>\${s.name}</b><br><span style="direction:ltr;color:#64748b">\${s.code}</span><br><button class="btn-small btn-blue" onclick="copyLink('\${s.code}','\${s.mac_address||''}')">📋 نسخ الرابط</button></td>
        <td><input class="mac-input" id="mac-\${s.code}" value="\${s.mac_address||''}" placeholder="AA:BB:CC..."><br><button class="btn-small btn-blue" onclick="saveMac('\${s.code}')">حفظ MAC</button></td>
        <td><input class="date-input" type="date" id="date-\${s.code}" value="\${s.expiry||''}"><br><button class="btn-small btn-green" onclick="saveDate('\${s.code}')">💾 حفظ التاريخ</button></td>
        <td>\${formatLast(s.last_seen)}<br><span style="color:#64748b;font-size:10px">IP: \${s.device_ip||'-'}</span><br><button class="btn-small btn-gray" onclick="load()">🔄 تحديث اخر ظهور</button></td>
        <td><span class="badge \${s.active?'on':'off'}">\${s.active?'✅ فعال':'⛔ موقوف'}</span></td>
        <td><button class="btn-small btn-orange" onclick="resetDevice('\${s.code}')">🔓 فك ربط MAC</button><br><button class="btn-small btn-gray" onclick="toggle('\${s.code}',\${!s.active})">ايقاف/تشغيل</button><button class="btn-small btn-red" onclick="delSub('\${s.code}')">حذف</button></td>
      </tr>\`;
    });
    document.getElementById('list').innerHTML=h+'</table>';
  }
  function copyLink(code,mac){
    const base=location.origin+'/playlist?code='+code+(mac?('&mac='+mac):'');
    navigator.clipboard.writeText(base);
    alert('تم نسخ الرابط:\\n'+base);
  }
  async function addSub(){
    const pass=document.getElementById('pass').value;
    const body={name:document.getElementById('name').value,code:document.getElementById('code').value,mac_address:document.getElementById('mac').value.toUpperCase(),expiry:document.getElementById('expiry').value,pass};
    if(!body.name||!body.code) return alert('اكتب الاسم والكود');
    const r=await fetch('/api/subs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const j=await r.json();
    if(!r.ok || j.error || j.message){ alert('فشل الاضافة: '+JSON.stringify(j)); showErr(JSON.stringify(j,null,2)); return; }
    alert('تمت الاضافة ✅'); document.getElementById('name').value=''; document.getElementById('code').value=''; document.getElementById('mac').value=''; load();
  }
  async function saveDate(code){
    const pass=document.getElementById('pass').value;
    const expiry=document.getElementById('date-'+code).value;
    if(!expiry) return alert('اختار تاريخ');
    await fetch('/api/update-date',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,expiry,pass})});
    alert('تم تعديل التاريخ الى '+expiry+' ✅'); load();
  }
  async function saveMac(code){
    const pass=document.getElementById('pass').value;
    const mac=document.getElementById('mac-'+code).value.toUpperCase();
    await fetch('/api/update-mac',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,mac_address:mac,pass})});
    alert('تم حفظ MAC ✅'); load();
  }
  async function toggle(code,active){
    const pass=document.getElementById('pass').value;
    await fetch('/api/toggle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,active,pass})});
    load();
  }
  async function resetDevice(code){
    if(!confirm('تفك ربط MAC لهذا المشترك؟ راح يگدر يدخل من رسيفر جديد'))return;
    const pass=document.getElementById('pass').value;
    await fetch('/api/reset-device',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,pass})});
    alert('تم فك الربط ✅'); load();
  }
  async function delSub(code){
    if(!confirm('متأكد حذف؟'))return;
    const pass=document.getElementById('pass').value;
    await fetch('/api/subs?pass='+pass+'&code='+code,{method:'DELETE'});
    load();
  }
  function exportCSV(){ const pass=document.getElementById('pass').value; window.open('/api/export?pass='+pass); }
  load();
  </script></body></html>`);
});

app.get('/api/subs', async (req, res) => {
  if (req.query.pass !== ADMIN_PASS) return res.status(401).json({error:"wrong pass"});
  let url = `${SUPABASE_URL}/rest/v1/subscribers?select=*&order=created_at.desc&limit=1000`;
  if (req.query.q) url += `&or=(name.ilike.*${encodeURIComponent(req.query.q)}*,code.ilike.*${encodeURIComponent(req.query.q)}*,mac_address.ilike.*${encodeURIComponent(req.query.q)}*)`;
  const r = await fetch(url, { headers });
  const j = await r.json();
  if(!r.ok) return res.status(r.status).json(j);
  res.json(j);
});

app.post('/api/subs', async (req, res) => {
  if (req.body.pass !== ADMIN_PASS) return res.status(401).json({error:"wrong pass"});
  const r = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, { method: 'POST', headers, body: JSON.stringify({ name: req.body.name, code: req.body.code, mac_address: req.body.mac_address || null, expiry: req.body.expiry || null, active: true }) });
  const j = await r.json();
  if(!r.ok) return res.status(r.status).json(j);
  res.json(j);
});

app.post('/api/update-date', async (req, res) => {
  if (req.body.pass !== ADMIN_PASS) return res.status(401).send("no");
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ expiry: req.body.expiry }) });
  res.json({ ok: true });
});

app.post('/api/update-mac', async (req, res) => {
  if (req.body.pass !== ADMIN_PASS) return res.status(401).send("no");
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ mac_address: req.body.mac_address || null }) });
  res.json({ ok: true });
});

app.post('/api/toggle', async (req, res) => {
  if (req.body.pass !== ADMIN_PASS) return res.status(401).send("no");
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ active: req.body.active }) });
  res.json({ ok: true });
});

app.post('/api/reset-device', async (req, res) => {
  if (req.body.pass !== ADMIN_PASS) return res.status(401).send("no");
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ mac_address: null, device_id: null, device_ip: null, last_seen: null }) });
  res.json({ ok: true });
});

app.delete('/api/subs', async (req, res) => {
  if (req.query.pass !== ADMIN_PASS) return res.status(401).send("no");
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.query.code}`, { method: 'DELETE', headers });
  res.json({ ok: true });
});

app.get('/api/export', async (req, res) => {
  if (req.query.pass !== ADMIN_PASS) return res.status(401).send("no");
  const r = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?select=*&order=created_at.desc`, { headers });
  const data = await r.json();
  let csv = "name,code,mac_address,active,expiry,last_seen,device_ip\n";
  data.forEach(s => csv += `"${s.name}","${s.code}","${s.mac_address||''}",${s.active},${s.expiry},"${s.last_seen||''}","${s.device_ip||''}"\n`);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
  res.send(csv);
});

app.get('/', (req, res) => res.send("TV Server - Supabase OK"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Running " + PORT));
