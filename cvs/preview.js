

function setSectionDefaults() {
    const sections = JSON.parse(localStorage.getItem('sections'))
    if (!sections) return null
    sections && Object.entries(sections).forEach(([section, active]) => {
        document.querySelector(`#${section}`).style.display = active ? 'initial' : 'none'

    })
    return sections
}

function CV(id) {
    if (!id) return null
    const cv = JSON.parse(localStorage.getItem(id))
    if (!cv) return null
    console.groupCollapsed('CV Data')
    console.log('Name: ' + cv.name)
    console.log('Created ' + new Date(cv.created))
    console.log('Updated ' + new Date(cv.updated))
    console.log(cv)
    console.groupEnd()
    return cv
}

function Style(id) {
    if (!id) return null
    const style = JSON.parse(localStorage.getItem(id))
    if (!style) return null
    console.groupCollapsed('Style Data')
    console.log('Name: ' + style.name)
    console.log('Created ' + new Date(style.created))

    console.log(style)
    console.groupEnd()
    return style
}

/**
 * Set the sections to display based on the CV data
 * @param {Object} cv
 */
function setSectionsByCV(cv) {
    if (!cv) return false
    try {
        document.querySelector('#personal').style.display = cv.personal?.active ? 'initial' : 'none';
        document.querySelector('#summary').style.display = cv.summary?.active ? 'initial' : 'none';
        document.querySelector('#educations').style.display = cv.education?.active ? 'initial' : 'none';
        document.querySelector('#jobs').style.display = cv.jobs.active ? 'initial' : 'none';
        document.querySelector('#skills').style.display = cv.skills.active ? 'initial' : 'none';
        document.querySelector('#interests').style.display = cv.interests.active ? 'initial' : 'none';
        document.querySelector('#references').style.display = cv.references.active ? 'initial' : 'none';
        document.querySelector('#certifications').style.display = 'none'
    } catch (error) {
        console.error(error)
        return false
    }

    return true

}

function fillPersonal() {
    const personal = JSON.parse(localStorage.getItem('personal'))
    if (!personal) return
    console.groupCollapsed('Personal')
    console.log(personal)
    console.groupEnd()

    window.first.innerText = personal.first
    window.last.innerText = personal.last
    window.email.innerText = personal.email || ''
    window.email.href = `mailto:${personal.email}`
    window.city.innerText = personal.location || ''
    // window.phone.innerText = personal.phone || ''
}

function fillSummary() {
    const summary = JSON.parse(localStorage.getItem('summary'))
    if (!summary) return
    console.groupCollapsed('Summary')
    console.log(summary)
    console.groupEnd()
    window.summary.appendChild(document.createTextNode(summary))
}


function parseAchievement(achievements) {
    if (!achievements) return null
    const splitted = achievements.split('\n')

    const nonEmpty = splitted.filter(line => !['', ' ', '\n', '\r', '\r\n', '\n\r'].includes(line))

    const bulletPoints = nonEmpty.map(line => line.startsWith('-'))

    const noBullets = bulletPoints.every(bullet => bullet === false)


    const lines = noBullets ? nonEmpty : nonEmpty.map(line => line.slice(1))

    const reformatted = lines.map(line => {
        const split = line.split('**')

        if (split.length < 3) {
            const span = document.createElement('span')
            span.textContent = line
            return span
        }


        const span = document.createElement('span')
        split.forEach((part, index) => {
            if (index % 2 === 0) {
                span.appendChild(document.createTextNode(part))
            }

            if (index % 2 === 1) {
                const strong = document.createElement('strong')
                strong.appendChild(document.createTextNode(part))
                span.appendChild(strong)
            }
        })
        return span


    })

    if (noBullets) {
        const wrapper = document.createElement('div')
        reformatted.forEach(achievement => {
            wrapper.appendChild(achievement)
        })
        return wrapper
    }

    const unorderedList = document.createElement('ul')
    reformatted.forEach(achievement => {
        const li = document.createElement('li')
        li.appendChild(achievement)
        unorderedList.appendChild(li)
    })

    return unorderedList
}



function fillJobs(cv) {
    console.groupCollapsed('Jobs')
    const jobKeys = Object.keys(localStorage).filter(key => key.startsWith('job_'))
    if (!jobKeys) {
        window.jobs.style.display = 'none'
        console.groupEnd()
        return
    }


    jobKeys.forEach(job => {
        const entry = JSON.parse(localStorage.getItem(job))

        const template = window.job
        const clone = template.content.cloneNode(true)

        clone.querySelector('.title').innerText = entry.title
        clone.querySelector('.company').innerText = entry.company
        clone.querySelector('.time').innerText = `${entry.from} - ${entry.to || 'Present'}`

        const defaultAchievements = entry.achievements

        const customAchievements = cv && cv.hasOwnProperty('jobs') && cv.jobs[job]?.achievements

        const achievements = customAchievements || defaultAchievements
        const achievementsParsed = parseAchievement(achievements)
        console.log('achievementsParsed', achievementsParsed)
        // clone.querySelector('.achievements').innerText = customAchievements || defaultAchievements

        clone.querySelector('.achievements').appendChild(achievementsParsed)

        window.jobs.appendChild(clone)
    })
    console.groupEnd()
}

function fillSkills() {

    const skillKeys = Object.keys(localStorage).filter(key => key.startsWith('skill_'))
    console.groupCollapsed('Skills')
    console.log(skillKeys)

    console.log(skills)
    // unique skill categories
    const skillCategories = [...new Set(skillKeys.map(key => JSON.parse(localStorage.getItem(key))).map(skill => skill.category))]
    console.log(skillCategories)
    console.info('Skills')
    console.log(window.skills)
    skillCategories.forEach(category => {
        const skillsInCategory = skillKeys.map(key => JSON.parse(localStorage.getItem(key))).filter(skill => skill.category === category)
        console.log(skillsInCategory)
        const h3 = document.createElement('h3')
        h3.innerText = category
        window.skills.appendChild(h3)
        skillsInCategory.forEach(skill => {
            const p = document.createElement('p')
            p.innerText = skill.skill
            window.skills.appendChild(p)
        })
    })
    console.groupEnd()
}

function fillEducations() {

    // the education entries are 'education_timestamp' like 'education_1630512345678'
    const educationKeys = Object.keys(localStorage).filter(key => key.startsWith('education_'))
    console.groupCollapsed('Education')
    console.log(educationKeys)
    const educations = educationKeys.filter(key => key.includes('education'))
    console.log(educations)
    educations.forEach(education => {
        const template = window.education
        const entry = JSON.parse(localStorage.getItem(education))
        console.log(entry)
        const clone = template.content.cloneNode(true)
        clone.querySelector('.degree').innerText = entry.degree
        clone.querySelector('.institution').innerText = entry.institution
        clone.querySelector('.time').innerText = `${entry.from} - ${entry.to || 'Present'}`

        const defaultAchievements = entry.achievements
        const customAchievements = cv && cv.hasOwnProperty('education') && cv.education[education]?.achievements
        const achievements = customAchievements || defaultAchievements
        console.log('achievements', achievements)

        const achievementsParsed = parseAchievement(achievements)
        console.log(achievementsParsed.children[0].textContent)
        clone.querySelector('.achievements').appendChild(achievementsParsed)
        window.educations.appendChild(clone)
    })
    console.groupEnd()
}


function fillInterests() {


    const interests = JSON.parse(localStorage.getItem('interests'))
    console.groupCollapsed('Interests')
    console.log(interests)
    console.groupEnd()

}

function correctLinks(params) {
    const nav = window.back

    const styleId = params.get('style')
    const backStyle = nav.children.style
    if (!styleId) {
        backStyle.remove()
    } else {
        backStyle.href = '/styles/edit.html?id=' + styleId
        backStyle.innerText = '/styles/' + styleId
    }

    const backCV = nav.querySelector('#cv')
    if (!id) {
        backCV.remove()
    } else {
        backCV.href = '/cvs/edit.html?id=' + id
        backCV.innerText = '/cvs/' + id
    }
}


const sections = setSectionDefaults()
console.log(sections)
const params = new URLSearchParams(window.location.search)
const id = params.get('id')
const styleID = params.get('style')

const cv = CV(id)

const main = document.querySelector('main')
const style = Style(styleID)

const layout = style?.layout ?? []
// console.log('layout', layout)
// console.log(layout.sections)
const sectionTypes = ['single', 'left', 'right']
layout.hasOwnProperty('sections') && layout.sections.forEach(sectionName => {
    // console.log(sectionName) // e.g. single0, left1, right2
    if (!sectionName) return
    const match = sectionTypes.find(type => sectionName.includes(type))
    // console.log(match)
    if (!match) return
    const sectionType = match
    const sectionNumber = sectionName.replace(sectionType, '')
    // console.log(sectionType, sectionNumber)

    if (sectionType === 'single') {
        const single = document.createElement('div')
        single.classList.add('layout')
        single.dataset.layout = 'single'
        single.dataset.id = sectionNumber;
        single.id = sectionName

        // append to start of main
        main.prepend(single)


        console.log(layout)
        console.log(layout.sections)
        const entries = layout.sections.map(section => { section === sectionName })
        console.log(entries)
    }

    if (sectionType === 'left') {
        const double = document.createElement('div')
        double.dataset.layout = 'double'
        double.classList.add('layout')
        double.classList.add('double')

        const left = document.createElement('div')
        left.classList.add('layout')
        left.dataset.layout = 'left'
        left.dataset.id = sectionNumber;
        left.id = sectionName
        double.appendChild(left)

        const right = document.createElement('div')
        right.classList.add('layout')
        right.dataset.layout = 'right'
        right.dataset.id = `${Number(sectionNumber) + 1}`

        right.id = `right${Number(sectionNumber) + 1}`;
        double.appendChild(right)
        // append to start of main
        main.prepend(double)
    }

})

console.groupCollapsed('Sections')
Object.entries(sections).forEach(([section, active]) => {
    console.log(section, active)

    const sectionElement = document.querySelector(`#${section}`)
    if (!sectionElement) {
        console.warn(`Section ${section} not found in DOM`)
        return
    }


    if (!layout.hasOwnProperty(section)) {
        console.warn(`Section ${section} not found in layout`)
        return
    }
    const targetID = layout[section]
    const targetSelector = `#${targetID}`
    const sectionTarget = document.querySelector(targetSelector)
    if (!sectionTarget) {
        console.warn(`Section ${section} not found in layout`)
        return
    }


    sectionTarget.appendChild(sectionElement)

})

// sort the sections by data-id
const sorted = [...main.children].sort((a, b) => b.dataset.id - a.dataset.id) // Yeah reverse. Of course, reverse. ;) However it does what it shouldf
console.log(sorted)
sorted.forEach(section => {
    main.appendChild(section)
})
console.groupEnd()
const sectionsSet = setSectionsByCV(cv)
if (!sectionsSet) console.log('Sections not set. Set defaults in the "facts" section')
// anyway, fill the sections
if (!cv || cv.personal?.active) fillPersonal()
if (!cv || cv.summary?.active) fillSummary()
if (!cv || cv.jobs?.active) fillJobs(cv)
if (!cv || cv.skills?.active) fillSkills()
if (!cv || cv.education?.active) fillEducations()
if (!cv || cv.interests?.active) fillInterests()

correctLinks(params)