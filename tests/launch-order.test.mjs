import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareLaunchOrder} from '../src/launch-order.mjs';
const valid={tenant_id:'tenant123',project_id:'project123',template_id:'roofing-synthetic-v1',template_sha:'a'.repeat(40),idempotency_key:'test-001'};
test('accepted synthetic template is preview-only and never queued',()=>{const r=prepareLaunchOrder(valid);assert.equal(r.queued,false);assert.equal(r.packet.noindex,true);assert.equal(r.packet.approval_state,'PENDING_REVIEW');});
test('unapproved templates fail closed',()=>assert.throws(()=>prepareLaunchOrder({...valid,template_id:'arbitrary-city-site'}),/TEMPLATE_NOT_APPROVED/));
test('production intent fails closed',()=>assert.throws(()=>prepareLaunchOrder({...valid,production:true}),/PROTECTED_ACTION/));
test('source SHA required',()=>assert.throws(()=>prepareLaunchOrder({...valid,template_sha:'unknown'}),/INVALID_SOURCE_SHA/));
test('idempotency required',()=>assert.throws(()=>prepareLaunchOrder({...valid,idempotency_key:''}),/INVALID_IDEMPOTENCY_KEY/));
