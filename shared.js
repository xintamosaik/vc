function flashSuccessMessage(message) {
    const div = document.createElement('div')
    div.classList.add('flash')

    const h1 = document.createElement('h1')
    div.append(h1)

    const text = document.createTextNode(message.toUpperCase())
    h1.appendChild(text)

    document.body.prepend(div)
    setTimeout(() => {
        div.remove()
    }, 2000)
}

/**
 * This function compares a timestamp to now and gives either seconds, minutes, hours, days, weeks, months or years
 * @param {number} timestamp - The timestamp to compare to now
 * 
 * @returns {string} - The time difference as a approximate string
 */
function timeAgo(timestamp) {
    const now = Date.now()
    const diff = now - timestamp

    const seconds = Math.floor(diff / 1000)
    if (seconds < 120) {
        return `${seconds} seconds ago`
    }

    const minutes = Math.floor(seconds / 60)
    if (minutes < 120) {
        return `${minutes} minutes ago`
    }

    const hours = Math.floor(minutes / 60)
    if (hours < 48) {
        return `${hours} hours ago`
    }

    const days = Math.floor(hours / 24)
    if (days < 14) {
        return `${days} days ago`
    }

    const weeks = Math.floor(days / 7)
    if (weeks < 8) {
        return `${weeks} weeks ago`
    }

    const months = Math.floor(days / 30)
    if (months < 24) {
        return `${months} months ago`
    }

    const years = Math.floor(days / 365)
    return `${years} years ago`
}