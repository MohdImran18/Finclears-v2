<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4 portrait;
            margin: 48mm 22mm 48mm 22mm;
        }

        html, body {
            margin: 0;
            padding: 0;
            font-family: DejaVu Sans, sans-serif;
            font-size: 10pt;
            line-height: 1.45;
            color: #222;
        }

        .letterhead-background {
            position: fixed;
            top: -48mm;
            left: -22mm;
            width: 210mm;
            height: 297mm;
            z-index: -1000;
        }

        .letter-content {
            position: relative;
            z-index: 1;
        }

        .meta {
            width: 100%;
            margin-bottom: 18px;
            font-size: 9pt;
            border-collapse: collapse;
        }

        .meta td {
            padding: 3px 0;
            vertical-align: top;
        }

        .meta .right {
            text-align: right;
        }

        .recipient {
            margin-bottom: 14px;
        }

        .subject {
            font-weight: bold;
            margin: 14px 0;
        }

        .content {
            text-align: justify;
        }

        .content p {
            margin: 0 0 10px 0;
        }

        .content table {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
        }

        .content th,
        .content td {
            border: 1px solid #999;
            padding: 6px;
            text-align: left;
        }

        .content th {
            background: #548dcc;
            color: #fff;
        }

        .signature {
            margin-top: 30px;
            page-break-inside: avoid;
        }

        .letter-number {
            font-size: 9pt;
            color: #555;
        }
    </style>
</head>
<body>

    <img
        class="letterhead-background"
        src="{{ public_path('images/finclears-letterhead-background.jpg') }}"
    >

    <div class="letter-content">

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

        <div class="recipient">
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

    </div>
</body>
</html>
