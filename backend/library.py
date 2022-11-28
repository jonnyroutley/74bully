days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"]

def parse_times(times):
  items = times.split("|")

  times_parsed = dict.fromkeys(days, "closed")
  
  for time in items:
    my_time = time.strip()

    splits = my_time.split(":")
    if len(splits) == 2:
      [days_str, times_str] = splits
      days_str = days_str.strip()
      times_str = times_str.strip()

      if "–" in days_str:
        # Array of times i.e. Mon-Fri
        [start, end] = days_str.split("–")
        start_index = days.index(start)
        end_index = days.index(end)
        for i in range(start_index, end_index+1):
          times_parsed[days[i]] = times_str
      else:
        # List of times
        my_days = days_str.split(",")
        for each_day in my_days:
          times_parsed[each_day.strip()] = times_str

  return times_parsed


