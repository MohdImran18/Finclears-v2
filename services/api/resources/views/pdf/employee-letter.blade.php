<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <style>
        @page {
            margin: 28mm 22mm 25mm 22mm;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11pt;
            line-height: 1.65;
            color: #222;
        }

        .header {
            text-align: center;
            margin-bottom: 25px;
        }

        .company-name {
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 4px;
        }

        .company-address {
            font-size: 9pt;
            color: #555;
        }

        .meta {
            width: 100%;
            margin-bottom: 25px;
            font-size: 10pt;
        }

        .meta td {
            padding: 3px 0;
        }

        .meta .right {
            text-align: right;
        }

        .subject {
            font-weight: bold;
            margin: 18px 0;
        }

        .content {
            text-align: justify;
        }

        .content p {
            margin: 0 0 12px 0;
        }

        .content table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }

        .content th,
        .content td {
            border: 1px solid #999;
            padding: 7px;
            text-align: left;
        }

        .signature {
            margin-top: 45px;
        }

        .footer {
            position: fixed;
            bottom: -12mm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8pt;
            color: #777;
        }

        .letter-number {
            font-size: 9pt;
            color: #555;
        }
    </style>
</head>

<body>

    <div class="header">
        <div class="company-name">
            {{ $companyName ?? config('app.name') }}
        </div>

        @if(!empty($companyAddress))
            <div class="company-address">
                {{ $companyAddress }}
            </div>
        @endif
    </div>

    <table class="meta">
        <tr>
            <td>
                <strong>Date:</strong>
                {{ $letter->letter_date?->format('d F Y') }}
            </td>

            <td class="right">
                @if($letter->letter_number)
                    <span class="letter-number">
                        <strong>Letter No:</strong>
                        {{ $letter->letter_number }}
                    </span>
                @endif
            </td>
        </tr>
    </table>

    <div>
        <strong>To,</strong><br>

        {{ $letter->employeeProfile?->user?->name ?? 'Employee' }}<br>

        @if($letter->employeeProfile?->designation?->name)
            {{ $letter->employeeProfile->designation->name }}<br>
        @endif

        @if($letter->employeeProfile?->department?->name)
            {{ $letter->employeeProfile->department->name }}
        @endif
    </div>

    @if($letter->title)
        <div class="subject">
            Subject: {{ $letter->title }}
        </div>
    @endif

    <div class="content">
        {!! $renderedContent !!}
    </div>

    <div class="signature">
        <strong>For {{ $companyName ?? config('app.name') }}</strong>

        <br><br><br>

        Authorized Signatory
    </div>

    <div class="footer">
        {{ $companyName ?? config('app.name') }}
        @if($letter->letter_number)
            &nbsp; | &nbsp; {{ $letter->letter_number }}
        @endif
    </div>

</body>
</html>
