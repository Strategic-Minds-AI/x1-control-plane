/** Fail-closed preflight for the existing X1 enqueue RPC. Never sends the RPC itself. */
export function authorizeStagingSubmission(candidate, proof){
  if(!candidate||candidate.status!=='BLOCKED'||candidate.dispatchable!==false)throw Error('CANDIDATE_MISMATCH');
  if(!proof||typeof proof!=='object')throw Error('SUBMISSION_PROOF_REQUIRED');
  for(const key of ['tenantMatch','actorAuthorized','sourceVerified','workerRegistered','workerCredentialBound','controllerAllowsLease','independentValidatorReady','idempotencyAvailable']){
    if(proof[key]!==true)throw Error('SUBMISSION_GATE_'+key.toUpperCase());
  }
  if(!['preview','development'].includes(proof.environment))throw Error('NON_PRODUCTION_ONLY');
  if(typeof proof.workerId!=='string'||proof.workerId.length<3)throw Error('WORKER_ID_REQUIRED');
  if(candidate.payload.release_mode!=='preview_only'||candidate.payload.no_customer_data!==true||candidate.payload.requires_domain_purchase!==false)throw Error('UNSAFE_PAYLOAD');
  const {dispatchable,status,...work}=candidate;
  return Object.freeze({...work,approval_reference:proof.approvalReference??'STAGING_CANARY_ONLY'});
}
