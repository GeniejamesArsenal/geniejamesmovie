
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', function (event) { if (event.ctrlKey && (event.key === 'u' || event.key === 's' || event.key === 'a' || event.key === 'c' || event.key === 'x')) { event.preventDefault(); } if (event.key === 'F12' || event.key === 'I' && event.shiftKey && event.ctrlKey) { event.preventDefault(); } });