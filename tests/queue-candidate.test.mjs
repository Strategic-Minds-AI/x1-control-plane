import test from 'node:test';import assert from 'node:assert/strict';import{toStagingQueueCandidate}from '../src/queue-candidate.mjs';
const packet={tenant_id:'666f23bf-61bd-4be0-b5cb-4872e04fad9b',project_id:'test-project',template_id:'roofing-synthetic-v1',template_sha:'a'.repeat(40),idempotency_key:'canary-001'};
const scope={actor:'agent:x1:operator',tenantAuthorized:true,sourceApproved:true,capabilityApproved:true};
test('maps to existing queue column names but remains blocked',()=>{const p=toStagingQueueCandidate(packet,scope);assert.equal(p.status,'BLOCKED');assert.equal(p.dispatchable,false);assert.equal(p.action_class,'NON_PRODUCTION_MUTATION');assert.equal(p.payload.release_mode,'preview_only');});
test('tenant scope must be explicitly authorized',()=>assert.throws(()=>toStagingQueueCandidate(packet,{...scope,tenantAuthorized:false}),/APPROVAL_REQUIRED/));
test('capability proof required',()=>assert.throws(()=>toStagingQueueCandidate(packet,{...scope,capabilityApproved:false}),/APPROVAL_REQUIRED/));
test('source approval required',()=>assert.throws(()=>toStagingQueueCandidate(packet,{...scope,sourceApproved:false}),/APPROVAL_REQUIRED/));
test('tenant ID must match existing UUID grain',()=>assert.throws(()=>toStagingQueueCandidate({...packet,tenant_id:'arbitrary'},scope),/INVALID_TENANT_UUID/));
