
import test from 'node:test';import assert from 'node:assert/strict';import{auth,parsePacket,draftReceipt}from '../src/contract.mjs';
const p={action:'pack.submit',tenant_id:'staging-tenant',project_id:'staging-project',idempotency_key:'sample-001',payload:{template:'existing-approved'}};
test('draft never enqueues',()=>{const r=draftReceipt(parsePacket(p));assert.equal(r.queued,false);assert.equal(r.executed,false);});
test('auth fails closed',()=>{assert.equal(auth('Bearer bad',null),false);assert.equal(auth('Bearer good','good'),true);});
test('rejects protected action',()=>assert.throws(()=>parsePacket({...p,release_requested:true}),/PROTECTED_ACTION/));
test('rejects unknown action',()=>assert.throws(()=>parsePacket({...p,action:'deploy.production'}),/INVALID_ACTION/));
test('rejects missing tenant',()=>assert.throws(()=>parsePacket({...p,tenant_id:''}),/INVALID_TENANT_ID/));