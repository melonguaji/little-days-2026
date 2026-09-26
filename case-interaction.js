const startButton = document.querySelector('#start-investigation');
const investigation = document.querySelector('#investigation');
const dialValue = document.querySelector('#dial-value');
const decodedText = document.querySelector('#decoded-text');
const cipherText = document.querySelector('#cipher-text');
const hintButton = document.querySelector('#hint-button');
const hintText = document.querySelector('#hint-text');
const caseForm = document.querySelector('#unlock-form');
const caseStatusEl = document.querySelector('#status');
const caseLock = document.querySelector('#lock');
const successNote = document.querySelector('#success-note');
let shift = 0;

const decoded = 'To travel by train is to see nature and human beings, towns and churches and rivers — in fact, to see life.';
const dialMessages = {
  0: '点击密码盘，开始让纸条上的字母转动。',
  1: '第一站： “To travel by train…”',
  2: '第二站： “To travel by train is to see nature and human beings…”',
  3: `“${decoded}”`,
};

function renderDial() {
  dialValue.textContent = shift > 0 ? `+${shift}` : String(shift);
  dialValue.classList.toggle('is-correct', shift === 3);
  decodedText.classList.remove('is-solved', 'is-overturned');
  if (shift === 3) {
    cipherText.classList.add('is-solved');
    decodedText.textContent = dialMessages[shift];
    decodedText.classList.add('is-solved');
  } else {
    cipherText.classList.remove('is-solved');
    decodedText.textContent = dialMessages[shift] || '拨过头了，回到 +3 试试。';
    if (shift > 3) decodedText.classList.add('is-overturned');
  }
}

startButton?.addEventListener('click', () => {
  investigation.hidden = false;
  investigation.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.querySelector('#dial-plus')?.addEventListener('click', () => {
  shift = Math.min(25, shift + 1);
  renderDial();
});

document.querySelector('#dial-minus')?.addEventListener('click', () => {
  shift = Math.max(0, shift - 1);
  renderDial();
});

hintButton?.addEventListener('click', () => {
  if (hintButton.dataset.level !== '1') {
    hintButton.dataset.level = '1';
    hintText.hidden = false;
    hintText.textContent = '提示 01：这是一句关于火车、自然和生活的话。';
    hintButton.innerHTML = '再给我一个提示 <span>＋</span>';
  } else {
    hintText.textContent = '提示 02：说这句话的人，是你最熟悉的那位推理作家。';
    hintButton.innerHTML = '提示已全部展开 <span>✓</span>';
    hintButton.disabled = true;
  }
});

caseForm?.addEventListener('submit', () => {
  const timer = setInterval(() => {
    if (caseLock?.hidden) {
      clearInterval(timer);
      successNote?.classList.add('is-visible');
      setTimeout(() => successNote?.classList.remove('is-visible'), 3600);
    }
    if (caseStatusEl?.textContent.includes('车票')) caseStatusEl.textContent = '答案好像不对，再想一想这句话是谁说的。';
  }, 120);
  setTimeout(() => clearInterval(timer), 10000);
});

renderDial();
