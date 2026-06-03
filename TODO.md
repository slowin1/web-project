# TODO (Admin Panel refactor)

- [ ] Сделать отдельный AdminLayout компонент (sidebar/header/main container) и убрать UI-каркас из `src/pages/Admin.jsx`.
- [ ] Перевести переключение секций админки с `activeSection`/`href="#"` на реальные URL-роуты: `/admin`, `/admin/dashboard`, `/admin/users`, `/admin/services`, `/admin/content`, `/admin/settings`.
- [ ] Сохранить текущий функционал бэка: `ServicesManager` и `UsersManager` должны продолжить работать с теми же API.
- [ ] Добавить базовую функциональность в списках (поиск/фильтр/сортировка) без поломки CRUD (минимально: поиск по полям).
- [ ] Обновить стили под новый UI: использовать/расширить `css/admin.css`, по возможности убрать inline стили из `ServicesManager.jsx`.
- [ ] Проверить вручную в браузере: навигация по URL, открытие модалок, сохранение/удаление услуг, управление ролями.
- [ ] Прогнать сборку: `npm run build`.

