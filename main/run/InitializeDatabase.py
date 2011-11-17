

import os, sys
sys.path.append(os.path.join(os.path.dirname( __file__ ),'../lib'))

from PlainWeatherUtils import *
        
if __name__=="__main__":
    """Program to initialize database for Plain Weather application."""
    
    print "Initializing database..."
    plain_weather_utils = PlainWeatherUtils()
    plain_weather_utils.initialize_database() 
    print "Done."
        
    