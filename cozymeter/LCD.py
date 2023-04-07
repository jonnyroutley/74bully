import RPi.GPIO as GPIO
import time

LCD_RS = 7
LCD_E  = 8
LCD_D4 = 25
LCD_D5 = 24
LCD_D6 = 23
LCD_D7 = 18
 
#Constants
LCD_WIDTH = 16    # Maximum characters per line
LCD_CHR = True
LCD_CMD = False
 
LCD_LINE_1 = 0x80 # LCD RAM address for the 1st line
LCD_LINE_2 = 0xC0 # LCD RAM address for the 2nd line
 
# Timing constants
E_PULSE = 0.0005
E_DELAY = 0.0005

class LCD:
    def __init__(self):
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BCM)       # Use BCM GPIO numbers
        GPIO.setup(LCD_E, GPIO.OUT)  # E
        GPIO.setup(LCD_RS, GPIO.OUT) # RS
        GPIO.setup(LCD_D4, GPIO.OUT) # DB4
        GPIO.setup(LCD_D5, GPIO.OUT) # DB5
        GPIO.setup(LCD_D6, GPIO.OUT) # DB6
        GPIO.setup(LCD_D7, GPIO.OUT) # DB7
        self.__lcd_init()
        
    def __lcd_init(self):
        # Initialise display
        self.__lcd_byte(0x33,LCD_CMD) # 110011 Initialise
        self.__lcd_byte(0x32,LCD_CMD) # 110010 Initialise
        self.__lcd_byte(0x06,LCD_CMD) # 000110 Cursor move direction
        self.__lcd_byte(0x0C,LCD_CMD) # 001100 Display On,Cursor Off, Blink Off
        self.__lcd_byte(0x28,LCD_CMD) # 101000 Data length, number of lines, font size
        self.__lcd_byte(0x01,LCD_CMD) # 000001 Clear display
        time.sleep(E_DELAY)
        
    def __lcd_byte(self, bits, mode):
        GPIO.output(LCD_RS, mode) # RS
        
        # High bits
        GPIO.output(LCD_D4, False)
        GPIO.output(LCD_D5, False)
        GPIO.output(LCD_D6, False)
        GPIO.output(LCD_D7, False)
        if bits&0x10==0x10:
            GPIO.output(LCD_D4, True)
        if bits&0x20==0x20:
            GPIO.output(LCD_D5, True)
        if bits&0x40==0x40:
            GPIO.output(LCD_D6, True)
        if bits&0x80==0x80:
            GPIO.output(LCD_D7, True)
        
        # Toggle 'Enable' pin
        self.lcd_toggle_enable()
        
        # Low bits
        GPIO.output(LCD_D4, False)
        GPIO.output(LCD_D5, False)
        GPIO.output(LCD_D6, False)
        GPIO.output(LCD_D7, False)
        if bits&0x01==0x01:
            GPIO.output(LCD_D4, True)
        if bits&0x02==0x02:
            GPIO.output(LCD_D5, True)
        if bits&0x04==0x04:
            GPIO.output(LCD_D6, True)
        if bits&0x08==0x08:
            GPIO.output(LCD_D7, True)
        
        # Toggle 'Enable' pin
        self.lcd_toggle_enable()
        
    def lcd_toggle_enable(self):
        # Toggle enable
        time.sleep(E_DELAY)
        GPIO.output(LCD_E, True)
        time.sleep(E_PULSE)
        GPIO.output(LCD_E, False)
        time.sleep(E_DELAY)

    def setLine(self, message:str="", line:int=1):
        if line not in [1,2]:
            raise ValueError("Not a valid line. The LCD is a 16x2 display.")
        
        if len(message) > LCD_WIDTH:
            print(f"Trimming your string: {message}.\nThe maximum length is {LCD_WIDTH}!")
            message = message[:LCD_WIDTH]
        
        if line == 1:
            line_address = LCD_LINE_1
        elif line == 2:
            line_address = LCD_LINE_2
        else:
            raise ValueError("Error parsing line number")
        
        message = message.ljust(LCD_WIDTH, " ")
        self.__lcd_byte(line_address, LCD_CMD)

        for i in range(LCD_WIDTH):
            self.__lcd_byte(ord(message[i]), LCD_CHR)

def main():
    lcd = LCD()
    lcd.setLine("Hello World", 1)
    lcd.setLine("Wazzzup", 2)

if __name__ == "__main__":
    main()