

from contextlib import closing
from sqlalchemy import *
from sqlalchemy.orm import mapper, sessionmaker
from xml.dom import minidom
import urllib2
import datetime
import os, sys

from Location import *
from LocationUtils import *

sys.path.append(os.path.join(os.path.dirname( __file__ ),'../framework'))
from DataInterfaceObject import *

class PlainWeatherUtils(DataInterfaceObject):
    def __init__(self):
        super(PlainWeatherUtils, self).__init__("localhost", "foobar", "bar", "plainweather")        
        self._locations_utils = LocationUtils(self._db_host, self._db_user, self._db_password, self._db_name)
  
                   
    def initialize_database(self):
        """Initializes database for Plain Weather application."""
        self.create_database(self._db_name, True)           
        with closing(self._db_engine.connect()) as connection:
            metadata = MetaData(connection)    
            self.create_tables(connection, self.construct_tables, True)
            self._locations_utils.add_comments_to_locations_table(connection, "")  
        
        
    def construct_tables(self, metadata):
        self._locations_utils.construct_locations_table(metadata)
 
            
    def get_weather_for_location(self, location):
        weather_url = 'http://www.google.com/ig/api?weather=' + location
        req = urllib2.Request(weather_url, None, {'user-agent':'syncstream/vimeo'})
        opener = urllib2.build_opener() 
        f = opener.open(req)
        xml_results = f.read()
        self.__remember_weather_query(location, xml_results)
        return xml_results       


    def get_recent_locations(self, max_records):
        location_records = self._locations_utils.get_location_records(max_records)
        locations = [loc.name for loc in location_records]
        return locations       

   
    def __remember_weather_query(self, location, xml_results):
        try:
            xml_dom = minidom.parseString(xml_results)
            problem = xml_dom.getElementsByTagName('problem_cause')
            if (len(problem) == 0):
                cities = xml_dom.getElementsByTagName('city')
                if (len(cities) > 0):
                    city_node = cities[0]
                    city_data = city_node.getAttribute('data')
                    location_record = self._locations_utils.update_location_record_time(city_data, datetime.datetime.now())
        #StandardError does not pick up minidom parsing error.
        except:
            return
        
        
        
        
        



                

