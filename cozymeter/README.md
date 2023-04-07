# Notes

This is the following this [tutorial](https://learn.adafruit.com/dht-humidity-sensing-on-raspberry-pi-with-gdocs-logging/python-setup)

Install the [CircuitPython-DHT Library](https://github.com/adafruit/Adafruit_CircuitPython_DHT)

```bash
pip install adafruit-circuitpython-dht
```

```bash
sudo apt-get install libgpiod2
```

## Wiring

The data pin of the AM2302 can go to a GPIO. The naming convention is the GPIO name.

## Cron Job

Make sure to change the source to the correct one.

Run:

```bash
chmod 700 reading.sh
```

Then create a cron job

```bash
crontab -e
* * * * * ~/74bully/cozymeter/reading.sh
```
