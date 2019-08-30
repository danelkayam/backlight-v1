# backlight v1

>**This project is depricated and no longer maintained**

---
   
### Description
   Controls and manages the backlight of my desktop screen.
   The following project was the code which manages the colors of the backlight. It containes two modes: single color and party mode.

   controlling the backlight operation was done via an html interface which contains
   toggle buttons.

   The code was running as a node server on the raspberry-pi zero w.

   The arduino was running a custom firmata+ code for handling ws2812 | neopixels led strip.

   The raspberry pi and the arduino are connected with a custom usb which I made myself. 

   See pictures in the `pictures` directory.

### Running the project:
   The service requires the following environment variables (can be placed for development in a .env file):
   ```bash
# General
LOG_LEVEL='debug'

# server configurations
PORT=3000

# Board configurations
DATA_PIN=6
STRIP_LENGTH=36
PARTY_ANIMATION_FPS=10
DEAFAULT_COLOR='#d6c728'
   ```


****
### Why not mqtt?
   At that time I thought about two things:
   1. This will be my only connected device for a long time and I dind't want an external server.
   2. I wanted to play with socket.io and Johnny-Five libs.
   
   Since I've seen this project works and used it for a while (almost an year!), I wanted more. And mqtt is the solution for next version.

### Why not connecting the ws2812 to the raspberry pi and saving the arduino?
This is the fist thing I've done, but there is a huge caveat: the gpios on the raspberry requires root permission, which requires the node server to run with root permission: big NO-NO.
Now I'm not quite sure if it's correct :|

### Links I've used for the project:

* [Adafruit Neopixel Uberguide](https://learn.adafruit.com/adafruit-neopixel-uberguide)
* [Installing minimal raspbian](https://mike632t.wordpress.com/2015/09/26/raspbian-minimal-install-using-console/)
* [Installing Node js on rapsberry pi](https://github.com/audstanley/NodeJs-Raspberry-Pi/)
* [Firmata with Neopixels 1](https://github.com/ajfisher/node-pixel)
* [Firmata with Neopixels 2](https://github.com/iamvery/artoo-neopixel/blob/master/firmata/StandardFirmata-NeoPixel.ino)
* [Firmata with Neopixels explaination](https://chrisruppel.com/blog/arduino-johnny-five-neopixel/)
* [When apt-get not resolving adresses](https://www.raspberrypi.org/forums/viewtopic.php?t=17016)
* [Running nodejs from boot 1](https://github.com/chovy/node-startup)
* [Running nodejs from boot 2](https://www.axllent.org/docs/view/nodejs-service-with-systemd/)
* [Setting .local domain instead of typing ip all the time](https://www.howtogeek.com/167190/how-and-why-to-assign-the-.local-domain-to-your-raspberry-pi/)