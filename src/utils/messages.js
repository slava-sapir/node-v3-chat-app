const generateMessage = (text, username) => {

    return {
        text,
        username,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (text, url, username,) => {

    return {
        text,
        url,
        username,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}