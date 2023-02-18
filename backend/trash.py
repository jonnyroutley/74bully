"""
Module to fetch data from the Council website for bin days.
"""
import notifications
import os
import logging
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from urllib3.exceptions import InsecureRequestWarning
from urllib3 import disable_warnings
# disable warnings from using verify=False in get/post requests
disable_warnings(InsecureRequestWarning)
load_dotenv()



logging.basicConfig(
  handlers=[logging.FileHandler(filename="./log.log",
    encoding="utf-8", mode="a+")],
  level=logging.DEBUG,
  format="%(asctime)s %(message)s",
  datefmt="%m/%d/%Y %I:%M:%S %p"
)

class Bin:
  """
  Bin class
  """
  def __init__(self, color, description):
    self.color = color
    self.description = description

  def SetDate(self, date):
    date_string = date.split(": ")[-1]
    date_time = datetime.strptime(date_string, "%A %d %B %Y")
    self.collection_date = date_time


class Bins:
  """
  Bins class holds a dictionary of the bins with their colours
  """
  def __init__(self):
    self.bins : dict[str, Bin]= {}

  def AddBin(self, new_bin : Bin):
    self.bins[new_bin.color] = new_bin

  def PopulateBins(self, p_tags):
    for html_text in p_tags:
      for value in self.bins.values():
        if value.description in html_text:
          value.SetDate(html_text)

  def Jsonify(self):
    bin_list = []
    for val in self.bins.values():
      val.collection_date = str(val.collection_date.date())
      bin_list.append(val.__dict__)
    return bin_list

  def SendMessage(self):
    today = datetime.today()
    colors = []
    for (key, value) in self.bins.items():
      if value.collection_date.date() - timedelta(days=1) == today.date():
        colors.append(key.lower())
    bin_string = ""

    if len(colors) > 0:
      if len(colors) == 1:
        bin_string = colors[0]
      else:
        bin_string = colors[0]
        for i in range(1, len(colors) - 1):
          bin_string += ", " + colors[i]
        bin_string += " and " + colors[-1]

      title = "⚠️ Time to BinReal. ⚠️"

      if len(colors) == 1:
        message = "The " + bin_string + " bin needs to go out tonight."
      else:
        message = "The " + bin_string + " bins need to go out tonight."
      notifications.send_notification(title, message, 136)
      # notifications.SendFakeNotification(title, message)
      # return 1 if notification is sent else 0
      return 1

    # notifications.send_notification("All Good My G",
    #  "Give yourself a pat on the back", 15, True)
    return 0

def get_bin_data():
  bin_url = "https://www.oxford.gov.uk/mybinday"

  payload1 = {
    "q6ad4e3bf432c83230a0347a6eea6c805c672efeb_0_0": os.getenv("POSTCODE"),
    "q6ad4e3bf432c83230a0347a6eea6c805c672efeb_1_0": os.getenv("PROPERTYREF"),
    "page": 355
  }

  s = requests.session()
  s.post(bin_url, data=payload1)

  payload1["next"] = "Next"
  r2 = s.post(bin_url, data=payload1)
  soup2 = BeautifulSoup(r2.content, "html.parser")

  ps = soup2.select("div.editor > p")
  p_text = [p.text for p in ps]

  my_bins = Bins()
  my_bins.AddBin(Bin("Green", "Refuse"))
  my_bins.AddBin(Bin("Blue", "Recycling"))
  my_bins.AddBin(Bin("Food", "Food"))

  my_bins.PopulateBins(p_text)

  return my_bins
