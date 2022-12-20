"""
Generate PDF for access tickets
"""

from fpdf import FPDF
from datetime import datetime
import random
import string

def generate_pdf(fname, lname, email, additional_information, year: str, subject, priority_number: int):
  pdf = FPDF()
  pdf.add_page()
  pdf.set_font(family='helvetica', size=0)

  with open('static/form-template.html', encoding='UTF-8') as file:
    html = file.read()

  now = datetime.now()

  # dd/mm/YY H:M:S
  dt_string = now.strftime('%d/%m/%Y - %H:%M:%S')

  html = html.replace('{{date}}', dt_string)


  priority = {
    1: 'I will not be able to afford a ball ticket without a discount ticket',
    2: 'I will struggle to afford a ball ticket without a discount or will have to go without necessities to afford a full price ball ticket',
    3: 'I would have to budget very carefully to be able afford a full price ball ticket',
    4: 'I am able to buy a full price ticket but a discount would help'
  }

  html = html.replace('{{fname}}', fname)
  html = html.replace('{{lname}}', lname)
  html = html.replace('{{email}}', email)
  html = html.replace('{{email}}', email)
  html = html.replace('{{additional}}', additional_information)
  html = html.replace('{{year}}', year)
  html = html.replace('{{subject}}', subject)
  html = html.replace('{{priority}}', priority[priority_number])
  html = html.replace('{{pno}}', str(priority_number))

  pdf.write_html(html)

  pdf.set_title('Student Access Form')
  pdf.set_author('Exeter College Ball Committee')

  letters = ''.join(random.choice(string.ascii_letters) for _ in range(5))
  file_name = letters + '-' + fname.lower() + '-' + lname.lower() + '-access-ticket-form.pdf'

  pdf.output(file_name)
  return file_name
