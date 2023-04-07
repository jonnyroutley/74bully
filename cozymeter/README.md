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

## LCD 1602

Some nice reading on the topic <3:

[Specification](https://www.openhacks.com/uploadsproductos/eone-1602a1.pdf)

## Running the display as a system process

Uses `systemd` to run.

Make a service:

```bash
sudo vim /etc/systemd/system/cozymeter.service
```

```
[Unit]
Description=Cozymeter for LCD
After=multi-user.target
[Service]
Type=simple
Restart=always
ExecStart=/home/fraser/74bully/cozymeter/env/bin/python /home/fraser/74bully/cozymeter/cozymeter.py
[Install]
WantedBy=multi-user.target
```

Now run the following commands:

```bash
sudo systemctl daemon-reload
sudo systemctl enable cozymeter.service
sudo systemctl start test.service
```

The service is now running. It will restart upon failure although failure is probs bad since we handle `RuntimeError` so an `Exception` is probably not recoverable.

### Extra commands

```bash
sudo systemctl stop cozymeter.service
sudo systemctl restart cozymeter.service
sudo systemctl status cozymeter.service
```

Wanna check the `syslogs`? I bet you do:

```bash
vim /var/log/syslog
```

And quit without saving is `:q!` if you forget you silly person xxx.

### Reading

- [Simple tutorial](https://medium.com/codex/setup-a-python-script-as-a-service-through-systemctl-systemd-f0cc55a42267)
- [In depth reading](https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services-and-units)
