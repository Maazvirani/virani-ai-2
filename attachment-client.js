(()=>{
 const SUPA_URL='https://hfczfnaaqwsmvgahiygc.supabase.co', UPLOAD=SUPA_URL+'/functions/v1/virani-files', BRAIN=SUPA_URL+'/functions/v1/virani-gemini';
 const fileInput=document.getElementById('viraniFileInput'), attach=document.getElementById('attachButton'), label=document.getElementById('viraniFileLabel'), input=document.getElementById('messageInput'), send=document.getElementById('sendButton');
 if(!fileInput||!attach||!input||!send)return;
 let selected=null;
 attach.onclick=()=>fileInput.click();
 fileInput.onchange=()=>{selected=fileInput.files?.[0]||null;if(label){label.textContent=selected?selected.name:'';label.style.display=selected?'inline-block':'none'}};
 async function upload(file,token){const fd=new FormData();fd.append('file',file,file.name);const r=await fetch(UPLOAD,{method:'POST',headers:{Authorization:'Bearer '+token},body:fd});const d=await r.json();if(!r.ok)throw new Error(d.error||'File upload failed');return d.file.id}
 async function analyze(fileId,token,message){const r=await fetch(BRAIN,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({message:message||'Analyze this attached file and describe the important content.',file_id:fileId})});const d=await r.json();if(!r.ok)throw new Error(d.error||'File analysis failed');return d.reply}
 send.addEventListener('click',async e=>{if(!selected)return;e.stopImmediatePropagation();e.preventDefault();send.disabled=true;try{const session=(await window.supabase.createClient(SUPA_URL,'').auth.getSession()).data.session;if(!session)throw new Error('Please sign in again.');const id=await upload(selected,session.access_token);const prompt=input.value.trim()||'Analyze this attached file. Tell me what it contains and the most important points.';input.value='';const reply=await analyze(id,session.access_token,prompt);alert(reply);selected=null;fileInput.value='';if(label)label.style.display='none'}catch(err){alert(err.message||'Attachment failed')}finally{send.disabled=false}},true);
})();
