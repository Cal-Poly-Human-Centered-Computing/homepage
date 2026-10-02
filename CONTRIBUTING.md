# Contributing

Pick the guide that fits you:

- [Contributing as faculty](#contributing-as-faculty)
- [Contributing as a student](#contributing-as-a-student)

Both start with [Getting started](#getting-started).

If you see a bug or something to fix but do not want to change it yourself, [open an issue](https://github.com/Cal-Poly-Human-Centered-Computing/homepage/issues/new).

## Getting started

This site is plain HTML, CSS, and JavaScript. There is no build step. The page loads its content from JSON files in the `data` folder, so most changes only mean editing one of those files.

If you have never edited a GitHub repository before, GitHub's guide [Contributing to a project](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project) walks through forking, editing, and opening a pull request. You can also edit files directly on github.com if you have write access.

### Seeing your changes locally

Browsers will not load the JSON files if you open `index.html` directly from your file system. Start a small local server from the repository folder instead. Either of these works:

```
python3 -m http.server
```

```
npx serve
```

Then open the address it prints (for example http://localhost:8000).

## Contributing as faculty

### Adding yourself

1. Add your headshot to `assets/photos/`. Name it `LastnameFirstname.jpg` (or `.png`, `.webp`). A square photo works best.
2. Add an entry to `data/faculty.json`:

```json
{
    "name": "Jane Doe",
    "homepage": "https://example.com/",
    "headshot": "./assets/photos/DoeJane.jpg",
    "headshot alt": "Jane smiling outside on campus",
    "title": "Assistant Professor",
    "bio": "A few sentences about your research."
}
```

- The page sorts people by last name (the last word of `name`), so the order in the file does not matter.
- If you leave `headshot` as `""`, the group logo is shown in grey instead.
- `headshot alt` is required when you have a headshot. See [Alt text](#alt-text).
- Remember the comma between entries. JSON does not allow a comma after the last entry.

### Adding a project

Add an entry to `data/projects.json`:

```json
{
    "name": "Project title",
    "description": "What the project is about.",
    "end": "",
    "image": {
        "path": "./assets/images/my-project.png",
        "alt": "A description of what the image shows."
    },
    "awards": ["Best Paper Award, IEEE VIS 2026"],
    "student contributors": ["Student Name"],
    "publications": ["https://link-to-paper"],
    "recruiting": {
        "until": "06/15/2027",
        "message": "What kind of students you are looking for."
    },
    "faculty contact": {
        "name": "Jane Doe",
        "email": "jdoe@calpoly.edu"
    }
}
```

- `end`: leave as `""` while the project is active. Once the date (`MM/DD/YYYY`) has passed, the project moves to Past Projects automatically.
- `image`: leave `path` as `""` for no image. If you add an image, `alt` is required. Images without alt text are not shown. See [Alt text](#alt-text).
- `recruiting`: the `message` is shown whenever it is not empty. If `until` (`MM/DD/YYYY`) is a date in the future, the page also says "We are recruiting until" that date. Leave `until` as `""` if there is no deadline. Leave `message` as `""` if you are not recruiting.
- `awards`: each award is shown under the project title with a trophy. Leave as `[]` if there are none.
- `student contributors` and `publications` can be empty lists: `[]`.
- Project images go in `assets/images/`.

### Adding a sponsor or collaborator

Add the logo to `assets/logos/` (SVG is best) and add an entry to `data/sponsors.json` or `data/collaborators.json`:

```json
{
    "name": "Organization Name",
    "url": "https://example.org/",
    "logo": "./assets/logos/example.svg"
}
```

- The `name` is used as the logo's alt text.
- If you do not have a logo yet, leave `logo` as `""` and the name is shown as text instead.
- Logos are shown on a white background in both light and dark mode, so use the version made for light backgrounds.

### Reviewing student pull requests

Students will open pull requests to add themselves. Please check that the JSON is valid, the photo is reasonably small, and the alt text is filled in. If you have Node installed, running the [image compression script](#compressing-images) before merging is helpful.

## Contributing as a student

Before you start, check with the faculty member you work with. They will review your pull request.

### Adding yourself

1. Add your headshot to `assets/photos/`. Name it `LastnameFirstname.jpg` (or `.png`, `.webp`). A square photo works best. Please keep it under about 200 KB if you can.
2. Add an entry to `data/students.json`:

```json
{
    "name": "Sam Lee",
    "homepage": "https://example.com/",
    "headshot": "./assets/photos/LeeSam.jpg",
    "headshot alt": "Sam smiling in front of the library",
    "title": "Undergraduate, Computer Science",
    "end": "12/15/2026"
}
```

- `end` is required. It is the date (`MM/DD/YYYY`) you expect to stop working with the group. After that date, the page moves you from Current Students to Past Students automatically, so nobody has to remember to update the file.
  - If you are working with us for one semester, use the last day of that semester from the Cal Poly academic calendar.
  - Otherwise, ask your faculty advisor what date to use.
  - If your plans change, update the date.
- `homepage` can be a personal site, GitHub, or LinkedIn. Leave it as `""` if you do not want a link.
- If you would rather not share a photo, leave `headshot` and `headshot alt` as `""`. The group logo is shown instead.
- `headshot alt` is required when you have a headshot. See [Alt text](#alt-text).
- If `students.json` is empty (`[]`), put your entry between the square brackets. If there are other entries already, add a comma after the one before yours.

The Current Students and Past Students sections only appear on the page once they have at least one person in them.

### Adding yourself to a project

Find your project in `data/projects.json` and add your name to its `student contributors` list:

```json
"student contributors": ["Leyao (Hannah) Yang", "Sam Lee"],
```

If your project is not listed yet, ask your faculty member to add it.

## Alt text

Every image needs alt text, which is what screen readers read aloud in place of the image. Keep it short and describe what is in the picture.

- Headshots: one short phrase, like "Jane smiling outside on campus" or "A portrait of Sam smiling". You do not need to repeat your title or say "photo of".
- Project images: describe what someone would learn from looking at the image. For a diagram or figure, summarize what it shows.

## Formatting text

- Text fields can contain HTML, for example `<i>Inkling</i>` or `<a href="https://example.com">a link</a>`. Use `\"` for quotes inside HTML attributes, since the whole value is already in double quotes.
- Line breaks become HTML. In JSON, write a line break as `\n`. A single `\n` becomes a line break, and a blank line (`\n\n`) starts a new paragraph.

## Compressing images

Large photos make the page slow. The compression script resizes and compresses images in `assets/photos` (max 600 pixels) and `assets/images` (max 1600 pixels). It replaces the files in place and keeps the same file names, so you do not need to change any JSON.

You need [Node.js](https://nodejs.org/) installed. From the repository folder:

```
npm install
npm run compress-images
```

The script records each compressed file in `assets/compressed-images.json` so it never compresses the same image twice. If you replace an image with a new one under the same name, the script notices the file changed and compresses the new one. Commit `assets/compressed-images.json` along with your images.

If you do not have Node, that is fine. Just try to keep headshots under about 200 KB, and someone else can run the script later.

## How the repository is organized

| Path | What it is |
| --- | --- |
| `index.html` | The page itself. The intro text and footer live here. |
| `styles.css` | All styling, including dark mode. |
| `main.js` | Loads the JSON files and turns them into HTML. |
| `data/faculty.json` | One entry per faculty member. |
| `data/students.json` | One entry per student, current or past. |
| `data/projects.json` | One entry per project, active or past. |
| `data/collaborators.json` | Past and current organizational collaborators, shown as logos. |
| `data/sponsors.json` | Sponsors, shown as logos. |
| `assets/logos/` | Logos for collaborators and sponsors. |
| `assets/photos/` | Headshots. |
| `assets/images/` | The logo and project images. |
| `assets/compressed-images.json` | A record of which images have already been compressed. Do not edit by hand. |
| `scripts/compress-images.js` | Optional script that shrinks images. |

## Writing style

Keep text plain and direct. Say what the work is and who it is for. Avoid marketing language.

## Before you open a pull request

- Check the page locally and make sure your entry shows up.
- If nothing loads, there is probably a JSON syntax error (often a missing or extra comma). Your browser's developer console will say which file failed. You can also paste the file into a JSON validator such as https://jsonlint.com/.
- If your photo does not show, check that the `headshot` path matches the file name exactly, including capital letters and the file extension.
