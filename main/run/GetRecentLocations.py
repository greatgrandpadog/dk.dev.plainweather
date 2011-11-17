#!/usr/bin/env python

import os, sys
sys.path.append(os.path.join(os.path.dirname( __file__ ),'../lib'))

from PlainWeatherUtils import *
        
if __name__=="__main__":
    """Program to get the most recent locations in Plain Weather application."""
    
    plain_weather_utils = PlainWeatherUtils()
    max_records = '5'
    if len(sys.argv) > 1:
        max_records = sys.argv[1]
    locations = plain_weather_utils.get_recent_locations(int(max_records))
    for loc in locations:
        print 'Location: {0}'.format(loc)


