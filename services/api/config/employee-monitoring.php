<?php

return [
    'policy_version' => 'v2',
    'timezone' => 'Asia/Kolkata',
    'policy_approved' => true,

    'approval_authority' => 'Management',
    'approval_date' => '2026-11-14',
    'effective_date' => '2026-11-14',

    'policy_text' => <<<'POLICY'
FINCLEARS
EMPLOYEE MONITORING AND PRIVACY POLICY
Version 2.0
Approval authority: Management
Approval date: 14-11-2026
Effective date: 14-11-2026

1. PURPOSE AND SCOPE

This policy governs transparent employee presence monitoring, Camera/Microphone access and screen sharing through the FinClears Employee Portal. It applies to employees and authorized administrators using the monitoring system.

Covert monitoring, bypassing browser security controls and hiding browser indicators are prohibited.

2. DAILY CONSENT

- Employees must review and accept the published policy during their first login on each working day.
- Consent is recorded against the policy version, employee and IST work date.
- Logging in again on the same work date does not require repeated daily policy acceptance while consent remains valid.
- Declining or withdrawing consent restricts access to protected Employee Portal features.
- A material policy revision may require fresh consent.

3. CAMERA AND MICROPHONE

- Camera and microphone permissions are requested through the browser's native permission interface during the daily onboarding flow, following a clear employee action.
- Daily policy consent and browser device permission are separate requirements.
- After valid daily consent and required browser permissions, an authorized administrator may initiate an on-demand Camera/Microphone monitoring session without a repeated application-level acceptance prompt for every session.
- Access must remain subject to browser security rules, device availability, role-based authorization and technical browser limitations.
- The application must clearly indicate when Camera/Microphone monitoring is active.
- Browser-native camera and microphone indicators must remain visible.
- The application must provide a clear way to identify and stop an active monitoring session.
- Browser permission does not itself authorize audio/video recording. Recording remains disabled unless separately approved.

4. PERMISSION REVOCATION

When the application can reliably establish that a required Camera or Microphone permission has genuinely been revoked:

1. Stop the affected active monitoring stream.
2. Notify the employee.
3. Revoke the employee's active server-side authentication token.
4. Log the employee out of the Employee Portal.
5. Record the event and reason in the monitoring audit log.

Permission revocation must be distinguished from temporary technical failures. Browser support and permission-change detection timing may vary. The application must not claim immediate detection where the browser does not provide it.

5. TEMPORARY TECHNICAL FAILURES

The following events alone must not trigger automatic employee logout:

- Camera or microphone device temporarily unavailable.
- Device disconnection or hardware malfunction.
- Temporary browser or operating-system error.
- Network interruption or WebRTC connection failure.
- Temporary backend or service outage.

The application must show an appropriate error and provide a retry or recovery option where possible. A technical failure alone must not be treated as employee misconduct.

6. SCREEN SHARING

- Screen sharing is separate from Camera/Microphone permission and daily policy consent.
- Every new screen-sharing session requires a fresh employee action.
- The employee must select a screen, application window or browser tab using the browser's native screen-sharing picker.
- The application must never bypass the picker or silently restart screen sharing.
- Employees may stop screen sharing at any time.
- Stopping screen sharing alone ends only that sharing session and does not automatically log the employee out.
- Screen-sharing status and browser indicators must remain visible.

7. ADMINISTRATOR AUTHORIZATION AND AUDIT

- Only authorized administrators with appropriate monitoring permissions may initiate or manage monitoring sessions.
- Employee access must be limited by role and organizational scope.
- The system must record relevant consent, session request, start, stop, cancellation, permission-revocation, logout and technical-failure events.
- Monitoring must be used only for legitimate business purposes.
- Unauthorized access and attempts to bypass employee-facing controls are prohibited.

8. RECORDING, STORAGE AND DATA PROTECTION

- Audio/video recording and screen recording remain disabled by default.
- Browser permission or a live monitoring session must not automatically enable recording.
- Any future recording or storage feature requires a separately documented purpose, appropriate authorization, access restrictions and approved retention arrangements.
- Monitoring data must be accessible only to authorized personnel and protected against unauthorized access, alteration, disclosure or deletion.
- Retention periods and deletion procedures require formal management approval and applicable legal review.

9. EMPLOYEE SUPPORT AND RIGHTS

Employees may review the published policy, accept or decline it, withdraw consent, stop an individual screen-sharing session, raise privacy concerns and contact HR or IT for assistance.

10. POLICY CHANGES AND APPROVAL

This policy is approved by Management and effective from 14-11-2026.
POLICY
,

    'retention_period' => 'To be confirmed after management approval and applicable legal review',
    'support_contact' => null,
];
