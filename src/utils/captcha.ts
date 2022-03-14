/**
 * 十进制数字
 */
const DECIMAL_NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * 英文字符
 */
const ENGLISH_CHARS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

/**
 * 创建验证码
 *
 * @param canvasId 画布ID
 * @param length 验证码长度
 */
function createCaptcha(canvasId = 'canvas', length = 4) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement; //获取画布
  const selectChar: (string | number)[] = [...DECIMAL_NUMBERS, ...ENGLISH_CHARS]; //所有候选组成验证码的字符

  let code = '';
  for (let i = 0; i < length; i++) {
    const charIndex = Math.floor(Math.random() * 36);
    code += selectChar[charIndex];
  }

  if (canvas) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '16px arial';

    // 创建渐变
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'rgba(195, 63, 182, 1)');
    gradient.addColorStop(0.5, 'rgba(92, 203, 149, 1)');
    gradient.addColorStop(1, 'rgba(28, 128, 228, 1)');

    // 用渐变填色
    ctx.fillStyle = gradient;
    ctx.fillText(code, 1, 20); //画布上添加验证码
  }

  return code;
}

export { createCaptcha };
