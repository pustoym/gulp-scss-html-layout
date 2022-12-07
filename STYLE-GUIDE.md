# Гайд по работе с SCSS

- у некоторых шрифтов в ios возникают проблемы [с символом рубля](https://www.artlebedev.ru/kovodstvo/sections/159/#13)

## Цвета

Свод рекомендаций по именованию:

- Только английские слова, без сокращений.
- Существительные, коротко и понятно.
- Цифровые индексы на конце для одного цвета с разными альфа-каналами.
- Тона серого — по уровню серого.
- Единый способ разделять слова.

Для нейминга цветов используй сервис [htmlcsscolor.com/](https://www.htmlcsscolor.com/hex/334482)

Альтернативные сервисы генерации имен цвета:
- [ColorSheme.RU](https://colorscheme.ru/color-converter.html)
- [chir.ag](https://chir.ag/projects/name-that-color/#6195ED)

### `chrome autofill background removal`

Если на проекте у инпутов используются разные цвета фонов или текста, то
удалите правило из глобального [reboot.scss](source/sass/global/reboot.scss#L96) и используйте локально с нужными цветами. Тонкости:
- rgba не подойдет, сконвертируйте цвет в hex без прозрачности
- если в стилях уже используется `box-shadow`, то альтернативное решение — задать к списку транзишенов `background-color 10000000s ease-out`

## Скейлинг
Использование скейлинга должно быть согласовано с командой и заказчиком.

Переменная $font-size используется в html для подключения скейлинга

## Миксины — примеси
- Не пиши примеси без нужды! Не нужно исать примесь когда:
  - В примеси 1-2 правила.
  - Примесь нужна на 1-2 вызова.
  - Примесь уже была написана кем-то ранее (.clearfix();).
- Делай примеси как можно проще.
- Используй уже готовые наборы примесей: [Bootstrap](https://github.com/twbs/bootstrap/tree/main/scss/mixins), [Foundation](https://github.com/foundation/foundation-sites/blob/develop/scss/util/_mixins.scss).

### Примеси @media
[Файл с миксинами брейкпойнтов](source/sass/mixins/_breakpoints.scss)

- Вкладывай @media в селекторы, а не наоборот.
- Не вкладывай @media друг в друга.
- Пиши @media рядом, не пиши селекторы между ними.

### Примеси эффектов наведения
Для отключения ховеров на тач устройствах используется миксин hover-focus.

```SCSS
@mixin hover-focus {
    @media (hover: hover) {
      &:hover:not(.focus-visible) {
        @content;
      }
    }

    &.focus-visible:focus {
      @content;
    }
}

@include hover-focus {
  opacity: 0.8;
}
```
Но не используй его для текстовых полей ввода: input, textarea.

Так же в сборке есть отдельный миксин для hover:
```SCSS
@mixin hover {
  @media (hover: hover) {
    &:hover:not(.focus-visible) {
      @content;
    }
  }
}
```
Для focus:
```SCSS
 @mixin focus {
  &.focus-visible:focus {
    @content;
  }
}
```
И для active:
```SCSS
@mixin active {
  &.focus-visible:active {
    @content;
  }
}
```

## Transition
Для любых `transition` обязательно указывай `transition-property`:

| ❌ | ✅ |
| --- | --- |
| `transition: $trans-default` | `transition: color $trans-default` |

## VH
Для фикса проблем с `vh` на iOS в сборке подключен скрипт [ios-vh-fix](source/js/utils/ios-vh-fix.js).

Используя `vh` на проекте задавайте их также как классу `.wrapper` в примере  [utils.scss](source/sass/global/utils.scss#L27).
