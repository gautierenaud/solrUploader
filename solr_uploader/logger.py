import logging

FORMAT = '[%(asctime)s:%(levelname)s %(filename)s:line %(lineno)s (%(funcName)s)] %(message)s'
logging.basicConfig(level=logging.DEBUG, format=FORMAT)
log = logging.getLogger()
