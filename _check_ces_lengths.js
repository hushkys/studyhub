// Check lengths of all ces- topics in data.js
'use strict';
const fs = require('fs');
const src = fs.readFileSync('data.js', 'utf8');

// Eval in a fake browser context
const fakeWindow = {};
const fn = new Function('window', src + '\nwindow.CATEGORIES = CATEGORIES;');
fn(fakeWindow);

const ces = fakeWindow.CATEGORIES.find(c => c.id === 'ces');
if (!ces) { console.log('No cestina category found'); process.exit(1); }

const rows = ces.topics.map(t => ({ id: t.id, len: (t.content || '').length, title: t.title }));
rows.sort((a, b) => a.len - b.len);
rows.forEach(r => console.log(r.len + '\t' + r.id + '\t' + r.title));
console.log('\nTotal topics:', rows.length);
