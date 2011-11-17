#!/usr/bin/env python

import json

import os, sys
sys.path.append(os.path.join(os.path.dirname( __file__ ),'data'))
from PlainWeatherUtils import PlainWeatherUtils

class GetLocations:

    def GET(self):
        plain_weather_utils = PlainWeatherUtils()
        recent = plain_weather_utils.get_recent_locations(5)
        return json.dumps(recent)


