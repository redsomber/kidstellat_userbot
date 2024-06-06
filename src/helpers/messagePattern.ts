export const messagePattern = (
    chat_title: string | null,
    chat_username: string | null,
    text: string,
    username: string | null,
    keyword: string | null
) => {
    return `!!Поймано сообщение!!
Чат: ${chat_title}
Линк: @${chat_username}

От: @${username}
Сообщение: 
${text}

Ключ: ${keyword}
`
}
