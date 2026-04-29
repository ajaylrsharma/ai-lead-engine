import os
import requests

RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
FROM_EMAIL = os.environ.get('FROM_EMAIL', 'outreach@yourdomain.com')


def send_email(to: str, subject: str, body: str) -> tuple:
    if not RESEND_API_KEY:
        return False, 'RESEND_API_KEY not configured'
    try:
        response = requests.post(
            'https://api.resend.com/emails',
            headers={
                'Authorization': f'Bearer {RESEND_API_KEY}',
                'Content-Type': 'application/json',
            },
            json={'from': FROM_EMAIL, 'to': [to], 'subject': subject, 'text': body},
            timeout=10,
        )
        if response.ok:
            return True, ''
        return False, response.json().get('message', 'Send failed')
    except Exception as e:
        return False, str(e)
