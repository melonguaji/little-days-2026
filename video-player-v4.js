// Attach directly to the same-origin player; download completion is not playback readiness.
loadVideo = async function(password) {
  const doc = frame.contentWindow.document;
  const video = doc.querySelector('video');
  if (!video) return;
  const note = doc.createElement('p');
  note.setAttribute('role', 'status');
  note.style.cssText = 'padding:12px;color:#40565d;line-height:1.7;background:#fffaf0';
  video.parentNode.insertBefore(note, video.nextSibling);
  const setStatus = (text, failed) => {
    note.textContent = text;
    if (videoStatus && videoStatusText) {
      videoStatus.hidden = false;
      videoStatus.classList.toggle('is-error', !!failed);
      videoStatusText.textContent = text;
    }
  };
  setStatus('海边视频下载中…');
  try {
    const payload = await unpack('payload-video-v4.bin', password, percent => {
      setStatus(percent < 100 ? '海边视频下载中… ' + percent + '%' : '下载完成，正在准备视频…');
    });
    const url = toBlobUrl(payload.video);
    const originalParent = video.parentNode;
    const fresh = doc.createElement('video');
    fresh.controls = true;
    fresh.muted = true;
    fresh.defaultMuted = true;
    fresh.playsInline = true;
    fresh.preload = 'auto';
    fresh.setAttribute('playsinline', '');
    fresh.setAttribute('webkit-playsinline', '');
    if (video.poster) fresh.poster = video.poster;
    const controls = doc.createElement('div');
    controls.style.cssText = 'display:flex;gap:16px;align-items:center;padding:8px 12px;flex-wrap:wrap';
    const play = doc.createElement('button');
    play.type = 'button';
    play.textContent = '点击播放海边视频';
    play.style.cssText = 'padding:12px 18px;background:#678f99;color:white;border:0;border-radius:20px';
    play.onclick = () => fresh.play().catch(() => setStatus('播放被浏览器阻止，请使用下方的单独打开或保存。', true));
    const open = doc.createElement('a');
    open.href = url; open.target = '_blank'; open.rel = 'noopener'; open.textContent = '单独打开视频';
    const save = doc.createElement('a');
    save.href = url; save.download = '海边回忆.mp4'; save.textContent = '保存视频';
    controls.appendChild(play); controls.appendChild(open); controls.appendChild(save);
    note.parentNode.insertBefore(controls, note.nextSibling);
    fresh.addEventListener('canplay', () => setStatus('视频已准备好，点击播放（无声）'));
    fresh.addEventListener('playing', () => { setStatus('正在播放海边回忆（无声）'); if(videoStatus)videoStatus.hidden=true; });
    fresh.addEventListener('error', () => setStatus('浏览器无法播放此视频（错误 ' + (fresh.error ? fresh.error.code : '未知') + '），可以单独打开或保存。', true));
    originalParent.replaceChild(fresh, video);
    fresh.src = url;
    fresh.load();
  } catch (error) {
    setStatus('视频下载失败，请点击重试。', true);
    const retry = doc.createElement('button');
    retry.textContent = '重新加载视频';
    retry.onclick = () => { retry.remove(); note.remove(); loadVideo(password); };
    note.parentNode.insertBefore(retry, note.nextSibling);
  }
};
