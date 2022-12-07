# Гайд по работе с JS

Скрипты подключаются модулями в файл [main.js](source/js/main.js)

Все скрипты должны быть в обработчике `DOMContentLoaded`, но не все в `load`. В `load` следует добавить скрипты, не участвующие в работе первого экрана.

Привязывай js не на классы, а на дата атрибуты (data-validate)

Вместо модификаторов .block--active используй утилитарные классы:
- .is-active
- .is-open
- .is-invalid

Обязателен нейминг в два слова.

| ❌ | ✅ |
| --- | --- |
| `.select.select--opened` | `[data-select].is-open` |

Выносим все в дата-атрибуты:
- url до иконок пинов карты,
- настройки автопрокрутки слайдера,
- url к json и т.д.

Для адаптивного JS используейтся matchMedia и addListener

```javascript
const breakpoint = window.matchMedia(`(min-width:1024px)`);
const breakpointChecker = () => {
  if (breakpoint.matches) {} else {}
};
breakpoint.addListener(breakpointChecker);
breakpointChecker();
```

используйте .closest(el)
