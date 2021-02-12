
const getMenuFrontEnd = (role = 'USER_ROLE') => {

    const menu = [
        {
          title: 'Dashboard',
          icon: 'fas fa-chart-pie',
          target: 'dashboard',
          url: '/dashboard',
        },
        {
          title: 'Ordenes',
          icon: 'fas fa-clipboard-list',
          target: 'orders',
          submenu: [
            { title: 'Crear', url: 'create' },
            { title: 'Búscar', url: 'search' },
          ],
        },
        {
            title: 'Clientes',
            icon: 'fas fa-users',
            target: 'clients',
            submenu: [
              { title: 'Buscar', url: 'clients' }
            ],
          },
      ];

    // if ( role === 'ADMIN_ROLE' ) {
    //     menu[1].submenu.unshift({ titulo: 'Usuarios', url: 'usuarios' })
    // }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}
