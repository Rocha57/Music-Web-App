import logging
import os

import connexion
from database import init_db, User, Track, Playlist
from sqlalchemy import desc
from hashlib import md5
from flask import jsonify
from flask_cors import CORS

db_session = init_db()
session = {}


def logout():
    session.clear()


def login(email, password):
    user = db_session.query(User).filter(User.email == email).filter(User.password == md5(str.encode(password)).hexdigest()).first()
    if user:
        session['id'] = user.id
        return jsonify(user.to_json())


def register(name, email, password):
    user = User(name=name, email=email, password=md5(str.encode(password)).hexdigest())
    db_session.add(user)
    db_session.commit()
    login(user.email, user.password)
    return jsonify(user.to_json())


def get_tracks():
    if session:
        tracks = db_session.query(Track)
        return jsonify([t.to_json() for t in tracks])
    return 'Unauthorized - Forbidden Access', 403


def get_tracks_from_user(user_id):
    if user_id == session['id']:
        tracks = db_session.query(Track).filter(Track.owner == user_id).all()
        return jsonify([t.to_json() for t in tracks])
    return 'Unauthorized - Forbidden Access', 403


def get_playlists_from_user(user_id, order="asc", attribute="title"):
    if user_id == session['id']:
        if order == "asc":
            if attribute == "title":
                playlists = db_session.query(Playlist).filter(Playlist.owner == user_id).order_by(Playlist.title).all()
            else:
                playlists = db_session.query(Playlist).filter(Playlist.owner == user_id).order_by(Playlist.date).all()
        else:
            if attribute == "title":
                playlists = db_session.query(Playlist).filter(Playlist.owner == user_id).order_by(desc(Playlist.title)).all()
            else:
                playlists = db_session.query(Playlist).filter(Playlist.owner == user_id).order_by(desc(Playlist.date)).all()
        return jsonify([p.to_json() for p in playlists])
    return 'Unauthorized - Forbidden Access', 403


def create_track(user_id, title, artist, album, year, file):
    if user_id == session['id']:
        track = Track(title=title, artist=artist, album=album, release_year=year, owner=user_id, path=file.filename)
        db_session.add(track)
        db_session.commit()
        file.save(os.path.join('uploads/', file.filename))
        return jsonify(track.to_json())
    return 'Unauthorized - Forbidden Access', 403


def get_track_info(track_id):
    track = db_session.query(Track).filter(Track.id == track_id).first()
    return jsonify(track.to_json())


def update_user(user_id, name=None, email=None, password=None):
    if user_id == session['id']:
        user = db_session.query(User).filter(User.id == user_id).first()
        if name:
            user.name = name
        if email:
            user.email = email
        if password:
            user.password = md5(str.encode(password)).hexdigest()
        db_session.commit()
    else:
        return 'Unauthorized - Forbidden Access', 403


def update_track(user_id, track_id, title=None, artist=None, album=None, release_year=None):
    if user_id == session['id']:
        track = db_session.query(Track).filter(Track.id == track_id).first()
        if track.owner == user_id:
            if title:
                track.title = title
            if artist:
                track.artist = artist
            if album:
                track.album = album
            if release_year:
                track.release_year = release_year
            db_session.commit()
    else:
        return 'Unauthorized', 403


def update_playlist(user_id, playlist_id, name=None):
    if user_id == session['id']:
        playlist = db_session.query(Playlist).filter(Playlist.id == playlist_id).first()
        if playlist.owner == user_id:
            print(name)
            if name:
                playlist.title = name
                db_session.commit()
    else:
        return 'Unauthorized - Forbidden Access', 403


def delete_track(user_id, track_id):
    if user_id == session['id']:
        track = db_session.query(Track).filter(Track.id == track_id).first()
        if track.owner == user_id:
            db_session.delete(track)
            db_session.commit()
    else:
        return 'Unauthorized - Forbidden Access', 403


def get_playlist_info(user_id, playlist_id):
    if user_id == session['id']:
        playlist = db_session.query(Playlist).filter(Playlist.id == playlist_id).first()
        return jsonify(playlist.to_json)
    return 'Unauthorized - Forbidden Access', 403


def get_tracks_from_playlist(user_id, playlist_id):
    if user_id == session['id']:
        tracks = db_session.query(Track).filter(Track.playlists.any(Playlist.id == playlist_id)).all()
        return jsonify([t.to_json() for t in tracks])
    return 'Unauthorized - Forbidden Access', 403


def add_track_to_playlist(user_id, playlist_id, track_id):
    if user_id == session['id']:
        playlist = db_session.query(Playlist).filter(Playlist.id == playlist_id).first()
        track = db_session.query(Track).filter(Track.id == track_id).first()
        if playlist.owner == user_id:
            playlist.tracks.append(track)
            db_session.commit()
            return jsonify(playlist.to_json())
    return 'Unauthorized - Forbidden Access', 403


def remove_track_from_playlist(user_id, playlist_id, track_id):
    if user_id == session['id']:
        playlist = db_session.query(Playlist).filter(Playlist.id == playlist_id).first()
        track = db_session.query(Track).filter(Track.id == track_id).first()
        if playlist.owner == user_id:
            playlist.tracks.remove(track)
            db_session.commit()
            return jsonify(playlist.to_json())
    return 'Unauthorized - Forbidden Access', 403


def create_playlist(name, user_id):
    if user_id == session['id']:
        playlist = Playlist(title=name, owner=user_id)
        db_session.add(playlist)
        db_session.commit()
        return jsonify(playlist.to_json())
    return 'Unauthorized - Forbidden Access', 403


def delete_playlist(user_id, playlist_id):
    if user_id == session['id']:
        playlist = db_session.query(Playlist).filter(Playlist.id == playlist_id).first()
        if playlist.owner == user_id:
            db_session.delete(playlist)
            db_session.commit()
        else:
            return 'Unauthorized - Forbidden Access', 403
    else:
        return 'Unauthorized - Forbidden Access', 403


def search(title=None, artist=None):
    tracks = []
    if title and artist:
        tracks = db_session.query(Track).filter(Track.title == title).filter(Track.artist == artist).all()
    elif title:
        tracks = db_session.query(Track).filter(Track.title == title).all()
    elif artist:
        tracks = db_session.query(Track).filter(Track.artist == artist).all()
    return jsonify([t.to_json() for t in tracks])


def fibonacci(n):
    if n <= 2:
        return 1
    return fibonacci(n - 1) + fibonacci(n - 2)


def httpfibonacci(n):
    return 'Fibonacci(' + str(n) + ') = ' + str(fibonacci(n))

if __name__ == '__main__':
    print("DIRECTORY "+os.getcwd())
    os.makedirs('uploads/', exist_ok=True)
    logging.basicConfig(level=logging.INFO)
    app = connexion.App(__name__)
    app.add_api('swagger.yaml')
    application = app.app
    application.config['UPLOAD_FOLDER'] = 'uploads/'
    CORS(application)
    app.run(host='0.0.0.0')
