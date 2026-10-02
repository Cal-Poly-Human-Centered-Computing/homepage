async function loadJson(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error("Could not load " + path);
    }
    return response.json();
}

function textToHtml(text) {
    const paragraphs = text.trim().split(/\n\s*\n/);
    const htmlParagraphs = paragraphs.map(function (paragraph) {
        const withLineBreaks = paragraph.trim().replace(/\n/g, "<br>");
        return "<p>" + withLineBreaks + "</p>";
    });
    return htmlParagraphs.join("");
}

function parseDate(text) {
    if (!text) {
        return null;
    }
    const parts = text.split("/");
    const month = Number(parts[0]);
    const day = Number(parts[1]);
    const year = Number(parts[2]);
    return new Date(year, month - 1, day);
}

function isInThePast(dateText) {
    const date = parseDate(dateText);
    if (date === null) {
        return false;
    }
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return date < startOfToday;
}

function getLastName(fullName) {
    const words = fullName.trim().split(" ");
    return words[words.length - 1];
}

function compareByLastName(personA, personB) {
    return getLastName(personA.name).localeCompare(getLastName(personB.name));
}

function createHeadshot(person) {
    const container = document.createElement("div");
    container.className = "headshot-container";

    const image = document.createElement("img");
    image.alt = "";
    image.loading = "lazy";

    if (person.headshot) {
        if (!person["headshot alt"]) {
            console.warn("Headshot without alt text: " + person.name);
        }
        image.alt = person["headshot alt"] || "";
        image.className = "headshot";
        image.src = person.headshot;
        container.appendChild(image);
        return container;
    }

    const picture = document.createElement("picture");
    const darkModeSource = document.createElement("source");
    darkModeSource.srcset = "./assets/images/hcc_logo_white.png";
    darkModeSource.media = "(prefers-color-scheme: dark)";
    image.className = "headshot headshot-placeholder";
    image.src = "./assets/images/hcc_logo.png";
    picture.appendChild(darkModeSource);
    picture.appendChild(image);
    container.appendChild(picture);
    return container;
}

function createPerson(person) {
    const listItem = document.createElement("li");
    listItem.className = "person";

    const textContainer = document.createElement("div");

    const heading = document.createElement("h3");
    if (person.homepage) {
        const link = document.createElement("a");
        link.href = person.homepage;
        link.textContent = person.name;
        heading.appendChild(link);
    } else {
        heading.textContent = person.name;
    }

    const title = document.createElement("p");
    title.className = "person-title";
    title.innerHTML = person.title;

    const bio = document.createElement("div");
    bio.innerHTML = textToHtml(person.bio);

    textContainer.appendChild(heading);
    textContainer.appendChild(title);
    textContainer.appendChild(bio);

    listItem.appendChild(createHeadshot(person));
    listItem.appendChild(textContainer);
    return listItem;
}

function createProjectImage(image) {
    if (!image || !image.path) {
        return null;
    }
    if (!image.alt) {
        console.warn("Skipping image without alt text: " + image.path);
        return null;
    }
    const element = document.createElement("img");
    element.className = "project-image";
    element.src = image.path;
    element.alt = image.alt;
    element.loading = "lazy";
    return element;
}

function createRecruitingBox(recruiting) {
    if (!recruiting || !recruiting.message) {
        return null;
    }

    let heading = "We are recruiting.";
    const untilDate = parseDate(recruiting.until);
    if (untilDate !== null && !isInThePast(recruiting.until)) {
        const readableDate = untilDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        heading = "We are recruiting until " + readableDate + ".";
    }

    const box = document.createElement("div");
    box.className = "recruiting";
    box.innerHTML = "<p><strong>" + heading + "</strong></p>" + textToHtml(recruiting.message);
    return box;
}

function addDetail(detailsList, label, valueElement) {
    const term = document.createElement("dt");
    term.textContent = label;
    const description = document.createElement("dd");
    description.appendChild(valueElement);
    detailsList.appendChild(term);
    detailsList.appendChild(description);
}

function createList(items, createItemContent) {
    const list = document.createElement("ul");
    items.forEach(function (item) {
        const listItem = document.createElement("li");
        listItem.appendChild(createItemContent(item));
        list.appendChild(listItem);
    });
    return list;
}

function createProject(project) {
    const article = document.createElement("article");
    article.className = "project";

    const heading = document.createElement("h3");
    heading.innerHTML = project.name;
    article.appendChild(heading);

    const description = document.createElement("div");
    description.innerHTML = textToHtml(project.description);
    article.appendChild(description);

    const image = createProjectImage(project.image);
    if (image) {
        article.appendChild(image);
    }

    const recruitingBox = createRecruitingBox(project.recruiting);
    if (recruitingBox) {
        article.appendChild(recruitingBox);
    }

    const details = document.createElement("dl");
    details.className = "project-details";

    const students = project["student contributors"] || [];
    if (students.length > 0) {
        const studentList = createList(students, function (name) {
            const span = document.createElement("span");
            span.innerHTML = name;
            return span;
        });
        addDetail(details, "Student contributors", studentList);
    }

    const publications = project.publications || [];
    if (publications.length > 0) {
        const publicationList = createList(publications, function (url) {
            const link = document.createElement("a");
            link.href = url;
            link.textContent = url;
            return link;
        });
        addDetail(details, "Publications", publicationList);
    }

    const contact = project["faculty contact"];
    if (contact && contact.name) {
        const contactText = document.createElement("span");
        contactText.textContent = contact.name;
        if (contact.email) {
            const emailLink = document.createElement("a");
            emailLink.href = "mailto:" + contact.email;
            emailLink.textContent = contact.email;
            contactText.append(" (", emailLink, ")");
        }
        addDetail(details, "Faculty contact", contactText);
    }

    if (details.children.length > 0) {
        article.appendChild(details);
    }

    return article;
}

function renderPeople(people, listId, sectionId) {
    const list = document.getElementById(listId);
    const section = document.getElementById(sectionId);
    const sortedPeople = people.slice().sort(compareByLastName);
    sortedPeople.forEach(function (person) {
        list.appendChild(createPerson(person));
    });
    if (sortedPeople.length > 0) {
        section.hidden = false;
    }
}

function renderProjects(projects) {
    const activeList = document.getElementById("active-projects-list");
    const pastList = document.getElementById("past-projects-list");
    const pastSection = document.getElementById("past-projects");

    projects.forEach(function (project) {
        if (isInThePast(project.end)) {
            pastList.appendChild(createProject(project));
            pastSection.hidden = false;
        } else {
            activeList.appendChild(createProject(project));
        }
    });
}

function showLoadingError(containerId, error) {
    console.error(error);
    const container = document.getElementById(containerId);
    const message = document.createElement("p");
    message.textContent = "Sorry, this section could not be loaded.";
    container.replaceWith(message);
}

async function start() {
    try {
        const faculty = await loadJson("./data/faculty.json");
        renderPeople(faculty, "faculty-list", "faculty");
    } catch (error) {
        showLoadingError("faculty-list", error);
    }

    try {
        const students = await loadJson("./data/students.json");
        renderPeople(students, "students-list", "current-students");
    } catch (error) {
        console.error(error);
    }

    try {
        const projects = await loadJson("./data/projects.json");
        renderProjects(projects);
    } catch (error) {
        showLoadingError("active-projects-list", error);
    }
}

start();
