import { startApp } from '@open-cells/core';
import { routes } from '../router/routes.js';
import './app-header.js';
import './toast-container.js';

startApp({
  routes,
  mainNode: 'app-content',
});
