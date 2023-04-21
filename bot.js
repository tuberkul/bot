import { Telegraf } from "telegraf";
import * as config from "dotenv";
import { google } from 'googleapis'
import { Markup } from "telegraf";
config.config()


import { getMainMenu } from './keyboards.js';

const bot = new Telegraf(process.env.BOT_TOKEN);

let hour;
let min;
let day;
let mouth;
let year;


let perem = 0;


const reminder = function(context, array) {
    if (perem <= 1) {
        const date = array[1][1].split(" ");
        const time = array[1][2].split(":");
        day = +date[0];
        mouth = +date[1] - 1;
        year = +date[2];
        hour = +time[0];
        min = +time[1];
    
        let dateInput = new Date(year, mouth, day, hour, min);
        let curDate = new Date()
        // var today = new Date();
        let counter = 1;
        let timer = setInterval(function(){
            curDate = new Date()
            var dd = String(curDate.getDate()).padStart(2, '0');
            var mm = String(curDate.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = curDate.getFullYear();
            var hh = curDate.getHours();
            var minutes = curDate.getMinutes();
//             if (dateInput.getTime() <= curDate.getTime()) {
//                 for (let i = 1; i < array.length; i++) {
//                      context.telegram.sendPhoto(array[i][0],{ source: './img/8.jpg' },
//                     {
//                         caption: `
// 🔥 <b>Мы уже начали лоттерею!</b>
// Ждем вас! Может быть именно вы заберете один из наших ценных призов!`,
//                         parse_mode: 'HTML'
//                     }
//                 )
//                 }
//                 clearInterval(timer);
//             }
            console.log(array);
            console.log(array.length);
            console.log(Math.round((dateInput - curDate)/60000));
        }, 60000);    
    }
}

const id = process.env.ID;

const auth = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    });

    const client = await auth.getClient();

    const sheets = google.sheets({
        version: 'v4',
        auth: client
    })

    return {sheets};
}

const getData = async () => {
    const {sheets} = await auth();

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: id,
        range: 'Лист1'
    })

    return response.data.values
}

const postData = async (ctx) => {
    const array = await getData()
    if (array.length > 0) {
        for (let i = 1; i < array.length; i++ ) {
            if (+array[i][0] === ctx.message.chat.id) {
                return;
            }
        }
    }
    const {sheets} = await auth()
    const writeReq = await sheets.spreadsheets.values.append({
        spreadsheetId: id,
        range: 'Лист1',
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [
                [ctx.message.chat.id]
            ]
        }
    })
}
bot.start(async ctx => {
    // const array = await getData()
    postData(ctx)
    ctx.replyWithPhoto({ source: './img/1.jpg' },
    {
        caption: `
<b>Привет, это бот ЕДИНОГО ЦУПИС!</b>
Добро пожаловать на AgileDays’23. 💚`,
        parse_mode: 'HTML'
    }).then (() => {
        ctx.replyWithHTML(` 
<b>Я многое про нас расскажу:</b>
вы узнаете о компании, и о том, как найти наш стенд, а также какие интерактивы и подарки мы для вас подготовили!

Еще я покажу вам наш онлайн-стенд и даже познакомлю с коллегами – карьерными специалистами. 🙂 

Хорошей вам конференции!
Ждем вас на нашем стенде! 🙂
                `, getMainMenu())
    })
    // getMainMenu()
    // reminder(ctx, array)
    perem++;
})

bot.hears('О компании', ctx =>{
    ctx.replyWithPhoto({ source: './img/2.jpg' }, {caption: `
<b>Добро пожаловать в ЕДИНЫЙ ЦУПИС!</b>

ЕДИНЫЙ ЦУПИС – это высоконагруженный финтех с 16 миллионами уникальных пользователей. Мы выпускаем более 15 релизов в сутки и обрабатываем за это время 2 миллиона платежей. Наш service-level agreement 99.99%.
    
Наша задача — это развитие платёжных и цифровых сервисов для достижения полной прозрачности и доверия в индустрии развлечений.

Сегодня мы здесь, чтобы знакомиться с вами и делиться опытом! Для нас очень ценно иметь возможность такого знакомства. Обязательно заглядывайте на наш стенд!
    `,
    parse_mode: 'HTML'})
})

bot.hears('Как нас найти', ctx =>{
    ctx.replyWithPhoto({ source: './img/3.jpg' }, {caption:  `
👋 <b>Наш стенд сложно не заметить</b>, но с картой вы точно не пройдете мимо.🙂
    `,
    parse_mode: 'HTML'})
})

bot.hears('Активности', ctx =>{
    ctx.replyWithPhoto({ source: './img/4.jpg' }, {caption:  `
<b>Что можно выиграть и какие есть активности?</b>🤩

На нашем стенде можно не только познакомиться с нами, но и принять участие в интерактивах и выиграть подарки. 💚

1. Если вы сильный менеджер – вы сможете проявить себя на нашем силомере. 

2. Обязательно пройдите лабиринт. Он приведёт вас к вкусному китайскому чаю, подписке на медитацию, которая порой просто необходима, или антистрессу на случай, если на медитацию нет времени. 

3. Отвечайте на вопросы квиза и выигрывайте красивый и удобный термос (кстати, чай можно заваривать прямо в нём). Если вы проявите себя в квизе особенно хорошо, вы попадёте на розыгрыш трёх ценных призов: MacBook, Airpods Max или самое, на наш взгляд, классное – полный комплект мерча.
`,
parse_mode: 'HTML'
})
})

bot.hears('Розыгрыш', async ctx =>{
    const array = await getData()
    const date = array[1][1].split(" ");
    const time = array[1][2].split(":");
    day = +date[0];
    mouth = +date[1] - 1;
    year = +date[2];
    hour = +time[0];
    min = +time[1];
    const month_list = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
           'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    const mounthStr =  month_list[+mouth]


    ctx.replyWithPhoto({ source: './img/5.jpg' }, {caption:  `
<b>Розыгрыш состоится в ${day} ${mounthStr} ${year} в ${hour}:${min}!</b>

Если вы особенно удачно ответили на вопросы квиза и попали в розыгрыш, подойдите к этому времени на наш стенд. Но мы вам ещё напомним. 🙂
    `,
    parse_mode: 'HTML'})
})

 bot.hears('Онлайн-стенд', ctx =>{
     ctx.replyWithPhoto({ source: './img/6.jpg' }, {caption:  `
 <b>Будем рады видеть вас на нашем онлайн-стенде</b>
    
 Там вы сможете пройти онлайн-квиз и получить баллы, которые можно потратить на мерч в специальном магазине.
 `,
 parse_mode: 'HTML',
 reply_markup: {
     inline_keyboard : [
    [
        {
            text: 'ЕДИНЫЙ ЦУПИС Online',
            url: 'https://agiledays.online/partners/tsupis/'
        }
    ]
]
    }
 })
})

bot.hears('Карьера', ctx =>{
    ctx.replyWithPhoto({ source: './img/7.jpg' }, {caption:  `
    <b>Самый короткий путь к карьерному специалисту</b>
 `,
 parse_mode: 'HTML',
 reply_markup: {
     inline_keyboard : [
    [
        {
            text: 'Cсылка',
            url: 'https://t.me/cupiscareer'
        }
    ]
]
    }
 })

})


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));