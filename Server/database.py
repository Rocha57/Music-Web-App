from sqlalchemy import Column, Integer, String, create_engine, Date, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.sql import exists
from hashlib import md5

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    email = Column(String(50), nullable=False)
    password = Column(String(32), nullable=False)
    tracks = relationship("Track", back_populates="user")
    playlists = relationship("Playlist", back_populates="user")


tracks_playlists = Table('tracks_playlists', Base.metadata,
                         Column('track_id', ForeignKey('tracks.id'), primary_key=True),
                         Column('playlist_id', ForeignKey('playlists.id'), primary_key=True)
                         )


class Track(Base):
    __tablename__ = "tracks"
    id = Column(Integer, primary_key=True)
    title = Column(String(50), nullable=False)
    artist = Column(String(50), nullable=False)
    album = Column(String(50), nullable=False)
    release_year = Column(Date, nullable=False)
    #path = Column(String(50), nullable=False)
    owner = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="tracks")
    playlists = relationship("Playlist", secondary=tracks_playlists, back_populates="tracks")


class Playlist(Base):
    __tablename__ = "playlists"
    id = Column(Integer, primary_key=True)
    title = Column(String(50), nullable=False)
    date = Column(Date, nullable=False)
    owner = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="playlists")
    tracks = relationship("Track", secondary=tracks_playlists, back_populates="playlists")


def init_db():
    uri = 'mysql+pymysql://root:root@localhost/es'
    engine = create_engine(uri, echo=True)
    Session = sessionmaker(bind=engine)
    Base.metadata.create_all(engine)
    db_session = Session()
    if not db_session.query(User).count():
        admin = User(name="admin", email="admin", password=md5(b"admin").hexdigest())
        db_session.add(admin)
        db_session.commit()
    return db_session

