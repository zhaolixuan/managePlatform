// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import '@/utils/flexible';
import App from './App';
import store from './store';

ReactDOM.render(
  <Provider {...store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
