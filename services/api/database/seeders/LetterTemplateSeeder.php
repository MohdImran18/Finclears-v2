<?php

namespace Database\Seeders;

use App\Models\LetterTemplate;
use Illuminate\Database\Seeder;

class LetterTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [

            [
                'name' => 'Offer Letter',
                'code' => 'OFFER_LETTER',
                'letter_type' => 'offer',
                'subject' => 'Offer of Employment',
                'content' => <<<'HTML'
<p>Date: {{letter_date}}</p>

<p>Dear {{employee_name}},</p>

<p>We are pleased to offer you the position of <strong>{{designation}}</strong> in the <strong>{{department}}</strong> department at {{company_name}}.</p>

<p>Your proposed date of joining is {{joining_date}} and your work location will be {{work_location}}.</p>

<p>Your compensation will be as communicated by the Company and applicable to your employment.</p>

<p>We look forward to having you join our team.</p>

<p>Sincerely,<br>{{authorized_person}}<br>{{authorized_designation}}<br>{{company_name}}</p>
HTML
                ,
                'fields' => [
                    ['key' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'employee_code', 'label' => 'Employee Code', 'type' => 'text', 'source' => 'employee', 'required' => false],
                    ['key' => 'designation', 'label' => 'Designation', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'department', 'label' => 'Department', 'type' => 'text', 'source' => 'employee', 'required' => false],
                    ['key' => 'joining_date', 'label' => 'Joining Date', 'type' => 'date', 'source' => 'employee', 'required' => true],
                    ['key' => 'work_location', 'label' => 'Work Location', 'type' => 'text', 'source' => 'employee', 'required' => false],
                    ['key' => 'letter_date', 'label' => 'Letter Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'company_name', 'label' => 'Company Name', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_person', 'label' => 'Authorized Person', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_designation', 'label' => 'Authorized Designation', 'type' => 'text', 'source' => 'company', 'required' => true],
                ],
            ],

            [
                'name' => 'Appointment Letter',
                'code' => 'APPOINTMENT_LETTER',
                'letter_type' => 'appointment',
                'subject' => 'Appointment Letter',
                'content' => '<p>Date: {{letter_date}}</p><p>Dear {{employee_name}},</p><p>We are pleased to formally appoint you as <strong>{{designation}}</strong> in the <strong>{{department}}</strong> department of {{company_name}}, effective {{effective_date}}.</p><p>Your employment will be governed by the terms and conditions applicable to your role.</p><p>Sincerely,<br>{{authorized_person}}<br>{{authorized_designation}}</p>',
                'fields' => [
                    ['key' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'designation', 'label' => 'Designation', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'department', 'label' => 'Department', 'type' => 'text', 'source' => 'employee', 'required' => false],
                    ['key' => 'effective_date', 'label' => 'Effective Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'letter_date', 'label' => 'Letter Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'company_name', 'label' => 'Company Name', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_person', 'label' => 'Authorized Person', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_designation', 'label' => 'Authorized Designation', 'type' => 'text', 'source' => 'company', 'required' => true],
                ],
            ],

            [
                'name' => 'Joining Letter',
                'code' => 'JOINING_LETTER',
                'letter_type' => 'joining',
                'subject' => 'Joining Letter',
                'content' => '<p>Date: {{letter_date}}</p><p>Dear {{employee_name}},</p><p>This letter confirms your joining with {{company_name}} as <strong>{{designation}}</strong> in the <strong>{{department}}</strong> department.</p><p>Your date of joining is {{joining_date}}.</p><p>We welcome you to the organization.</p><p>Sincerely,<br>{{authorized_person}}</p>',
                'fields' => [
                    ['key' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'employee_code', 'label' => 'Employee Code', 'type' => 'text', 'source' => 'employee', 'required' => false],
                    ['key' => 'designation', 'label' => 'Designation', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'department', 'label' => 'Department', 'type' => 'text', 'source' => 'employee', 'required' => false],
                    ['key' => 'joining_date', 'label' => 'Joining Date', 'type' => 'date', 'source' => 'employee', 'required' => true],
                    ['key' => 'letter_date', 'label' => 'Letter Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'company_name', 'label' => 'Company Name', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_person', 'label' => 'Authorized Person', 'type' => 'text', 'source' => 'company', 'required' => true],
                ],
            ],

            [
                'name' => 'Confirmation Letter',
                'code' => 'CONFIRMATION_LETTER',
                'letter_type' => 'confirmation',
                'subject' => 'Employment Confirmation',
                'content' => '<p>Date: {{letter_date}}</p><p>Dear {{employee_name}},</p><p>We are pleased to confirm your employment with {{company_name}} as <strong>{{designation}}</strong>, effective {{effective_date}}.</p><p>We appreciate your contribution and look forward to your continued association with the organization.</p><p>Sincerely,<br>{{authorized_person}}<br>{{authorized_designation}}</p>',
                'fields' => [
                    ['key' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'designation', 'label' => 'Designation', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'effective_date', 'label' => 'Confirmation Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'letter_date', 'label' => 'Letter Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'company_name', 'label' => 'Company Name', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_person', 'label' => 'Authorized Person', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_designation', 'label' => 'Authorized Designation', 'type' => 'text', 'source' => 'company', 'required' => false],
                ],
            ],

            [
                'name' => 'Salary Revision Letter',
                'code' => 'SALARY_REVISION',
                'letter_type' => 'salary_revision',
                'subject' => 'Salary Revision Letter',
                'content' => '<p>Date: {{letter_date}}</p><p>Dear {{employee_name}},</p><p>We are pleased to inform you that your compensation has been revised effective {{effective_date}}.</p><p>Previous Annual CTC: {{previous_ctc}}</p><p>Revised Annual CTC: {{revised_ctc}}</p><p>We appreciate your contribution to {{company_name}}.</p><p>Sincerely,<br>{{authorized_person}}</p>',
                'fields' => [
                    ['key' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'designation', 'label' => 'Designation', 'type' => 'text', 'source' => 'employee', 'required' => false],
                    ['key' => 'previous_ctc', 'label' => 'Previous Annual CTC', 'type' => 'number', 'source' => 'manual', 'required' => true],
                    ['key' => 'revised_ctc', 'label' => 'Revised Annual CTC', 'type' => 'number', 'source' => 'manual', 'required' => true],
                    ['key' => 'effective_date', 'label' => 'Effective Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'letter_date', 'label' => 'Letter Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'company_name', 'label' => 'Company Name', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_person', 'label' => 'Authorized Person', 'type' => 'text', 'source' => 'company', 'required' => true],
                ],
            ],

            [
                'name' => 'Promotion Letter',
                'code' => 'PROMOTION_LETTER',
                'letter_type' => 'promotion',
                'subject' => 'Promotion Letter',
                'content' => '<p>Date: {{letter_date}}</p><p>Dear {{employee_name}},</p><p>We are pleased to inform you of your promotion from <strong>{{previous_designation}}</strong> to <strong>{{new_designation}}</strong>, effective {{effective_date}}.</p><p>We congratulate you and wish you continued success.</p><p>Sincerely,<br>{{authorized_person}}</p>',
                'fields' => [
                    ['key' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'previous_designation', 'label' => 'Previous Designation', 'type' => 'text', 'source' => 'manual', 'required' => true],
                    ['key' => 'new_designation', 'label' => 'New Designation', 'type' => 'text', 'source' => 'manual', 'required' => true],
                    ['key' => 'effective_date', 'label' => 'Effective Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'letter_date', 'label' => 'Letter Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'company_name', 'label' => 'Company Name', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_person', 'label' => 'Authorized Person', 'type' => 'text', 'source' => 'company', 'required' => true],
                ],
            ],

            [
                'name' => 'Warning Letter',
                'code' => 'WARNING_LETTER',
                'letter_type' => 'warning',
                'subject' => 'Warning Letter',
                'content' => '<p>Date: {{letter_date}}</p><p>Dear {{employee_name}},</p><p>This letter serves as a formal warning regarding <strong>{{warning_reason}}</strong>.</p><p>Incident Date: {{incident_date}}</p><p>{{incident_description}}</p><p>You are expected to demonstrate immediate and sustained improvement. Required improvement: {{expected_improvement}}.</p><p>Failure to improve may result in further disciplinary action.</p><p>Sincerely,<br>{{authorized_person}}</p>',
                'fields' => [
                    ['key' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'employee_code', 'label' => 'Employee Code', 'type' => 'text', 'source' => 'employee', 'required' => false],
                    ['key' => 'designation', 'label' => 'Designation', 'type' => 'text', 'source' => 'employee', 'required' => false],
                    ['key' => 'warning_reason', 'label' => 'Warning Reason', 'type' => 'textarea', 'source' => 'manual', 'required' => true],
                    ['key' => 'incident_date', 'label' => 'Incident Date', 'type' => 'date', 'source' => 'manual', 'required' => true],
                    ['key' => 'incident_description', 'label' => 'Incident Description', 'type' => 'textarea', 'source' => 'manual', 'required' => true],
                    ['key' => 'expected_improvement', 'label' => 'Expected Improvement', 'type' => 'textarea', 'source' => 'manual', 'required' => true],
                    ['key' => 'letter_date', 'label' => 'Letter Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'company_name', 'label' => 'Company Name', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_person', 'label' => 'Authorized Person', 'type' => 'text', 'source' => 'company', 'required' => true],
                ],
            ],

            [
                'name' => 'Performance Improvement Plan',
                'code' => 'PIP_LETTER',
                'letter_type' => 'pip',
                'subject' => 'Performance Improvement Plan',
                'content' => '<p>Date: {{letter_date}}</p><p>Dear {{employee_name}},</p><p>This Performance Improvement Plan is being issued to address identified performance concerns.</p><p><strong>PIP Period:</strong> {{pip_start_date}} to {{pip_end_date}}</p><p><strong>Performance Concern:</strong> {{performance_concern}}</p><p><strong>Performance Metrics:</strong> {{performance_metrics}}</p><p><strong>Expected Target:</strong> {{expected_target}}</p><p><strong>Improvement Actions:</strong> {{improvement_actions}}</p><p><strong>Review Date:</strong> {{review_date}}</p><p>Your progress will be reviewed during the PIP period.</p><p>Sincerely,<br>{{authorized_person}}</p>',
                'fields' => [
                    ['key' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'designation', 'label' => 'Designation', 'type' => 'text', 'source' => 'employee', 'required' => false],
                    ['key' => 'pip_start_date', 'label' => 'PIP Start Date', 'type' => 'date', 'source' => 'manual', 'required' => true],
                    ['key' => 'pip_end_date', 'label' => 'PIP End Date', 'type' => 'date', 'source' => 'manual', 'required' => true],
                    ['key' => 'performance_concern', 'label' => 'Performance Concern', 'type' => 'textarea', 'source' => 'manual', 'required' => true],
                    ['key' => 'performance_metrics', 'label' => 'Performance Metrics', 'type' => 'textarea', 'source' => 'manual', 'required' => true],
                    ['key' => 'expected_target', 'label' => 'Expected Target', 'type' => 'textarea', 'source' => 'manual', 'required' => true],
                    ['key' => 'improvement_actions', 'label' => 'Improvement Actions', 'type' => 'textarea', 'source' => 'manual', 'required' => true],
                    ['key' => 'review_date', 'label' => 'Review Date', 'type' => 'date', 'source' => 'manual', 'required' => true],
                    ['key' => 'letter_date', 'label' => 'Letter Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'company_name', 'label' => 'Company Name', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_person', 'label' => 'Authorized Person', 'type' => 'text', 'source' => 'company', 'required' => true],
                ],
            ],

            [
                'name' => 'Show Cause Notice',
                'code' => 'SHOW_CAUSE_NOTICE',
                'letter_type' => 'show_cause',
                'subject' => 'Show Cause Notice',
                'content' => '<p>Date: {{letter_date}}</p><p>Dear {{employee_name}},</p><p>You are required to show cause regarding the following matter: <strong>{{reason}}</strong>.</p><p>Incident Date: {{incident_date}}</p><p>{{incident_description}}</p><p>Please submit your explanation by {{response_deadline}}.</p><p>Sincerely,<br>{{authorized_person}}</p>',
                'fields' => [
                    ['key' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'reason', 'label' => 'Reason', 'type' => 'textarea', 'source' => 'manual', 'required' => true],
                    ['key' => 'incident_date', 'label' => 'Incident Date', 'type' => 'date', 'source' => 'manual', 'required' => true],
                    ['key' => 'incident_description', 'label' => 'Incident Description', 'type' => 'textarea', 'source' => 'manual', 'required' => true],
                    ['key' => 'response_deadline', 'label' => 'Response Deadline', 'type' => 'date', 'source' => 'manual', 'required' => true],
                    ['key' => 'letter_date', 'label' => 'Letter Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'company_name', 'label' => 'Company Name', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_person', 'label' => 'Authorized Person', 'type' => 'text', 'source' => 'company', 'required' => true],
                ],
            ],

            [
                'name' => 'Termination Letter',
                'code' => 'TERMINATION_LETTER',
                'letter_type' => 'termination',
                'subject' => 'Termination of Employment',
                'content' => '<p>Date: {{letter_date}}</p><p>Dear {{employee_name}},</p><p>This letter is to formally inform you that your employment with {{company_name}} will terminate effective {{termination_date}}.</p><p><strong>Reason:</strong> {{termination_reason}}</p><p><strong>Last Working Date:</strong> {{last_working_date}}</p><p><strong>Notice Period:</strong> {{notice_period}}</p><p>Please complete the applicable exit and clearance formalities.</p><p>Sincerely,<br>{{authorized_person}}</p>',
                'fields' => [
                    ['key' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'employee_code', 'label' => 'Employee Code', 'type' => 'text', 'source' => 'employee', 'required' => false],
                    ['key' => 'designation', 'label' => 'Designation', 'type' => 'text', 'source' => 'employee', 'required' => false],
                    ['key' => 'termination_reason', 'label' => 'Termination Reason', 'type' => 'textarea', 'source' => 'manual', 'required' => true],
                    ['key' => 'termination_date', 'label' => 'Termination Date', 'type' => 'date', 'source' => 'manual', 'required' => true],
                    ['key' => 'last_working_date', 'label' => 'Last Working Date', 'type' => 'date', 'source' => 'manual', 'required' => true],
                    ['key' => 'notice_period', 'label' => 'Notice Period', 'type' => 'text', 'source' => 'manual', 'required' => false],
                    ['key' => 'letter_date', 'label' => 'Letter Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'company_name', 'label' => 'Company Name', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_person', 'label' => 'Authorized Person', 'type' => 'text', 'source' => 'company', 'required' => true],
                ],
            ],

            [
                'name' => 'Resignation Acceptance Letter',
                'code' => 'RESIGNATION_ACCEPTANCE',
                'letter_type' => 'resignation_acceptance',
                'subject' => 'Resignation Acceptance',
                'content' => '<p>Date: {{letter_date}}</p><p>Dear {{employee_name}},</p><p>We acknowledge and accept your resignation from the position of <strong>{{designation}}</strong> at {{company_name}}.</p><p>Your last working date will be {{last_working_date}}.</p><p>We thank you for your contribution and wish you success in your future endeavors.</p><p>Sincerely,<br>{{authorized_person}}</p>',
                'fields' => [
                    ['key' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'designation', 'label' => 'Designation', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'last_working_date', 'label' => 'Last Working Date', 'type' => 'date', 'source' => 'manual', 'required' => true],
                    ['key' => 'letter_date', 'label' => 'Letter Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'company_name', 'label' => 'Company Name', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_person', 'label' => 'Authorized Person', 'type' => 'text', 'source' => 'company', 'required' => true],
                ],
            ],

            [
                'name' => 'Relieving Letter',
                'code' => 'RELIEVING_LETTER',
                'letter_type' => 'relieving',
                'subject' => 'Relieving Letter',
                'content' => '<p>Date: {{letter_date}}</p><p>To Whom It May Concern,</p><p>This is to certify that <strong>{{employee_name}}</strong>, Employee Code {{employee_code}}, was employed with {{company_name}} as <strong>{{designation}}</strong>.</p><p>The employee has been relieved from services effective {{last_working_date}} after completion of the applicable formalities.</p><p>We wish them all the best.</p><p>Sincerely,<br>{{authorized_person}}</p>',
                'fields' => [
                    ['key' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'employee_code', 'label' => 'Employee Code', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'designation', 'label' => 'Designation', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'joining_date', 'label' => 'Joining Date', 'type' => 'date', 'source' => 'employee', 'required' => false],
                    ['key' => 'last_working_date', 'label' => 'Last Working Date', 'type' => 'date', 'source' => 'manual', 'required' => true],
                    ['key' => 'letter_date', 'label' => 'Letter Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'company_name', 'label' => 'Company Name', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_person', 'label' => 'Authorized Person', 'type' => 'text', 'source' => 'company', 'required' => true],
                ],
            ],

            [
                'name' => 'Experience Certificate',
                'code' => 'EXPERIENCE_CERTIFICATE',
                'letter_type' => 'experience',
                'subject' => 'Experience Certificate',
                'content' => '<p>Date: {{letter_date}}</p><p>To Whom It May Concern,</p><p>This is to certify that <strong>{{employee_name}}</strong> was employed with {{company_name}} as <strong>{{designation}}</strong> from {{joining_date}} to {{last_working_date}}.</p><p>During the period of employment, the employee was associated with the organization in the above capacity.</p><p>We wish them success in their future endeavors.</p><p>Sincerely,<br>{{authorized_person}}</p>',
                'fields' => [
                    ['key' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'employee_code', 'label' => 'Employee Code', 'type' => 'text', 'source' => 'employee', 'required' => false],
                    ['key' => 'designation', 'label' => 'Designation', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'joining_date', 'label' => 'Joining Date', 'type' => 'date', 'source' => 'employee', 'required' => true],
                    ['key' => 'last_working_date', 'label' => 'Last Working Date', 'type' => 'date', 'source' => 'manual', 'required' => true],
                    ['key' => 'letter_date', 'label' => 'Letter Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'company_name', 'label' => 'Company Name', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_person', 'label' => 'Authorized Person', 'type' => 'text', 'source' => 'company', 'required' => true],
                ],
            ],

            [
                'name' => 'Employment Certificate',
                'code' => 'EMPLOYMENT_CERTIFICATE',
                'letter_type' => 'employment',
                'subject' => 'Employment Certificate',
                'content' => '<p>Date: {{letter_date}}</p><p>To Whom It May Concern,</p><p>This is to certify that <strong>{{employee_name}}</strong> is employed with {{company_name}} as <strong>{{designation}}</strong> in the <strong>{{department}}</strong> department.</p><p>Date of Joining: {{joining_date}}</p><p>Work Location: {{work_location}}</p><p>This certificate is issued upon request.</p><p>Sincerely,<br>{{authorized_person}}</p>',
                'fields' => [
                    ['key' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'employee_code', 'label' => 'Employee Code', 'type' => 'text', 'source' => 'employee', 'required' => false],
                    ['key' => 'designation', 'label' => 'Designation', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'department', 'label' => 'Department', 'type' => 'text', 'source' => 'employee', 'required' => false],
                    ['key' => 'joining_date', 'label' => 'Joining Date', 'type' => 'date', 'source' => 'employee', 'required' => true],
                    ['key' => 'work_location', 'label' => 'Work Location', 'type' => 'text', 'source' => 'employee', 'required' => false],
                    ['key' => 'letter_date', 'label' => 'Letter Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'company_name', 'label' => 'Company Name', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_person', 'label' => 'Authorized Person', 'type' => 'text', 'source' => 'company', 'required' => true],
                ],
            ],

            [
                'name' => 'No Objection Certificate',
                'code' => 'NOC',
                'letter_type' => 'noc',
                'subject' => 'No Objection Certificate',
                'content' => '<p>Date: {{letter_date}}</p><p>To Whom It May Concern,</p><p>This is to certify that {{company_name}} has no objection to <strong>{{employee_name}}</strong>, Employee Code {{employee_code}}, currently employed as <strong>{{designation}}</strong>, for the purpose stated below.</p><p><strong>Purpose:</strong> {{purpose}}</p><p>This certificate is issued upon request.</p><p>Sincerely,<br>{{authorized_person}}<br>{{authorized_designation}}</p>',
                'fields' => [
                    ['key' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'employee_code', 'label' => 'Employee Code', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'designation', 'label' => 'Designation', 'type' => 'text', 'source' => 'employee', 'required' => true],
                    ['key' => 'purpose', 'label' => 'Purpose', 'type' => 'textarea', 'source' => 'manual', 'required' => true],
                    ['key' => 'letter_date', 'label' => 'Letter Date', 'type' => 'date', 'source' => 'system', 'required' => true],
                    ['key' => 'company_name', 'label' => 'Company Name', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_person', 'label' => 'Authorized Person', 'type' => 'text', 'source' => 'company', 'required' => true],
                    ['key' => 'authorized_designation', 'label' => 'Authorized Designation', 'type' => 'text', 'source' => 'company', 'required' => false],
                ],
            ],
        ];

        foreach ($templates as $templateData) {
            $fields = $templateData['fields'];
            unset($templateData['fields']);

            $template = LetterTemplate::updateOrCreate(
                ['code' => $templateData['code']],
                [
                    ...$templateData,
                    'language' => 'en',
                    'is_active' => true,
                    'is_default' => true,
                    'version' => 1,
                ]
            );

            foreach ($fields as $index => $field) {
                $template->fields()->updateOrCreate(
                    ['field_key' => $field['key']],
                    [
                        'field_label' => $field['label'],
                        'field_type' => $field['type'],
                        'source' => $field['source'],
                        'is_required' => $field['required'],
                        'is_active' => true,
                        'display_order' => $index + 1,
                    ]
                );
            }
        }
    }
}
