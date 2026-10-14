import {randomUUID} from 'node:crypto';
import {prepareLaunchOrder} from './launch-order.mjs';
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
/** Maps an approved synthetic launch request to the existing queue schema. No database I/O. */
export function toStagingQueueCandidate(input,{actor,tenantAuthorized=false,sourceApproved=false,capabilityApproved=false}={}){
  if(!tenantAuthorized||!sourceApproved||!capabilityApproved)throw Error('APPROVAL_REQUIRED');
  if(typeof actor!=='string'||!/^agent:[a-z0-9:_-]{3,100}$/.test(actor))throw Error('INVALID_ACTOR');
  if(!UUID.test(input?.tenant_id))throw Error('INVALID_TENANT_UUID');
  const {packet,hash}=prepareLaunchOrder(input);
  const missionId='WLE-SYNTHETIC-'+packet.idempotency_key;
  return Object.freeze({
    tenant_id:packet.tenant_id,
    work_packet_id:missionId,
    task_id:'synthetic-preview',
    requested_by:actor,
    action_class:'NON_PRODUCTION_MUTATION',
    required_capabilities:[{id:'sandbox.synthetic-preview',mechanism:'approved-template'}],
    payload:{kind:'WLE_SYNTHETIC_PREVIEW_V1',template_id:packet.template_id,release_mode:'preview_only',no_customer_data:true,requires_domain_purchase:false,uses_external_model:false,source_lock:packet.template_sha,packet_hash:hash},
    source_sha:packet.template_sha,
    idempotency_key:packet.idempotency_key,
    status:'BLOCKED',
    priority:0,
    max_attempts:1,
    approval_reference:'AWAITING_VERIFIED_ADAPTER_AND_WORKER_LEASE',
    mission_id:missionId,
    rollback_reference:'CLOSE_PR_1_NO_LIVE_CHANGES',
    dispatchable:false
  });
}
