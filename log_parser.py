from os import listdir
import json
import sys

import db_interaction

# Parsing command line to get desired folder in which to pull logs from
folder_name = sys.argv[1]

# Setting up the DB connection
db = db_interaction.DbInteraction()


class IdHandler:
    """ Class to help keep track of IDs being created in the SQLite DB

    """
    def __init__(self):
        self.collection_id = 0
        self.sample_id = 0
        self.location_id = 0
        self.tris_id = 0
        self.batch_id = 0


def get_files(path):
    """ gets all files from a directory

    :param path: desired directory
    :return: list of all files in directory
    """
    return listdir(path)


def read_json_file(path):
    """ load all data from JSON file

    :param path: path of the file desired to be read
    :raise TypeError when trying to read a nonJSON file
    :return: dict with all JSON file data
    """
    current_json_file = open(path, "r")
    if path.find(".json") > 0:
        file_data = json.load(current_json_file)
        current_json_file.close()
    else:
        current_json_file.close()
        raise TypeError("Not a JSON file")
    return file_data


def parse_collections(json_data, id_handler):
    """  Takes a collection and parses it for all relevant data for storage in DB

    :param json_data: data desired for parsing
    :param id_handler: Used to keep track and store used IDs
    """
    collections = json_data["collections"]
    for collection in collections:
        id_handler.collection_id = id_handler.collection_id + 1

        # Remove samples and location for handling separately
        samples = collection.pop("samples")
        location = collection.pop("location")

        # Add ID to object
        collection["id"] = id_handler.collection_id
        db.query("""INSERT INTO collection 
            VALUES(:id, :datetime, :seed, :act, :world, :scene, :quest, :quest_step, :class)""", collection)

        # Handle child objects
        _parse_samples(samples, id_handler, collection["id"])
        _parse_location(location, id_handler, collection["id"])


def _parse_samples(sample_list, id_handler, collection_id):
    """ Helper function to store samples into DB

    :param sample_list: samples to be added
    :param id_handler: to help with keeping track of IDs
    :param collection_id: collection in which samples belong
    """
    for sample in sample_list:
        id_handler.sample_id = id_handler.sample_id + 1

        #Setup IDs for itself and its parent
        sample["id"] = id_handler.sample_id
        sample["collectionID"] = collection_id

        # Remove tris and batches for handling later
        tris = sample.pop("tris")
        batches = sample.pop("batches")

        # Here for sanity of it adding the samples as it can be a lot of data
        print(sample)
        db.query("""INSERT INTO sample 
            VALUES (:id, :collectionID, :datetime, :fps, :num_particle_systems, :num_particles, :domino_step_ms,
            :num_static_rigid_bodies, :num_kinematic_rigid_bodies, :num_dynamic_rigid_bodies, :num_awake_bodies, 
            ":Main Thread bound", 
            ":GPU bound")""", sample)

        # Handle removed children
        _parse_tris(tris, id_handler, sample["id"])
        _parse_batches(batches, id_handler, sample["id"])


def _parse_location(locations, id_handler, collection_id):
    """ Helper function to store samples into DB

    :param locations: location to be added
    :param id_handler: to help with keeping track of IDs
    :param collection_id: collection in which location  belong
    """
    id_handler.location_id = id_handler.location_id + 1
    locations["id"] = id_handler.location_id
    locations["collectionID"] = collection_id
    db.query("""INSERT INTO location VALUES (:id, :collectionID, :x, :y, :y)""", locations)


def _parse_tris(tris, id_handler, sample_id):
    """ Helper function to store tris into DB

    :param tris: tris to be added
    :param id_handler: to help with keeping track of IDs
    :param sample_id: sample in which it belongs
    """
    for tri in tris:
        # Set up dict to add all data to
        data = {}
        data["value"] = tri
        id_handler.tris_id = id_handler.tris_id + 1
        data["id"] = id_handler.tris_id
        data["sampleID"] = sample_id
        db.query("INSERT INTO tris VALUES (:id, :sampleID, :value)", data)


def _parse_batches(batches, id_handler, sample_id):
    """ Helper function to store batches into DB

    :param batches: tris to be added
    :param id_handler: to help with keeping track of IDs
    :param sample_id: sample in which it belongs
    """
    for batch in batches:
        # Set up dict to add all data to
        data = {}
        data["value"] = batch
        id_handler.batch_id = id_handler.batch_id + 1
        data["id"] = id_handler.batch_id
        data["sampleID"] = sample_id
        db.query("INSERT INTO batches VALUES (:id, :sampleID, :value)", data)


def main():
    """ Does all the parsing magic by reading desired directory of all JSON files and saving them to DB

    """
    # Build DB
    db.create_db()
    id_handler = IdHandler()
    files = get_files(folder_name)
    json_data = []

    # Go through each file and read JSON data
    for file in files:
        try:
            current_json_data = read_json_file(folder_name + "/" + file)
            json_data.append(current_json_data)
        except TypeError:
            # in case of non-JSON file, print a simple error message
            print("failed to read file: " + file)

    # Push JSON data into DB
    for entry in json_data:
        parse_collections(entry, id_handler)


main()
