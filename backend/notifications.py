from urllib.parse import urlencode
from urllib.request import Request, urlopen
import os
from dotenv import load_dotenv

load_dotenv()

private_key = os.getenv('PUSHSAFE')

def send_notification(title, message, icon=1, dev=False):
  group = 'gs4140' if dev else 'a'
  # chosen_icon = 15 if dev else icon

  if dev:
    title = f'(Debug) {title}'

  if private_key is None:
    raise ConnectionError('No private key')
  url = 'https://www.pushsafer.com/api'
  post_fields = {
    't' : title,
    'm' : message,
    'v' : 3,
    'i' : icon,
    'd' : group,
    'k' : private_key, 
  }

  request = Request(url, urlencode(post_fields).encode())
  json = urlopen(request).read().decode()
  return json
