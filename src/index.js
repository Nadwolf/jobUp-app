import './styles/style.css';
import app from './components/app';
import header from './modules/header/header';
import tasks from './modules/tasks/tasks';
import newTask from './modules/new-task/new-task';
import sidebar from './modules/sidebar/sidebar';
import cardTask from './modules/sidebar/task-card/task-card';
import map from './modules/map/map';

// стартовые функции
const init = () => {
  tasks.renderDashboard(app.tasks);
  sidebar.init();
  map.renderMarkersDashboard();
};

init();

// рендер тасок в зависимости от выбранного пункта меню
header.dashboardLink.addEventListener('click', () => {
  tasks.renderDashboard(app.tasks);
  map.renderMarkersDashboard();
});
header.archiveLink.addEventListener('click', () => {
  tasks.renderArchive(app.tasks);
  map.renderMarkersArchive();
});

// отслеживаем изменения тасок приложения, запускаем реднеррендер дашборда, переключение пункта меню, рендер меток
app.observer.subscribe(tasks.renderDashboard);
app.observer.subscribe(header.switchToDashboard);
app.observer.subscribe(map.renderMarkersDashboard);

// добавляем события на кнопку нового задания
newTask.addEventListener('click', () => {
  sidebar.openSidebar();
  sidebar.clearSidiber();
});

// закрываем сайдбар при клике по карте
const mapSection = document.getElementById('map-section');

mapSection.addEventListener('click', () => {
  sidebar.clearSidiber();
  sidebar.closeSidebar();
});
