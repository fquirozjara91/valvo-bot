const path = require('path');

const root = path.join(__dirname, '..');

module.exports = {
  root,
  avatar: path.join(root, 'images', 'valvo-avatar.png'),
  spider: path.join(root, 'images', 'spider-valvo.jpg'),
  gifOne: path.join(root, 'images', 'gif', '1dado.gif'),
  gifTwo: path.join(root, 'images', 'gif', '2dados.gif'),
  die: (face) => path.join(root, 'images', '1dado', `${face}.png`),
  facts: path.join(root, 'data', 'valheim-facts.json'),
  db: path.join(root, 'data', 'valvo.json'),
};
