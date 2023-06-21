import './header.css';

const links = document.querySelectorAll('#menu .menu-link');

// событие переключения пунктов меню по клику
links.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const { target } = event;
    if (!target.classList.contains('menu-link-active')) {
      links.forEach((item) => item.classList.remove('menu-link-active'));
      target.classList.add('menu-link-active');
    }
  });
});

const [dashboardLink, archiveLink] = links;

// переключение на выбранный пункт меню
const toogleLink = (type) => {
  links.forEach((link) => {
    if (
      !link.classList.contains('menu-link-active') &&
      link.textContent === type
    ) {
      links.forEach((item) => item.classList.remove('menu-link-active'));
      link.classList.add('menu-link-active');
    }
  });
};

// переключение на дашборд
const switchToDashboard = () => {
  toogleLink('Dashboard');
};

// переключение на хистори
const switchToArchive = () => {
  toogleLink('History');
};

export default {
  dashboardLink,
  archiveLink,
  switchToDashboard,
  switchToArchive,
};
