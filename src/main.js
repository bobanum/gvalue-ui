import '../css/style.css';
import './webponents/index.js';
import './gv-components/index.js';

const app = document.getElementById('app');
const evaluation = document.createElement('gv-evaluation');
app.appendChild(evaluation);
evaluation.fetch("../data/eval1.json", "../data/eval1_comments.json");