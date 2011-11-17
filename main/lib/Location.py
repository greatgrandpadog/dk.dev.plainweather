#!/usr/bin/env python


class Location(object):
    def __init__(self, id, name, date_pulled):
        self.id = id
        self.name = name
        self.datePulled = date_pulled

    def __repr__(self):
        return "<Location({0},{1},{2})>".format(self.id, self.name, self.datePulled)


