import '../css/style.css';
// import './components/gvalue-app.js';
import './ButtonPonent.js';
import './MenuPonent.js';
import './PopupPonent.js';
import './components/index.js';

const app = document.getElementById('app');
const evaluation = document.createElement('gv-evaluation');
app.appendChild(evaluation);
evaluation.fetch("../data/eval1.json");