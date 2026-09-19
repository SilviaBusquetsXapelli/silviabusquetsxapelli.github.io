# Silvia Busquets Xapellí — Personal Website

Source files for the GitHub Pages site:

**https://silviabusquetsxapelli.github.io**

## Sections

- **Home** — overview of projects, Europe and economy, explainers and publications
- **Projects** — selected research and data work as it becomes ready for publication
- **Europe & Economy** — resources on European institutions, economics and policy
- **Explainers** — searchable short-form ideas organized by series and topic
- **Books** — independent publications and future Amazon links
- **About** — professional profile and external links

## Explainers structure

The Explainers page is designed to scale as the catalogue grows:

- series are grouped in separate sections
- visitors can search by keyword
- topic filters cover Economics, Finance and Europe
- new series can be added without changing the main navigation

Planned titles are clearly labelled as planned rather than published content.

## Deployment

Publish directly from the `main` branch using GitHub Pages.

The website files must stay at the **root of the repository**. `index.html` must remain in the root.

```text
index.html
projects.html
eu-knowledge.html
explainers.html
books.html
about.html
css/
  style.css
js/
  script.js
assets/
.nojekyll
```

## Updating books

When a title goes live:

1. Add the cover image to `assets/`
2. Add or update the book entry in `books.html`
3. Add the Amazon link
4. Commit the changes to `main`

## Notes

- Keep unpublished or unreviewed research files out of the public repository
- Add only projects that are ready to share publicly
- GitHub Pages may take a few minutes to publish a new commit
