import './style.css';
import { AppManager } from './app-logic';
import { DOMController } from './dom-controller';

console.log('Todo app loaded');

AppManager.init();
DOMController.init();
