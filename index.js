// index.js - لوحة مشتركين + Render هو الموزع - للقنوات المفتوحة فقط
const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true);

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "";
const ADMIN_PASS = process.env.ADMIN_PASS || "change-me";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

// ===== هنا حط قنواتك المفتوحة فقط =====
const CHANNELS = [
  {"name":"1 - bein sport 1","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/4011"},
  {"name":"2 - bein sport 2","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/16"},
  {"name":"3 - bein sport 3","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953587"},
  {"name":"4 - bein sport 4","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953586"},
  {"name":"5 - bein sport 5","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953585"},
  {"name":"6 - bein sport 6","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953584"},
  {"name":"7 - bein sport 7","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953583"},
  {"name":"8 - bein sport 8","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953582"},
  {"name":"9 - ALWAN SPORT 1","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276543"},
  {"name":"10 - ALWAN SPORT 2","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276542"},
  {"name":"11 - ALWAN SPORT 3","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276541"},
  {"name":"12 - ALWAN SPORT 4","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276540"},
  {"name":"13 - ALWAN SPORT 5","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276539"},
  {"name":"14 - ALWAN SPORT 6","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276538"},
  {"name":"15 - ALWAN SPORT 7","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276537"},
  {"name":"16 - ALWAN SPORT 8","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276536"},
  {"name":"17 - STARZPLAY SPORTS 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/67376"},
  {"name":"18 - STARZPLAY SPORTS 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/67378"},
  {"name":"19 - Thamanya Sport 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/646086"},
  {"name":"20 - Thamanya Sport 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/646087"},
  {"name":"21 - Alwan Aflam 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/649714"},
  {"name":"22 - Alwan Aflam 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/649715"},
  {"name":"23 - Alwan Aflam 3","url":"http://tyqw.site:2052/10675785266958/99039021857485/649716"},
  {"name":"24 - Alwan Aflam 4","url":"http://tyqw.site:2052/10675785266958/99039021857485/649717"},
  {"name":"25 - ALWAN TURKEY","url":"http://tyqw.site:2052/10675785266958/99039021857485/649718"},
  {"name":"26 - Alwan Documentary","url":"http://tyqw.site:2052/10675785266958/99039021857485/649719"},
  {"name":"27 - ALWAN ATFAL","url":"http://tyqw.site:2052/10675785266958/99039021857485/649720"},
  {"name":"28 - ALWAN MOSALSALAT","url":"http://tyqw.site:2052/10675785266958/99039021857485/649721"},
  {"name":"29 - ALWAN MOSALSALAT +","url":"http://tyqw.site:2052/10675785266958/99039021857485/649725"},
  {"name":"30 - ALWAN ANIME","url":"http://tyqw.site:2052/10675785266958/99039021857485/649726"},
  {"name":"31 - BEIN MOVIES 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/427"},
  {"name":"32 - BEIN MOVIES 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/428"},
  {"name":"33 - BEIN MOVIES 3","url":"http://tyqw.site:2052/10675785266958/99039021857485/429"},
  {"name":"34 - BEIN MOVIES 4","url":"http://tyqw.site:2052/10675785266958/99039021857485/430"},
  {"name":"35 - BEIN SERIES 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/431"},
  {"name":"36 - BEIN SERIES 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/432"},
  {"name":"37 - BEIN DRAMA","url":"http://tyqw.site:2052/10675785266958/99039021857485/433"},
  {"name":"38 - vivo OSCAR","url":"http://tyqw.site:2052/10675785266958/99039021857485/192835"},
  {"name":"39 - vivo CLUB","url":"http://tyqw.site:2052/10675785266958/99039021857485/192834"},
  {"name":"40 - vivo CINEMA 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/192833"},
  {"name":"41 - vivo CINEMA 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/192832"},
  {"name":"42 - vivo SHOWTIME","url":"http://tyqw.site:2052/10675785266958/99039021857485/192836"},
  {"name":"43 - vivo PLUS","url":"http://tyqw.site:2052/10675785266958/99039021857485/192837"},
  {"name":"44 - vivo SHOWTIME 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/192836"},
  {"name":"45 - vivo MOVIES","url":"http://tyqw.site:2052/10675785266958/99039021857485/192838"},
  {"name":"46 - vivo SENTRAL","url":"http://tyqw.site:2052/10675785266958/99039021857485/192839"},
  {"name":"47 - vivo WAR TIME","url":"http://tyqw.site:2052/10675785266958/99039021857485/192840"},
  {"name":"48 - signal Comedy","url":"http://tyqw.site:2052/10675785266958/99039021857485/192634"},
  {"name":"49 - signal ACTION","url":"http://tyqw.site:2052/10675785266958/99039021857485/192633"},
  {"name":"50 - signal Cinema","url":"http://tyqw.site:2052/10675785266958/99039021857485/192635"},
  {"name":"51 - signal AFLAM","url":"http://tyqw.site:2052/10675785266958/99039021857485/192636"},
  {"name":"52 - signal CLASSIC","url":"http://tyqw.site:2052/10675785266958/99039021857485/192637"},
  {"name":"53 - signal 90s AR","url":"http://tyqw.site:2052/10675785266958/99039021857485/192638"},
  {"name":"54 - signal VOX","url":"http://tyqw.site:2052/10675785266958/99039021857485/192639"},
  {"name":"55 - signal GOLD","url":"http://tyqw.site:2052/10675785266958/99039021857485/192640"},
  {"name":"56 - signal ANIME AR","url":"http://tyqw.site:2052/10675785266958/99039021857485/192642"},
  {"name":"57 - SHAHID ACTION 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/192749"},
  {"name":"58 - SHAHID ANIME 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/192746"},
  {"name":"59 - SHAHID ANIME 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/192745"},
  {"name":"60 - SHAHID Comedy","url":"http://tyqw.site:2052/10675785266958/99039021857485/192739"},
  {"name":"61 - SHAHID ACTION 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/192739"},
  {"name":"62 - SHAHID MARVEL","url":"http://tyqw.site:2052/10675785266958/99039021857485/192740"},
  {"name":"63 - SHAHID ASIAN","url":"http://tyqw.site:2052/10675785266958/99039021857485/192742"},
  {"name":"64 - SHAHID BOLLYWOOD","url":"http://tyqw.site:2052/10675785266958/99039021857485/192743"},
  {"name":"65 - ACTION MOVIES","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1396793"},
  {"name":"66 - SHAHID FILMS 1","url":"https://shd-amg-fast.edgenextcdn.net/tx001/playlist.m3u8"},
  {"name":"67 - SHAHID FILMS 2","url":"https://shd-amg-fast.edgenextcdn.net/tx007/playlist.m3u8"},
  {"name":"68 - SHAHID 1","url":"https://shd-amg-fast.edgenextcdn.net/tx017/playlist.m3u8"},
  {"name":"69 - SHAHID 2","url":"https://shd-amg-fast.edgenextcdn.net/tx015/playlist.m3u8"},
  {"name":"70 - SHAHID 3","url":"https://shd-amg-fast.edgenextcdn.net/tx014/playlist.m3u8"},
  {"name":"71 - SHAHID 4","url":"https://shd-amg-fast.edgenextcdn.net/tx010/playlist.m3u8"},
  {"name":"72 - SHAHID 5","url":"https://shd-amg-fast.edgenextcdn.net/tx013/playlist.m3u8"},
  {"name":"73 - SHAHID 6","url":"https://shd-amg-fast.edgenextcdn.net/tx003/playlist.m3u8"},
  {"name":"74 - SHAHID 7","url":"https://shd-amg-fast.edgenextcdn.net/tx005/playlist.m3u8"},
  {"name":"75 - SHAHID 8","url":"https://shd-amg-fast.edgenextcdn.net/tx008/playlist.m3u8"},
  {"name":"76 - SHAHID 9","url":"https://shd-amg-fast.edgenextcdn.net/tx009/playlist.m3u8"},
  {"name":"77 - THRILLER Movies","url":"https://shd-amg-fast.edgenextcdn.net/tx011/playlist.m3u8"},
  {"name":"78 - WILD","url":"http://tyqw.site:2052/10675785266958/99039021857485/625061"},
  {"name":"79 - travelXP","url":"http://stream.mcquack.net/451/index.m3u8"},
  {"name":"80 - trave","url":"http://tyqw.site:2052/10675785266958/99039021857485/625063"},
  {"name":"81 - Asharq Documentary 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/625069"},
  {"name":"82 - Animal Planet","url":"http://tyqw.site:2052/10675785266958/99039021857485/625075"},
  {"name":"83 - H HISORY","url":"http://tyqw.site:2052/10675785266958/99039021857485/625076"},
  {"name":"84 - Discovery","url":"http://tyqw.site:2052/10675785266958/99039021857485/625080"},
  {"name":"85 - Asharq Documentary 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/625067"},
  {"name":"86 - Al Jazeera Documents","url":"https://live-hls-apps-ajd-fa.getaj.net/AJD/index.m3u8"},
  {"name":"87 - Kids Music 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/193350"},
  {"name":"88 - Kids Music 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/193347"},
  {"name":"89 - Kids Music 3","url":"http://tyqw.site:2052/10675785266958/99039021857485/193346"},
  {"name":"90 - Kids Music 4","url":"http://tyqw.site:2052/10675785266958/99039021857485/193348"},
  {"name":"91 - TOM And jerry 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/193324"},
  {"name":"92 - TOM And jerry 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/193323"},
  {"name":"93 - TOM And jerry 3","url":"http://tyqw.site:2052/10675785266958/99039021857485/193321"},
  {"name":"94 - Nickelodeon 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/151195"},
  {"name":"95 - Nickelodeon 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/151192"},
  {"name":"96 - pink panther 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/193316"},
  {"name":"97 - pink panther 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/193317"},
  {"name":"98 - test","url":"http://tyqw.site:2052/10675785266958/99039021857485/677084"}
];

const UPSTREAM_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': '*/*',
  'Connection': 'keep-alive',
};

const subCache = new Map();

function parseCookies(req){
  const c = {};
  (req.headers.cookie || '').split(';').forEach(p=>{
    const i = p.indexOf('=');
    if(i>-1) c[p.slice(0,i).trim()] = decodeURIComponent(p.slice(i+1).trim());
  });
  return c;
}
function isAdmin(req){
  const cookies = parseCookies(req);
  return cookies.admin_auth === Buffer.from(ADMIN_PASS).toString('base64');
}
function requireAdmin(req,res,next){
  if(isAdmin(req)) return next();
  return res.redirect('/login');
}

// ===== دخول الادمن =====
app.get('/login', (req, res) => {
  if(isAdmin(req)) return res.redirect('/admin');
  res.send(`<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>دخول الموزع</title><style>body{font-family:'Segoe UI',Tahoma,sans-serif;background:#0f172a;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px}.box{background:#fff;width:100%;max-width:360px;padding:28px;border-radius:18px;text-align:center}input{width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:12px;font-size:16px;margin-bottom:12px;box-sizing:border-box}button{width:100%;padding:12px;background:#2563eb;color:#fff;border:none;border-radius:12px;font-weight:bold;cursor:pointer}</style></head><body><div class="box"><h2>دخول الموزع</h2><form method="POST" action="/login"><input type="password" name="pass" placeholder="الباسورد" required autofocus><label><input type="checkbox" name="remember" checked> ابقى داخل 30 يوم</label><button>دخول</button></form>${req.query.err ? '<p style="color:red">باسورد غلط</p>' : ''}</div></body></html>`);
});
app.post('/login', (req, res) => {
  if(req.body.pass === ADMIN_PASS){
    const token = Buffer.from(ADMIN_PASS).toString('base64');
    const maxAge = req.body.remember === 'on' ? `; Max-Age=${30*24*60*60}` : '';
    res.setHeader('Set-Cookie', `admin_auth=${token}; Path=/; HttpOnly; SameSite=Lax${maxAge}`);
    return res.redirect('/admin');
  }
  res.redirect('/login?err=1');
});
app.get('/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'admin_auth=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  res.redirect('/login');
});

// ===== فحص المشترك - قفل جهاز واحد =====
async function getSubscriber(code) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}&select=*`, { headers });
  const data = await r.json();
  return data[0];
}
async function checkDevice(req, code, macParam, skipLock){
  const sub = await getSubscriber(code);
  if(!sub) return { ok:false, msg:"Code not found" };
  if(!sub.active) return { ok:false, msg:"الاشتراك موقوف من الادارة" };
  if(sub.expiry && new Date(sub.expiry) < new Date()) return { ok:false, msg:"انتهى اشتراكك - جدد الاشتراك" };
  const ip = (req.headers['x-forwarded-for'] || req.ip || '').toString().split(',')[0].trim();
  const mac = (macParam || '').toString().trim().toUpperCase();
  const now = new Date().toISOString();
  const lastSeen = sub.last_seen ? new Date(sub.last_seen).getTime() : 0;
  const diffMin = (Date.now() - lastSeen) / 60000;
  if(skipLock){
    await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ last_seen: now, device_ip: ip }) });
    return { ok:true, sub };
  }
  if(!mac){
    await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ last_seen: now, device_ip: ip }) });
    return { ok:true, sub };
  }
  const fingerprint = crypto.createHash('md5').update(mac).digest('hex');
  if(sub.device_id){
    if(sub.device_id !== fingerprint && diffMin < 5){
      return { ok:false, msg:"هذا الاشتراك شغال على جهاز اخر الان - لا يمكن تشغيل جهازين بنفس الوقت", sub };
    }
    if(sub.device_id !== fingerprint && diffMin >= 5){
      await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ device_id: fingerprint, mac_address: mac, device_ip: ip, last_seen: now }) });
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ last_seen: now, device_ip: ip }) });
    }
  } else {
    await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ device_id: fingerprint, mac_address: mac || null, device_ip: ip, last_seen: now }) });
  }
  return { ok:true, sub };
}

// ===== قائمة القنوات =====
async function sendPlaylist(req, res){
  const code = req.query.code;
  if (!code) return res.status(403).send("No code");
  const check = await checkDevice(req, code, req.query.mac || '', true);
  if(!check.ok) return res.status(403).send(check.msg);
  const base = `${req.protocol}://${req.get('host')}`;
  let m3u = "#EXTM3U\n";
  CHANNELS.forEach((c,i) => {
    m3u += `#EXTINF:-1 tvg-name="${c.name}",${c.name}\n${base}/live/${code}/${i}\n`;
  });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/x-mpegURL; charset=utf-8');
  res.send(m3u);
}
app.get('/playlist', sendPlaylist);
app.get('/playlist.m3u8', sendPlaylist);
app.get('/playlist.m3u', sendPlaylist);

// ===== Xtream للرسيفر =====
app.get('/player_api.php', async (req, res) => {
  const username = req.query.username || '';
  const password = req.query.password || '';
  const action = req.query.action || '';
  if(!username || password !== username) return res.json({ user_info:{ auth:0, status:"Banned" }, server_info:{} });
  const isList = action === 'get_live_categories' || action === 'get_live_streams';
  const check = await checkDevice(req, username, req.query.mac || '', isList);
  if(!check.ok) return res.json({ user_info:{ auth:0, status:"Banned", message: check.msg }, server_info:{} });
  const sub = check.sub;
  const host = req.get('host');
  const proto = req.protocol;
  if(action === 'get_live_categories') return res.json([{ category_id:"1", category_name:"Live", parent_id:0 }]);
  if(action === 'get_live_streams'){
    return res.json(CHANNELS.map((c,i)=>({
      num: i+1, name: c.name, stream_type:"live", stream_id: i+1,
      stream_icon:"", category_id:"1",
      direct_source: `${proto}://${host}/live/${username}/${i}.ts`,
    })));
  }
  const exp = sub.expiry ? Math.floor(new Date(sub.expiry).getTime()/1000) : Math.floor(Date.now()/1000)+365*24*3600;
  return res.json({
    user_info:{ username, password, auth:1, status:"Active", exp_date:String(exp), is_trial:"0", active_cons:"1", max_connections:"1", allowed_output_formats:["m3u8","ts"] },
    server_info:{ url: host, port:"443", https_port:"443", server_protocol:"https", timezone:"Asia/Baghdad", timestamp_now: Math.floor(Date.now()/1000) }
  });
});

// ===== Stalker Portal للرسيفر =====
async function stalkerHandler(req, res){
  const action = req.query.action || req.body.action || '';
  const mac = (req.query.mac || req.body.mac || '').toString().toUpperCase();
  if(action === 'handshake') return res.json({ js:{ token:"123456", random:"abcdef", not_valid_token:0 } });
  const login = (req.query.login || req.body.login || req.query.token || req.body.token || '').toString();
  if(action === 'get_profile') return res.json({ js:{ id:1, name: login || "User", login: login, mac: mac, status:2 } });
  if(!login) return res.json({ js:{ data:[] } });
  const check = await checkDevice(req, login, mac, true);
  if(!check.ok) return res.json({ js:{ error: check.msg } });
  if(action === 'get_all_channels' || action === 'get_ordered_list'){
    const data = CHANNELS.map((c,i)=>({
      id: String(i+1), name: c.name, number: String(i+1),
      tv_genre_id:"1", cmd: `${req.protocol}://${req.get('host')}/live/${login}/${i}.ts`,
      cmd_1: `${req.protocol}://${req.get('host')}/live/${login}/${i}.ts`,
    }));
    return res.json({ js:{ total_items: data.length, max_page_items:500, data } });
  }
  if(action === 'create_link'){
    const chId = parseInt(req.query.ch_id || req.body.ch_id || '0');
    const url = `${req.protocol}://${req.get('host')}/live/${login}/${chId}.ts`;
    return res.json({ js:{ id: String(chId+1), cmd: url, type:"live", error:"" } });
  }
  if(action === 'get_genres' || action === 'get_tv_genres') return res.json({ js:[{ id:"1", title:"Live", alias:"live" }] });
  return res.json({ js:{} });
}
app.get('/stalker_portal/server/load.php', stalkerHandler);
app.post('/stalker_portal/server/load.php', stalkerHandler);
app.get('/portal.php', stalkerHandler);
app.post('/portal.php', stalkerHandler);
app.get('/c/', stalkerHandler);

// ===== التوزيع - Render هو الموزع =====
app.get('/live/:code/:id', async (req, res) => {
  const { code, id } = req.params;
  const cached = subCache.get(code);
  if(!cached || Date.now() - cached.time > 15*60*1000){
    const check = await checkDevice(req, code, req.query.mac || '', true);
    if(!check.ok) return res.status(403).send(check.msg);
    subCache.set(code, { time: Date.now() });
  }
  const idx = parseInt(id.replace('.ts','').replace('.m3u8',''));
  const ch = CHANNELS[idx];
  if(!ch) return res.status(404).send("Channel not found");
  try {
    const upstream = await fetch(ch.url, { headers: UPSTREAM_HEADERS });
    if(!upstream.ok) return res.status(502).send("Upstream error");
    const ct = upstream.headers.get('content-type') || '';
    if(ct.includes('mpegURL') || ch.url.includes('.m3u8')){
      let text = await upstream.text();
      const baseUrl = ch.url.substring(0, ch.url.lastIndexOf('/') + 1);
      const myBase = `${req.protocol}://${req.get('host')}`;
      text = text.split('\n').map(line => {
        line = line.trim();
        if(!line || line.startsWith('#')) return line;
        if(line.startsWith('http')) return `${myBase}/proxy/${code}?u=${encodeURIComponent(line)}`;
        return `${myBase}/proxy/${code}?u=${encodeURIComponent(baseUrl + line)}`;
      }).join('\n');
      res.setHeader('Content-Type', 'application/x-mpegURL');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'no-cache');
      return res.send(text);
    }
    res.setHeader('Content-Type', ct);
    res.setHeader('Access-Control-Allow-Origin', '*');
    const reader = upstream.body.getReader();
    req.on('close', ()=>{ try{reader.cancel()}catch(e){} });
    while(true){
      const {done, value} = await reader.read();
      if(done) break;
      if(!res.writableEnded) res.write(Buffer.from(value));
    }
    res.end();
  } catch(e){
    if(!res.headersSent) res.status(502).send("Proxy error");
  }
});

app.get('/proxy/:code', async (req, res) => {
  const target = req.query.u;
  if(!target) return res.status(400).send("No url");
  const cached = subCache.get(req.params.code);
  if(!cached || Date.now() - cached.time > 15*60*1000){
    const check = await checkDevice(req, req.params.code, '', true);
    if(!check.ok) return res.status(403).send(check.msg);
    subCache.set(req.params.code, { time: Date.now() });
  }
  try{
    const upstream = await fetch(target, { headers: UPSTREAM_HEADERS });
    if(!upstream.ok) return res.status(502).send("Upstream error");
    const ct = upstream.headers.get('content-type') || 'video/MP2T';
    if(ct.includes('mpegURL')){
      let text = await upstream.text();
      const baseUrl = target.substring(0, target.lastIndexOf('/') + 1);
      const myBase = `${req.protocol}://${req.get('host')}`;
      text = text.split('\n').map(line=>{
        line=line.trim();
        if(!line || line.startsWith('#')) return line;
        if(line.startsWith('http')) return `${myBase}/proxy/${req.params.code}?u=${encodeURIComponent(line)}`;
        return `${myBase}/proxy/${req.params.code}?u=${encodeURIComponent(baseUrl + line)}`;
      }).join('\n');
      res.setHeader('Content-Type','application/x-mpegURL');
      return res.send(text);
    }
    res.setHeader('Content-Type', ct);
    res.setHeader('Access-Control-Allow-Origin','*');
    const reader = upstream.body.getReader();
    while(true){
      const {done, value} = await reader.read();
      if(done) break;
      if(!res.writableEnded) res.write(Buffer.from(value));
    }
    res.end();
  }catch(e){ if(!res.headersSent) res.status(502).send("Proxy error"); }
});

// ===== لوحة الادمن - اخضر / احمر / برتقالي + MAC =====
app.get('/admin', requireAdmin, (req, res) => {
  res.send(`
  <!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>لوحة تحكم</title>
  <style>
  *{box-sizing:border-box}
  body{font-family:'Segoe UI',Tahoma,sans-serif;background:#f1f5f9;color:#0f172a;margin:0;padding:20px}
  .wrap{max-width:1100px;margin:auto}
  .header{background:#fff;padding:18px 20px;border-radius:16px;box-shadow:0 2px 10px rgba(0,0,0,.06);display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px}
  .header h2{margin:0;font-size:19px}
  .logout{background:#fee2e2;color:#991b1b;padding:8px 14px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:13px}
  .stats{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:14px}
  .stat{background:#fff;padding:14px;border-radius:16px;text-align:center;box-shadow:0 2px 10px rgba(0,0,0,.06)}
  .stat b{font-size:22px;display:block}
  .stat span{font-size:12px;color:#64748b}
  .card{background:#fff;padding:16px;border-radius:16px;box-shadow:0 2px 10px rgba(0,0,0,.06);margin-bottom:14px}
  .card h3{margin:0 0 12px;font-size:15px}
  label{font-size:12px;color:#64748b;display:block;margin-bottom:4px}
  input{padding:9px 10px;margin-bottom:10px;width:100%;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .btn{padding:11px;border:none;border-radius:10px;font-weight:bold;cursor:pointer;font-size:14px;width:100%}
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
  .badge{padding:5px 10px;border-radius:20px;font-size:11px;white-space:nowrap;font-weight:bold;display:inline-block}
  .on{background:#dcfce7;color:#166534}
  .off{background:#fee2e2;color:#991b1b}
  .expired{background:#ffedd5;color:#9a3412}
  .online-dot{width:9px;height:9px;border-radius:50%;display:inline-block;margin-left:5px}
  .dot-green{background:#22c55e;box-shadow:0 0 0 3px #dcfce7}
  .dot-red{background:#ef4444;box-shadow:0 0 0 3px #fee2e2}
  .dot-orange{background:#f97316;box-shadow:0 0 0 3px #ffedd5}
  .mac-box{background:#f8fafc;border:1px dashed #cbd5e1;padding:6px 8px;border-radius:8px;font-size:11px;direction:ltr;word-break:break-all;text-align:left}
  @media(max-width:700px){.grid{grid-template-columns:1fr}.stats{grid-template-columns:1fr 1fr}}
  </style></head>
  <body><div class="wrap">
  <div class="header"><h2>لوحة تحكم المشتركين</h2><div><span style="font-size:12px;background:#dcfce7;color:#166534;padding:5px 10px;border-radius:20px">Render هو الموزع - جهاز واحد لكل اشتراك</span> <a class="logout" href="/logout">خروج</a></div></div>
  <div class="stats">
    <div class="stat"><b id="st-total">-</b><span>الكل</span></div>
    <div class="stat"><b id="st-active" style="color:#16a34a">-</b><span>شغال</span></div>
    <div class="stat"><b id="st-off" style="color:#dc2626">-</b><span>موقوف</span></div>
    <div class="stat"><b id="st-exp" style="color:#ea580c">-</b><span>منتهي</span></div>
  </div>
  <div class="card"><h3>اضافة مشترك جديد</h3>
  <div class="grid">
  <div><label>اسم المشترك</label><input id="name" placeholder="مثال: علي - العمارة" autocomplete="off"></div>
  <div><label>كود المشترك</label><input id="code" placeholder="مثال: ali123" autocomplete="off"></div>
  <div><label>MAC الرسيفر (اختياري)</label><input id="mac" placeholder="اتركه فارغ - راح ينحجز اول جهاز يدخل" style="direction:ltr" autocomplete="off"></div>
  <div><label>تاريخ الانتهاء</label><input id="expiry" type="date"></div>
  </div>
  <button class="btn btn-add" onclick="addSub()">+ اضافة مشترك</button>
  </div>
  <div class="card"><h3>بحث</h3><input id="search" placeholder="ابحث بالاسم او الكود او MAC او IP..." oninput="load()" style="margin-bottom:0" autocomplete="off"></div>
  <div class="card" style="display:flex;gap:10px"><button class="btn btn-export" onclick="load()">تحديث القائمة</button><button class="btn btn-export" style="background:#fff;color:#0f172a;border:1px solid #e2e8f0" onclick="window.open('/api/export')">تصدير اكسل CSV</button></div>
  <div id="list"></div>
  </div>
  <script>
  function formatLast(s){
    if(!s) return 'لم يدخل بعد';
    const d=new Date(s);
    const diffMin=Math.floor((new Date()-d)/60000);
    if(diffMin<1) return 'الان - متصل';
    if(diffMin<60) return 'قبل '+diffMin+' دقيقة';
    if(diffMin<1440) return 'قبل '+Math.floor(diffMin/60)+' ساعة';
    return d.toLocaleString('ar-IQ',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
  }
  function getStatus(s){
    const isExpired = s.expiry && new Date(s.expiry) < new Date();
    if(isExpired) return {text:'منتهي الصلاحية', cls:'expired', dot:'dot-orange'};
    if(!s.active) return {text:'موقوف', cls:'off', dot:'dot-red'};
    return {text:'شغال', cls:'on', dot:'dot-green'};
  }
  function isOnline(s){
    if(!s.last_seen) return false;
    return (Date.now() - new Date(s.last_seen).getTime()) < 5*60*1000;
  }
  async function load(){
    const q=document.getElementById('search').value||'';
    const r=await fetch('/api/subs?q='+encodeURIComponent(q));
    if(r.status===401){ location.href='/login'; return; }
    const data=await r.json();
    let total=data.length, active=0, off=0, exp=0;
    data.forEach(s=>{
      const st=getStatus(s);
      if(st.text==='شغال') active++;
      else if(st.text==='موقوف') off++;
      else exp++;
    });
    document.getElementById('st-total').textContent=total;
    document.getElementById('st-active').textContent=active;
    document.getElementById('st-off').textContent=off;
    document.getElementById('st-exp').textContent=exp;
    if(!data.length){document.getElementById('list').innerHTML='<div class="card" style="text-align:center;color:#64748b">لا يوجد مشتركين بعد</div>';return;}
    let h='<table><tr><th>المشترك</th><th>الحالة</th><th>جهاز المشترك - MAC / IP / بصمة</th><th>الانتهاء / اخر ظهور</th><th>تحكم</th></tr>';
    data.forEach(s=>{
      const st=getStatus(s);
      const online=isOnline(s);
      h+=\`<tr>
        <td><b>\${s.name}</b><br><span style="direction:ltr;color:#64748b">\${s.code}</span><br><span style="font-size:11px">\${online ? '<span class="online-dot dot-green"></span> متصل الان' : '<span class="online-dot dot-red"></span> غير متصل'}</span><br><button class="btn-small btn-blue" onclick="copyLink('\${s.code}')">نسخ VLC</button><br><button class="btn-small btn-orange" onclick="copyXtream('\${s.code}')">نسخ Xtream</button></td>
        <td><span class="badge \${st.cls}"><span class="online-dot \${st.dot}"></span> \${st.text}</span><br><span style="font-size:11px;color:#64748b">\${s.expiry ? 'ينتهي: '+s.expiry : 'بدون انتهاء'}</span></td>
        <td style="text-align:right"><div class="mac-box">MAC: \${s.mac_address||'لم يرتبط بعد - اول جهاز يدخل راح ينحجز'}<br>IP: \${s.device_ip||'-'}<br>بصمة: \${s.device_id ? s.device_id.slice(0,12)+'...' : '-'}</div><button class="btn-small btn-blue" onclick="saveMac('\${s.code}')">تثبيت MAC يدوي</button></td>
        <td><input type="date" id="date-\${s.code}" value="\${s.expiry||''}" style="width:130px"><br><button class="btn-small btn-green" onclick="saveDate('\${s.code}')">حفظ التاريخ</button><br><span style="font-size:11px">\${formatLast(s.last_seen)}</span></td>
        <td><button class="btn-small btn-orange" onclick="resetDevice('\${s.code}')">فك ربط الجهاز</button><br><button class="btn-small \${s.active?'btn-red':'btn-green'}" onclick="toggle('\${s.code}',\${!s.active})">\${s.active?'ايقاف':'تشغيل'}</button><br><button class="btn-small btn-red" onclick="delSub('\${s.code}')">حذف</button></td>
      </tr>\`;
    });
    document.getElementById('list').innerHTML=h+'</table>';
  }
  function copyLink(code){const base=location.origin+'/playlist?code='+code;navigator.clipboard.writeText(base);alert('تم نسخ رابط VLC:\\n'+base);}
  function copyXtream(code){const txt='Server: '+location.origin+'\\nUsername: '+code+'\\nPassword: '+code;navigator.clipboard.writeText(txt);alert('تم نسخ بيانات الرسيفر:\\n\\n'+txt);}
  async function addSub(){const body={name:document.getElementById('name').value,code:document.getElementById('code').value,mac_address:document.getElementById('mac').value.toUpperCase(),expiry:document.getElementById('expiry').value};if(!body.name||!body.code) return alert('اكتب الاسم والكود');const r=await fetch('/api/subs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const j=await r.json();if(!r.ok||j.error) return alert('فشل: '+JSON.stringify(j));alert('تمت الاضافة');document.getElementById('name').value='';document.getElementById('code').value='';document.getElementById('mac').value='';load();}
  async function saveDate(code){const expiry=document.getElementById('date-'+code).value;if(!expiry) return alert('اختار تاريخ');await fetch('/api/update-date',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,expiry})});alert('تم تعديل التاريخ');load();}
  async function saveMac(code){const mac=prompt('اكتب MAC الجديد - اذا تريد تفك الربط اكتب DELETE');if(mac===null) return;if(mac.toUpperCase()==='DELETE'){await fetch('/api/reset-device',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})});alert('تم فك الربط');}else{await fetch('/api/update-mac',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,mac_address:mac.toUpperCase()})});alert('تم تثبيت MAC');}load();}
  async function toggle(code,active){await fetch('/api/toggle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,active})});load();}
  async function resetDevice(code){if(!confirm('تفك ربط الجهاز؟ راح يسمح لجهاز جديد واحد فقط يدخل'))return;await fetch('/api/reset-device',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})});alert('تم فك الربط');load();}
  async function delSub(code){if(!confirm('متأكد حذف؟'))return;await fetch('/api/subs?code='+code,{method:'DELETE'});load();}
  load();
  setInterval(load, 30000);
  </script></body></html>`);
});

// ===== API لوحة الادمن =====
app.get('/api/subs', requireAdmin, async (req, res) => {
  let url = `${SUPABASE_URL}/rest/v1/subscribers?select=*&order=created_at.desc&limit=1000`;
  if (req.query.q) url += `&or=(name.ilike.*${encodeURIComponent(req.query.q)}*,code.ilike.*${encodeURIComponent(req.query.q)}*,mac_address.ilike.*${encodeURIComponent(req.query.q)}*,device_ip.ilike.*${encodeURIComponent(req.query.q)}*)`;
  const r = await fetch(url, { headers });
  res.json(await r.json());
});
app.post('/api/subs', requireAdmin, async (req, res) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, { method: 'POST', headers, body: JSON.stringify({ name: req.body.name, code: req.body.code, mac_address: req.body.mac_address || null, expiry: req.body.expiry || null, active: true }) });
  const j = await r.json();
  if(!r.ok) return res.status(r.status).json(j);
  res.json(j);
});
app.post('/api/update-date', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ expiry: req.body.expiry }) });
  res.json({ ok: true });
});
app.post('/api/update-mac', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ mac_address: req.body.mac_address || null }) });
  res.json({ ok: true });
});
app.post('/api/toggle', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ active: req.body.active }) });
  res.json({ ok: true });
});
app.post('/api/reset-device', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ mac_address: null, device_id: null, device_ip: null, last_seen: null }) });
  res.json({ ok: true });
});
app.delete('/api/subs', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.query.code}`, { method: 'DELETE', headers });
  res.json({ ok: true });
});
app.get('/api/export', requireAdmin, async (req, res) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?select=*&order=created_at.desc`, { headers });
  const data = await r.json();
  let csv = "name,code,mac_address,active,expiry,last_seen,device_ip\\n";
  data.forEach(s => csv += `"${s.name}","${s.code}","${s.mac_address||''}",${s.active},${s.expiry},"${s.last_seen||''}","${s.device_ip||''}"\\n`);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
  res.send(csv);
});

app.get('/', (req, res) => res.send("Open TV - Render Proxy Online"));
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Running " + PORT));
