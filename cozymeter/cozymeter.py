"""
Read the AM2302 sensor for temperature and humidity
"""
import time
import board
import adafruit_dht
import requests
from LCD import LCD

dhtDevice = adafruit_dht.DHT22(board.D4)

url = "https://api.74bully.com/reading/add"
# Try 10 times
lcd = LCD()
while True:
    try:
        # Print the values to the serial port
        temperature = dhtDevice.temperature
        humidity = dhtDevice.humidity

        if temperature is not None:
            createdAt = time.time()
            data = {
                "temperature": temperature,
                "humidity": humidity,
                "createdAt": createdAt
            }
            # r = requests.post(url, json=data)
            # print(r.text)
            lcd.setLine(f"Temp: {temperature:.1f}ßC", 1)
            lcd.setLine(f"Hmd:  {humidity:.1f}%", 2)

    except RuntimeError as error:
        # Errors happen fairly often, DHT's are hard to read, just keep going
        print(error.args[0])
        time.sleep(0.1)

    except Exception as error:
        dhtDevice.exit()
        raise error

    time.sleep(1.0)