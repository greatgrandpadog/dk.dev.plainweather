# Applicaton: jsontest1
#
# Using json and sqlalchemy and web py to serve county info for states of Missouri and Kansas
# Also uses mod_wsgi


import os
import web
import json
import sys

from web.contrib.template import render_mako

sys.path.append(os.path.dirname(__file__))

from GetWeather import *
from GetLocations import *

sys.path.append(os.path.join(os.path.dirname( __file__ ),'lib'))
from PlainWeatherUtils import PlainWeatherUtils

urls = (
    '/', 'PlainWeather',
    '/getweather', 'GetWeather',
    '/getlocations', 'GetLocations'
)

render = render_mako(
        directories=['templates'],
        input_encoding='utf-8',
        output_encoding='utf-8',
        )


app = web.application(urls, globals())
curdir = os.path.dirname(__file__)
session = web.session.Session(app, web.session.DiskStore(os.path.join(curdir,'sessions')),)
application = app.wsgifunc()


class PlainWeather:
    def __init__(self):
        base_dir = os.path.dirname(os.path.realpath(__file__))
        os.chdir(base_dir)
        return

    def GET(self):
        plain_weather_utils = PlainWeatherUtils()
        recent = plain_weather_utils.get_recent_locations(5)
        return render.plainweather(name='plainweather', recent_locations = recent)


