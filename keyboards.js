// import Markup from 'telegraf/markup.js'

// import { Markup } from 'telegraf/typings/markup';
import { Markup } from 'telegraf';


export function getMainMenu() {
    // console.log('object');
    return Markup.keyboard([
        ['О компании', 'Как нас найти'],
        ['Активности', 'Розыгрыш'],
        ['Онлайн-стенд', 'Карьера']
    ]).resize()
}