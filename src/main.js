import '../css/style.css';
import './webponents/index.js';
import './gv-components/index.js';

const app = document.getElementById('app');
const evaluation = document.createElement('gv-evaluation');
app.appendChild(evaluation);
evaluation.fetch(`${import.meta.env.BASE_URL}data/eval1.json`, `${import.meta.env.BASE_URL}data/eval1_comments.json`);