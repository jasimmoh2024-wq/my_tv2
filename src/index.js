export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // انشاء الجداول اول مرة
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS subs (code TEXT PRIMARY KEY, name TEXT, mac TEXT, expiry TEXT, active INTEGER DEFAULT 1, last_seen TEXT, device_ip TEXT)`).run();
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS channels (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, url TEXT, group_name TEXT DEFAULT 'Live')`).run();

    const cookie = request.headers.get('Cookie') || '';
    const isAdmin = cookie.includes('admin_auth=ok');

    // ===== صفحة الدخول =====
    if (path === '/login') {
      if (request.method === 'POST') {
        const form = await request.formData();
        const pass = form.get('pass');
        if (pass === env.ADMIN_PASS) {
          return new Response('OK', { status: 302, headers: { 'Location': '/admin', 'Set-Cookie': 'admin_auth=ok; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000' } });
        }
        return Response.redirect(url.origin + '/login?err=1', 302);
      }
      return new Response(`<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>دخول</title><style>body{background:#070b14;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}.box{background:#0f172a;padding:30px;border-radius:20px;width:100%;max-width:360px;text-align:center}input{width:100%;padding:12px;margin-bottom:10px;border-radius:10px;border:1px solid #334155;background:#020617;color:#fff;box-sizing:border-box}button{width:100%;padding:12px;background:#2563eb;color:#fff;border:0;border-radius:10px;font-weight:800}</style></head><body><div class="box"><h2>🎬 لوحة التحكم</h2><form method="POST"><input type="password" name="pass" placeholder="الباسورد" required><button>دخول</button></form>${url.searchParams.get('err') ? '<p style="color:#f87171">باسورد غلط</p>' : ''}</div></body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    if (path === '/logout') return new Response('OK', { status: 302, headers: { 'Location': '/login', 'Set-Cookie': 'admin_auth=; Path=/; Max-Age=0' } });

    // ===== لوحة الادمن =====
    if (path === '/admin') {
      if (!isAdmin) return Response.redirect(url.origin + '/login', 302);
      return new Response(`<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>لوحة التحكم</title><style>body{background:#070b14;color:#fff;font-family:sans-serif;margin:0;padding:20px}.card{background:#0f172a;padding:18px;border-radius:16px;margin-bottom:14px}input{padding:10px;margin:4px;width:100%;box-sizing:border-box;border-radius:10px;border:1px solid #334155;background:#020617;color:#fff}button{padding:10px 14px;border:0;border-radius:10px;background:#2563eb;color:#fff;font-weight:700;cursor:pointer}table{width:100%;border-collapse:collapse}td,th{padding:10px;border-top:1px solid #1e293b;text-align:center;font-size:13px}.tabs button{margin:4px}</style></head><body>
      <h2>📺 لوحة التحكم - my_tv2</h2>
      <div class="tabs"><button onclick="show('subs')">👥 المشتركين</button><button onclick="show('ch')">📺 القنوات</button><a href="/logout"><button style="background:#334155">خروج</button></a></div>
      <div id="subsBox" class="card"><h3>➕ اضافة مشترك</h3><input id="s_name" placeholder="الاسم"><input id="s_code" placeholder="الكود"><input id="s_mac" placeholder="MAC اختياري"><input id="s_expiry" type="date"><button onclick="addSub()">اضافة</button><div id="subsList"></div></div>
      <div id="chBox" class="card" style="display:none"><h3>➕ اضافة قناة</h3><input id="c_name" placeholder="اسم القناة"><input id="c_url" placeholder="رابط القناة المرخص"><input id="c_group" placeholder="المجموعة - Live"><button onclick="addCh()">اضافة قناة</button><div id="chList"></div></div>
      <script>
      function show(t){document.getElementById('subsBox').style.display=t==='subs'?'block':'none';document.getElementById('chBox').style.display=t==='ch'?'block':'none';load();}
      async function load(){let r=await fetch('/api/subs');let s=await r.json();document.getElementById('subsList').innerHTML='<table><tr><th>الاسم</th><th>الكود</th><th>MAC</th><th>الانتهاء</th><th>حالة</th><th>اجراء</th></tr>'+s.map(x=>'<tr><td>'+x.name+'</td><td>'+x.code+'</td><td>'+(x.mac||'-')+'</td><td>'+(x.expiry||'-')+'</td><td>'+(x.active?'✅ فعال':'🔴 موقوف')+'</td><td><button onclick="toggleSub(\\''+x.code+'\\','+(x.active?0:1)+')">ايقاف/تشغيل</button> <button onclick="delSub(\\''+x.code+'\\')" style="background:#7f1d1d">حذف</button></td></tr>').join('')+'</table>';
      let r2=await fetch('/api/channels');let c=await r2.json();document.getElementById('chList').innerHTML='<table><tr><th>القناة</th><th>المجموعة</th><th>اجراء</th></tr>'+c.map(x=>'<tr><td>'+x.name+'</td><td>'+x.group_name+'</td><td><button onclick="delCh('+x.id+')" style="background:#7f1d1d">حذف</button></td></tr>').join('')+'</table>';}
      async function addSub(){await fetch('/api/subs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:document.getElementById('s_name').value,code:document.getElementById('s_code').value,mac:document.getElementById('s_mac').value,expiry:document.getElementById('s_expiry').value})});load();}
      async function toggleSub(code,active){await fetch('/api/toggle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,active})});load();}
      async function delSub(code){if(!confirm('حذف؟'))return;await fetch('/api/subs?code='+code,{method:'DELETE'});load();}
      async function addCh(){await fetch('/api/channels',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:document.getElementById('c_name').value,url:document.getElementById('c_url').value,group_name:document.getElementById('c_group').value||'Live'})});load();}
      async function delCh(id){if(!confirm('حذف؟'))return;await fetch('/api/channels?id='+id,{method:'DELETE'});load();}
      load();
      </script></body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    // ===== API =====
    if (path === '/api/subs' && request.method === 'GET') {
      if (!isAdmin) return new Response('Unauthorized', { status: 401 });
      const { results } = await env.DB.prepare(`SELECT * FROM subs ORDER BY rowid DESC`).all();
      return Response.json(results || []);
    }
    if (path === '/api/subs' && request.method === 'POST') {
      if (!isAdmin) return new Response('Unauthorized', { status: 401 });
      const b = await request.json();
      await env.DB.prepare(`INSERT OR REPLACE INTO subs (code,name,mac,expiry,active) VALUES (?,?,?,?,1)`).bind(b.code, b.name, b.mac || '', b.expiry || '').run();
      return Response.json({ ok: true });
    }
    if (path === '/api/subs' && request.method === 'DELETE') {
      if (!isAdmin) return new Response('Unauthorized', { status: 401 });
      await env.DB.prepare(`DELETE FROM subs WHERE code=?`).bind(url.searchParams.get('code')).run();
      return Response.json({ ok: true });
    }
    if (path === '/api/toggle' && request.method === 'POST') {
      if (!isAdmin) return new Response('Unauthorized', { status: 401 });
      const b = await request.json();
      await env.DB.prepare(`UPDATE subs SET active=? WHERE code=?`).bind(b.active, b.code).run();
      return Response.json({ ok: true });
    }
    if (path === '/api/channels' && request.method === 'GET') {
      if (!isAdmin) return new Response('Unauthorized', { status: 401 });
      const { results } = await env.DB.prepare(`SELECT * FROM channels ORDER BY id ASC`).all();
      return Response.json(results || []);
    }
    if (path === '/api/channels' && request.method === 'POST') {
      if (!isAdmin) return new Response('Unauthorized', { status: 401 });
      const b = await request.json();
      await env.DB.prepare(`INSERT INTO channels (name,url,group_name) VALUES (?,?,?)`).bind(b.name, b.url, b.group_name || 'Live').run();
      return Response.json({ ok: true });
    }
    if (path === '/api/channels' && request.method === 'DELETE') {
      if (!isAdmin) return new Response('Unauthorized', { status: 401 });
      await env.DB.prepare(`DELETE FROM channels WHERE id=?`).bind(url.searchParams.get('id')).run();
      return Response.json({ ok: true });
    }

    return new Response('TV Server - Online', { headers: { 'Content-Type': 'text/plain' } });
  }
};
