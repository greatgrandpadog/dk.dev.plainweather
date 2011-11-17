#!/usr/bin/env python


import uuid
from contextlib import closing
from sqlalchemy import *
from sqlalchemy.orm import mapper, class_mapper
from sqlalchemy.orm.exc import UnmappedClassError
from sqlalchemy.dialects.mysql import *
import os, sys
sys.path.append(os.path.join(os.path.dirname( __file__ ),'../framework'))

from Location import *
from DataInterfaceObject import *

class LocationUtils(DataInterfaceObject):
    def __init__(self, db_host, db_user, db_password, db_name):
        super(LocationUtils, self).__init__(db_host, db_user, db_password, db_name)
        self._locations_table_name = "locations"   
        self._locations_column_name_id = 'id'
        self._locations_column_name_name = 'name'
        self._locations_column_name_date_pulled = 'datePulled'           
        self._locations_table = None
  
        
    def construct_locations_table(self, metadata):
        """Construct sqlalchemy table objects. Called by base class CreateTables() method."""
        default_table_options = { u'mysql_engine': u'InnoDB', u'mysql_default charset': u'utf8', u'mysql_collate': u'utf8_unicode_ci'}        
               
        self._locations_table = Table(self._locations_table_name, metadata,
            Column(self._locations_column_name_id, CHAR(36), primary_key=True),
            Column(self._locations_column_name_name, String(50)),
            Column(self._locations_column_name_date_pulled, DATETIME, nullable=False)
            , **default_table_options)
        self._locations_table.create()       

              
    def add_comments_to_locations_table(self, connection, prefix):
        """Adds comments to columns in the locations table."""
        self.add_comments_to_table(connection, self._locations_table_name,
            {self._locations_column_name_id: 'should be a uuid',
            self._locations_column_name_name: 'should be the location entered',
            self._locations_column_name_date_pulled: 'date & time of last query'})
  
        
    def map_locations_table(self):
        """Maps locations table to Location class for Plain Weather application."""
        if self._locations_table == None:
            with closing(self._db_engine.connect()) as connection:
                metadata = MetaData(connection)
                #Presuming that locations table has already been created explicity SQL and SqlAlchemy reflection.
                self._locations_table = Table(self._locations_table_name, metadata, autoload=True)
        try:
            class_mapper(Location)
        except UnmappedClassError:
            mapper(Location, self._locations_table)            
  
                    
    def add_location_record(self, name, date_pulled):
        with closing(self._session_factory()) as session:            
            location = Location(uuid.uuid1(), name, date_pulled)
            session.add(location)
            session.commit()
 
    def update_location_record_time(self, location_name, date_pulled):
        self.map_locations_table()
        with closing(self._session_factory()) as session:
            records = session.query(Location).filter(Location.name == location_name).order_by(Location.datePulled).all()
            if len(records) > 0:
                records[0].datePulled = date_pulled
            else:
                location = Location(uuid.uuid1(), location_name, date_pulled)
                session.add(location)
            session.commit()                
          
    def get_location_records(self, max_records):
        self.map_locations_table()
        with closing(self._session_factory()) as session: 
            return session.query(Location).order_by(-Location.datePulled).limit(max_records).all()          
  
            
    def get_location_record(self, location_name):
        self.map_locations_table()
        with closing(self._session_factory()) as session:
            records = session.query(Location).filter(Location.name==location_name).order_by(Location.datePulled).all()
            if len(records) > 0:
                return records[0]
            else:
                return None
