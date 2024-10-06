exports.qrcodeInvitation = (url) =>  `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Invitation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #333333;
        }
        .event-details {
            margin-bottom: 20px;
        }
        .event-details p {
            margin: 10px 0;
            color: #666666;
        }
        .qr-code {
            text-align: center;
            margin: 20px 0;
        }
        .qr-code img {
            max-width: 200px;
            border: 2px solid #333333;
            padding: 10px;
            background-color: #ffffff;
        }
        .footer {
            text-align: center;
            color: #999999;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>You're Invited to [Event Name]</h1>
        </div>
        <div class="event-details">
            <p><strong>Date:</strong> [Event Date]</p>
            <p><strong>Time:</strong> [Event Time]</p>
            <p><strong>Location:</strong> [Event Location]</p>
        </div>
        <div class="qr-code">
            <p>Scan the QR code below to access your ticket:</p>
            <img src="${url}" alt="Event QR Code">
        </div>
        <div class="footer">
            <p>If you have any questions, feel free to contact us at [Contact Email].</p>
            <p>Looking forward to seeing you at the event!</p>
        </div>
    </div>
</body>
</html>
`;