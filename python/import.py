import pandas as pd
import numpy as np
from sqlalchemy import create_engine
import sys
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('db', help='Database name')
parser.add_argument('csv', help='CSV File name')
parser.add_argument('session_id', help='CSV File name')
parser.add_argument('chunks', help='CSV File name')
args = parser.parse_args()

# Arguments: DB file, CSV file, session id, chunks
engine = create_engine('sqlite:///{}'.format(args.db))

df = pd.read_csv(args.csv)
df['time'] = pd.to_datetime(df['time'])
df['sessionId'] = args.session_id

chunks = np.array_split(df, int(args.chunks))
for idx, chunk in enumerate(chunks):
  print(idx)
  sys.stdout.flush()
  chunk.to_sql('Data', con=engine, if_exists='append', index=False)

