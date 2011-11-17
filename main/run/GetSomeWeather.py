#!/usr/bin/env python

import os, sys
sys.path.append(os.path.join(os.path.dirname( __file__ ),'../lib'))

from PlainWeatherUtils import *
        
if __name__=="__main__":
    """Program to get the weather for a location in PlainWeather application."""
    
    plain_weather_utils = PlainWeatherUtils()
    location = '72601'
    if len(sys.argv) > 1:
        location = sys.argv[1]
    print plain_weather_utils.get_weather_for_location(location)
