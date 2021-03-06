export default {
    endpoint: "https://aviasales-api.herokuapp.com",
    cache: {
        // через сколько миллисекунд истекает кэш на основные справочники + 30 дней
        ttl: 2592000 * 1000,
        // через сколько миллисекунд истекает кэш на справочник Авиа компаний 24 часа.
        ttlAirlines: 86400 * 1000,
    },
    dateConfig: { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric" },
    locale: "ru-RU",
    datePickerI18n: {
        cancel: "Отмена",
        clear: "Очистить",
        done: "Выбрать",
        months: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
        monthsShort: ["янв.", "февр.", "март", "апр.", "май", "июнь", "июль", "авг.", "сент.", "окт.", "нояб.", "дек."],
        weekdays: ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"],
        weekdaysShort: ["пп", "вт", "ср", "чт", "пт", "сб", "вс"],
        weekdaysAbbrev: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
    }
}
