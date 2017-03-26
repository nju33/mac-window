import Nightmare from 'nightmare';
import test from 'ava';

const nightmare = new Nightmare({});

test('title is mac-window', async t => {
  const title = await nightmare
    .goto('http://localhost:3333')
    .title();
  t.is(title, 'mac-window');
});
