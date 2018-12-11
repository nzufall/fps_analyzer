import sqlite3


class DbInteraction:
    """ Creates SQLite3 DB and opens a connection to it

    """
    def __init__(self):
        self.DB_NAME = "FPS_LOGS.DB"

        # Start the DB
        self.conn = sqlite3.connect(self.DB_NAME)
        self.c = self.conn.cursor()

    def _create_collection_table(self):
        """ Helper function that builds the collection table

        """
        self.c.execute("""CREATE TABLE collection (
            id INTEGER,
            datetime NUMERIC,
            seed INTEGER,
            act TEXT,
            world TEXT,
            scene TEXT,
            quest TEXT,
            quest_step INTEGER,
            class TEXT
            )""")

    def _create_location_table(self):
        """ Helper function that builds the location table

        """
        self.c.execute("""CREATE TABLE location (
            id INTEGER,
            collectionID INTEGER,
            x REAL,
            y REAL,
            z REAL
            )""")

    def _create_sample_table(self):
        """ Helper function that builds the sample table

        """
        self.c.execute("""CREATE TABLE sample (
            id INTEGER,
            collectionID INTEGER,
            datetime NUMERIC,
            fps REAL,
            num_particle_systems INTEGER,
            num_particles INTEGER,
            domino_step_ms REAL,
            num_static_rigid_bodies INTEGER,
            num_kinematic_rigid_bodies INTEGER,
            num_dynamic_rigid_bodies INTEGER,
            num_awake_bodies INTEGER,
            [Main Thread bound] TEXT,
            [GPU bound] TEXT    
            )""")

    def _create_batches_table(self):
        """ Helper function that builds the batches table

        """
        self.c.execute("""CREATE TABLE batches (
            id INTEGER,
            sampleID INTEGER,
            value INTEGER
            )""")

    def _create_tris_table(self):
        """ Helper function that builds the tris table

        """
        self.c.execute("""CREATE TABLE tris (
            id INTEGER,
            sampleID INTEGER,
            value INTEGER
            )""")

    def create_db(self):
        """ Builds DB to support Log parsing

        """
        # Create all the tables
        self._create_collection_table()
        self._create_location_table()
        self._create_sample_table()
        self._create_batches_table()
        self._create_tris_table()

        # Push all data to DB
        self.conn.commit()

    def query(self, query_string, fields):
        """ Runs desired query with desired params against the DB

        :param query_string: desired query to execute
        :param fields: OPTIONAL. used to insert values into query string
        :return: all data gathered by running the query
        """
        if fields is None:
            self.c.execute(query_string)
        else:  # fields is not None
            self.c.execute(query_string, fields)
        self.conn.commit()
        results = self.c.fetchall()
        return results
