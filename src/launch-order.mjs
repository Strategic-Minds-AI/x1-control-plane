import {createHash} from 'node:crypto';
const TEMPLATE_IDS=new Set(['roofing-synthetic-v1']);
export function prepareLaunchOrder(input){
  if(!input||typeof input!=='object'||Array.isArray(input))throw Error('INVALID_ORDER');
  const {tenant_id,project_id,template_id,template_sha,idempotency_key}=input;
  for(const [name,val] of Object.entries({tenant_id,project_id,idempotency_key})){
    if(typeof val!=='string'||!val.match(/^[a-zA-Z0-9][a-zA-Z0-9_-]{2,119}$/))throw Error('INVALID_'+name.toUpperCase());
  }
  if(!TEMPLATE_IDS.has(template_id))throw Error('TEMPLATE_NOT_APPROVED');
  if(typeof template_sha!=='string'||!/^[0-9a-f]{40}$/.test(template_sha))throw Error('INVALID_SOURCE_SHA');
  if(input.production||input.publish||input.customer_data)throw Error('PROTECTED_ACTION');
  const packet={schema:'x1.launch-order.v1',tenant_id,project_id,template_id,template_sha,idempotency_key,release_mode:'preview_only',noindex:true,fictional:true,requested_capability:'sandbox.synthetic-preview',approval_state:'PENDING_REVIEW'};
  return {packet,hash:createHash('sha256').update(JSON.stringify(packet)).digest('hex'),queued:false,executed:false,validated:false};
}
