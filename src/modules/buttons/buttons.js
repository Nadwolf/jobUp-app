import './buttons.css';
import app from '../../components/app';
import sidebar from '../sidebar/sidebar';

const constructButton = (type) => {
  const typeLowerCase = type.toLowerCase();
  const button = document.createElement('button');
  button.classList.add('button');
  if (
    type === 'edit' ||
    type === 'view' ||
    type === 'save' ||
    type === 'create'
  ) {
    button.classList.add('button-accent');
  }
  button.setAttribute('type', 'button');
  button.setAttribute('data-type', typeLowerCase);
  button.textContent = typeLowerCase;
  if (typeLowerCase === 'create') {
    button.textContent = 'Create task';
  }

  button.addEventListener('click', (event) => {
    event.preventDefault();
    const card = event.target.closest('.card');
    let id = card ? parseInt(card.dataset.id, 10) : null;
    if (event.target.dataset.type === 'delete') {
      if (id === null || id === undefined) {
        id = sidebar.getDataTask().id;
        sidebar.closeSidebar();
      }
      app.deleteTask(id);
      sidebar.clearSidiber();
    }
    if (event.target.dataset.type === 'edit') {
      const data = app.getTask(id);
      sidebar.enable();
      sidebar.openSidebar();
      sidebar.restoreTask(data);
    }
    if (event.target.dataset.type === 'view') {
      const data = app.getTask(id);
      sidebar.openSidebar();
      sidebar.restoreTask(data);
      sidebar.disablid();
    }
    if (event.target.dataset.type === 'save') {
      const data = sidebar.getDataTask();
      app.editeTask(data);
      sidebar.closeSidebar();
      sidebar.clearSidiber();
    }
    if (event.target.dataset.type === 'create') {
      const data = sidebar.getDataTask();
      app.addTask(data);
      sidebar.closeSidebar();
      sidebar.clearSidiber();
    }
  });
  return button;
};

export default { constructButton };
