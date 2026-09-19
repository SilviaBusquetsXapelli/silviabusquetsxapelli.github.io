# Silvia Busquets Xapellí — Personal Website

Source files for the GitHub Pages site:

**https://silviabusquetsxapelli.github.io**

## Sections

- **Home** — overview of research, European/economic content and publications
- **Projects** — selected research and data work as it becomes ready for publication
- **Europe & Economy** — resources on European institutions, economics and policy
- **Explainers** — short-form educational content on economics, finance and European institutions
- **Books** — independent publications and future Amazon links
- **About** — professional profile and external links

## Deployment

This repository is designed to be published directly from the `main` branch using GitHub Pages.

The website files should stay at the **root of the repository**. In particular, `index.html` must remain in the root.

Main structure:

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
.nojekyll
```

## Updating books

When a title goes live:

1. Add the cover image to an `assets/` folder.
2. Add or update the book entry in `books.html`.
3. Add the relevant Amazon link.
4. Commit the changes to `main`.

The public website address remains unchanged, so printed books can continue pointing readers to the same catalogue URL.

## Notes

- Keep unpublished or unreviewed research files out of the public repository.
- Add only projects that are ready to be shared publicly.
- GitHub Pages may take a few minutes to publish a new commit.
