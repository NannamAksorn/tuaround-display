// html
if (process.env.NODE_ENV === "development") {
  require('../dist/index.html')
}
// css
import './css/styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './js/map';
import './js/clock';
import './js/weather'