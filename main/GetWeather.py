#!/usr/bin/env python

import os
import web
import sys
import re
from web.contrib.template import render_mako

import os, sys
sys.path.append(os.path.join(os.path.dirname( __file__ ),'lib'))
from PlainWeatherUtils import PlainWeatherUtils

render = render_mako(
        directories=['templates'],
        input_encoding='utf-8',
        output_encoding='utf-8',
        )

class GetWeather:
    def __init__(self):
            base_dir = os.path.dirname(os.path.realpath(__file__))
            os.chdir(base_dir)
            return


    def GET(self):
        query_prefix = "location="
        location = web.ctx.query
        location = re.sub('^\?location=','',location)
        location = re.sub('^\?','',location)
        plain_weather_utils = PlainWeatherUtils()
        web.header('Content-Type', 'text/xml')
        return plain_weather_utils.get_weather_for_location(location)
        
    


          
        
        

