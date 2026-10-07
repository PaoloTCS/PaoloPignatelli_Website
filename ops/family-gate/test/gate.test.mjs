import {test} from 'node:test';
import assert from 'node:assert/strict';
import {handle} from '../worker.mjs';
const password = 'fixture-only-password-1234';
const auth = (p = password) => 'Basic ' + Buffer.from('famiglia:' + p).toString('base64');
function harness() {
  const calls = [];
  const env = {FAMILY_PASSWORD: password, ASSETS: {fetch: async r => {
    calls.push(r); return new Response('protected fixture', {headers: {'Cache-Control': 'public'}});
  }}};
  return {env, calls};
}
const request = (path, authorization, method = 'GET') => new Request('https://paolopignatelli.com' + path,
  {method, headers: authorization ? {Authorization: authorization} : {}});
test('all family entry points and data challenge before accessing assets', async () => {
  for (const path of ['/family-ai.html', '/family-about.html', '/family-planning.html',
    '/family-agent-service/relationships.js', '/data/branches/x.json', '/history-connection.js',
    '/images/pignatelli-coat-of-arms.png', '/%66amily-ai.html?test=1']) {
    const {env, calls} = harness();
    const r = await handle(request(path), env);
    assert.equal(r.status, 401); assert.equal(calls.length, 0);
    assert.match(r.headers.get('www-authenticate'), /^Basic/);
  }
});
test('malformed and wrong credentials fail closed', async () => {
  for (const credential of ['Basic !!!', 'Bearer abc', auth('wrong'), 'Basic ZmFtaWdsaWE=']) {
    const {env, calls} = harness();
    assert.equal((await handle(request('/family-ai.html', credential), env)).status, 401);
    assert.equal(calls.length, 0);
  }
});
test('missing or short secret denies access even with a credential', async () => {
  for (const p of [undefined, '', 'short']) {
    const {env, calls} = harness(); env.FAMILY_PASSWORD = p;
    assert.equal((await handle(request('/family-ai.html', auth()), env)).status, 503);
    assert.equal(calls.length, 0);
  }
});
test('valid auth returns no-store content without forwarding credentials', async () => {
  const {env, calls} = harness();
  const r = await handle(request('/family-ai.html', auth()), env);
  assert.equal(r.status, 200); assert.equal(await r.text(), 'protected fixture');
  assert.equal(r.headers.get('cache-control'), 'private, no-store');
  assert.equal(calls[0].headers.get('authorization'), null);
});
test('academic pages remain public and origin receives no password', async () => {
  const {env, calls} = harness();
  const r = await handle(request('/linguistics.html', auth()), env, async req => {
    assert.equal(req.headers.get('authorization'), null); return new Response('academic');
  });
  assert.equal(await r.text(), 'academic'); assert.equal(calls.length, 0);
});
test('HTTP redirects before challenging or serving content', async () => {
  const {env, calls} = harness();
  const r = await handle(new Request('http://paolopignatelli.com/family-ai.html'), env);
  assert.equal(r.status, 308); assert.match(r.headers.get('location'), /^https:/); assert.equal(calls.length, 0);
});
test('asset misses never fall through to public origin; writes are refused', async () => {
  const {env} = harness(); env.ASSETS.fetch = async () => new Response('missing', {status:404});
  const origin = () => {throw new Error('origin must not run');};
  assert.equal((await handle(request('/family-agent-service/lib/agents.js', auth()), env, origin)).status, 404);
  assert.equal((await handle(request('/family-ai.html', auth(), 'POST'), env, origin)).status, 405);
});
