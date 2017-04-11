import logging
import connexion
import database


def hello_world():
    return 'Hello World!'


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    db_session = database.init_db()
    app = connexion.App(__name__)
    app.add_api('swagger.yaml')

    application = app.app
    app.run(port=8080)
