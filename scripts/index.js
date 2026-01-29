const clickme = document.querySelector('#clickme');
const out = document.querySelector('#out');
let display = null;
out.classList.add('op-trans');
clickme.addEventListener('mousedown', () => {
    const vis = out.style.opacity == '1';
    out.style.opacity = !vis ? '1' : '0';
});
