<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<title>ITR Summary</title>

<style>

body{
    font-family: DejaVu Sans,sans-serif;
    font-size:13px;
    color:#222;
}

.container{
    width:100%;
}

.header{
    text-align:center;
    border-bottom:2px solid #2563eb;
    padding-bottom:15px;
    margin-bottom:20px;
}

.logo{
    font-size:28px;
    font-weight:bold;
    color:#2563eb;
}

.title{
    font-size:18px;
    margin-top:5px;
}

.section{
    margin-top:20px;
}

.section h3{
    background:#2563eb;
    color:white;
    padding:8px;
    margin:0;
}

table{
    width:100%;
    border-collapse:collapse;
}

td{
    border:1px solid #ddd;
    padding:8px;
}

.label{
    width:40%;
    font-weight:bold;
    background:#f8fafc;
}

.amount{
    text-align:right;
}

.total{
    background:#dbeafe;
    font-weight:bold;
}

.footer{
    margin-top:40px;
    text-align:center;
    font-size:11px;
    color:#666;
}

</style>

</head>

<body>

<div class="container">

<div class="header">

<div class="logo">
FinClears
</div>

<div class="title">
Income Tax Return Summary
</div>

</div>

<div class="section">

<h3>Personal Information</h3>

<table>

<tr>

<td class="label">Assessment Year</td>

<td>{{ $return->assessment_year }}</td>

</tr>

<tr>

<td class="label">Financial Year</td>

<td>{{ $return->financial_year }}</td>

</tr>

<tr>

<td class="label">Status</td>

<td>{{ $return->status }}</td>

</tr>

<tr>

<td class="label">Return Type</td>

<td>{{ $return->return_type }}</td>

</tr>

</table>

</div>
<div class="section">

<h3>Income Summary</h3>

<table>

<tr>
<td class="label">Gross Total Income</td>
<td class="amount">
₹ {{ number_format($return->gross_total_income ?? 0,2) }}
</td>
</tr>

<tr>
<td class="label">Taxable Income</td>
<td class="amount">
₹ {{ number_format($return->taxable_income ?? 0,2) }}
</td>
</tr>

<tr class="total">
<td>Total Income Considered</td>
<td class="amount">
₹ {{ number_format($return->gross_total_income ?? 0,2) }}
</td>
</tr>

</table>

</div>

<div class="section">

<h3>Deductions</h3>

<table>

<tr>

<td class="label">
Total Deductions
</td>

<td class="amount">
₹ {{ number_format($return->total_deductions ?? 0,2) }}
</td>

</tr>

<tr>

<td class="label">
Tax Regime
</td>

<td>
{{ $return->tax_regime }}
</td>

</tr>

</table>

</div>

<div class="section">

<h3>Tax Summary</h3>

<table>

<tr>

<td class="label">
Total Tax
</td>

<td class="amount">
₹ {{ number_format($return->total_tax ?? 0,2) }}
</td>

</tr>

<tr>

<td class="label">
Refund Amount
</td>

<td class="amount">
₹ {{ number_format($return->refund_amount ?? 0,2) }}
</td>

</tr>

<tr class="total">

<td>
Net Tax Payable
</td>

<td class="amount">
₹ {{ number_format($return->tax_payable ?? 0,2) }}
</td>

</tr>

</table>

</div>
<div class="section">

<h3>Payment Details</h3>

<table>

<tr>

<td class="label">
Payment Status
</td>

<td>
{{ optional($return->payments->first())->payment_status ?? 'Pending' }}
</td>

</tr>

<tr>

<td class="label">
Amount Paid
</td>

<td class="amount">
₹ {{ number_format(optional($return->payments->first())->amount ?? 0,2) }}
</td>

</tr>

<tr>

<td class="label">
Payment Date
</td>

<td>
{{ optional($return->payments->first())->paid_at ?? '-' }}
</td>

</tr>

</table>

</div>

<div class="section">

<h3>Return Information</h3>

<table>

<tr>

<td class="label">
Return UUID
</td>

<td>
{{ $return->uuid }}
</td>

</tr>

<tr>

<td class="label">
Generated On
</td>

<td>
{{ now()->format('d M Y h:i A') }}
</td>

</tr>

<tr>

<td class="label">
Acknowledgement
</td>

<td>
{{ $return->acknowledgement_number ?? 'Pending' }}
</td>

</tr>

</table>

</div>

<div class="footer">

<strong>FinClears</strong><br>

Income Tax Return Summary Report

<br><br>

This document is system generated and does not require a signature.

<br><br>

Generated on {{ now()->format('d M Y h:i A') }}

</div>

</div>

</body>

</html>