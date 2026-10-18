/**
 * Image layout for posts, run before gatsby-remark-images.
 *
 * - Images written on the same line render side by side:
 *     ![](a.png) ![](b.png)
 *     <img src="a.png" width="25%"><img src="b.png" width="25%">
 * - A `width` on <img> is kept. gatsby-remark-images drops it when it swaps
 *   the tag for a responsive image, so the width moves onto a wrapper <div>.
 */
const IMG_TAG = /<img\b[^>]*>/gi;

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return m ? m[1] ?? m[2] ?? m[3] : '';
};

// "25%" stays a percentage, "500" becomes "500px"
const cssWidth = width => (/^\d+(\.\d+)?$/.test(width) ? `${width}px` : width);

const escapeAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const rowHtml = imgs =>
  '<div class="image-row">'
  + imgs
    .map(({ tag, width }) => {
      const style = width ? ` style="flex: 0 1 ${cssWidth(width)}"` : '';
      return `<div class="image-row-item"${style}>${tag}</div>`;
    })
    .join('')
  + '</div>';

const sizedHtml = ({ tag, width }) =>
  `<div class="image-sized" style="width: ${cssWidth(width)}">${tag}</div>`;

// <img> tags in an html node that holds nothing but images
const onlyImgTags = value => {
  const tags = value.match(IMG_TAG) || [];
  const rest = value.replace(IMG_TAG, '').replace(/<br\s*\/?>/gi, '').trim();
  return tags.length && !rest ? tags.map(tag => ({ tag, width: attr(tag, 'width') })) : null;
};

// images in a paragraph that holds nothing but images (markdown images and/or <img> tags)
const onlyImagesIn = paragraph => {
  const imgs = [];
  for (const child of paragraph.children) {
    if (child.type === 'image') {
      imgs.push({
        tag: `<img src="${escapeAttr(child.url)}" alt="${escapeAttr(child.alt || '')}">`,
        width: '',
      });
    } else if (child.type === 'html' && onlyImgTags(child.value)) {
      imgs.push(...onlyImgTags(child.value));
    } else if (!(child.type === 'text' && !child.value.trim())) {
      return null;
    }
  }

  return imgs;
};

const walk = (node, fn, parent = null) => {
  fn(node, parent);
  (node.children || []).forEach(child => walk(child, fn, node));
};

module.exports = ({ markdownAST }) => {
  walk(markdownAST, (node, parent) => {
    if (node.type === 'paragraph') {
      const imgs = onlyImagesIn(node);
      if (imgs && imgs.length >= 2) {
        node.type = 'html';
        node.value = rowHtml(imgs);
        delete node.children;
      }
      return;
    }

    // an <img> inline with text stays as is (a <div> can't sit inside a <p>)
    if (node.type === 'html' && parent?.type !== 'paragraph') {
      const imgs = onlyImgTags(node.value);
      if (!imgs) {
        return;
      }

      if (imgs.length >= 2) {
        node.value = rowHtml(imgs);
      } else if (imgs[0].width) {
        node.value = sizedHtml(imgs[0]);
      }
    }
  });

  return markdownAST;
};
